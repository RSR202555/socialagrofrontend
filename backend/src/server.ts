import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { query, testConnection } from "./db";
import adminRoutes from "./adminRoutes";

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const MERCADOPAGO_WEBHOOK_URL = process.env.MERCADOPAGO_WEBHOOK_URL;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "social-agro-backend", docs: "/health, /admin/*, /payments/*" });
});

app.use("/admin", adminRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: "social-agro-backend" });
});

app.post("/payments/mercadopago/checkout", async (req: Request, res: Response) => {
  const { planName, price, clienteId } = req.body as { planName?: string; price?: string; clienteId?: number };

  if (!planName || !price) {
    return res.status(400).json({ error: "Dados do plano inválidos" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const apiBaseUrl = process.env.MERCADOPAGO_API_BASE_URL || "https://api.mercadopago.com";

  if (!accessToken) {
    return res.status(500).json({ error: "Access token do Mercado Pago não configurado" });
  }

  try {
    // Usar o valor recebido em reais diretamente
    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ error: "Preço inválido" });
    }

    const preferenceResponse = await fetch(`${apiBaseUrl}/checkout/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: `Plano ${planName}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: numericPrice,
          },
        ],
        ...(clienteId ? { external_reference: String(clienteId) } : {}),
        ...(MERCADOPAGO_WEBHOOK_URL ? { notification_url: MERCADOPAGO_WEBHOOK_URL } : {}),
      }),
    });

    if (!preferenceResponse.ok) {
      const errorText = await preferenceResponse.text();
      console.error("Erro Mercado Pago:", errorText);
      return res.status(500).json({ error: "Erro ao criar preferência de pagamento" });
    }

    const preferenceData = (await preferenceResponse.json()) as {
      id?: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    const checkoutUrl = preferenceData.init_point || preferenceData.sandbox_init_point;

    if (!checkoutUrl) {
      return res.status(500).json({ error: "Não foi possível obter o link de checkout" });
    }

    // Registrar tentativa de pagamento no banco (opcional, mas ajuda no histórico)
    if (clienteId) {
      try {
        await query(
          "INSERT INTO pagamentos (cliente_id, mp_preference_id, status, valor_centavos, criado_em) VALUES ($1, $2, $3, $4, NOW())",
          [clienteId, preferenceData.id || null, "pending", Math.round(numericPrice * 100)]
        );
      } catch (e) {
        // não bloquear checkout se falhar o registro
        console.error("Falha ao registrar pagamento pendente:", e);
      }
    }

    return res.json({ checkoutUrl });
  } catch (error) {
    console.error("Erro ao comunicar com Mercado Pago:", error);
    return res.status(500).json({ error: "Falha na comunicação com Mercado Pago" });
  }
});

// Webhook Mercado Pago
app.post("/payments/mercadopago/webhook", async (req: Request, res: Response) => {
  // Mercado Pago pode enviar dados via querystring e/ou body dependendo do tipo
  const topic = String(req.query.topic || req.query.type || "");
  const id = String(req.query.id || (req.body && (req.body.data?.id || req.body.id)) || "");

  // Sempre responder 200 rápido para não ficar re-tentando
  res.status(200).json({ received: true });

  if (!id) {
    console.warn("Webhook Mercado Pago recebido sem id", { topic, body: req.body });
    return;
  }

  // Processar apenas pagamentos (topic/type pode variar)
  if (topic && !String(topic).includes("payment")) {
    return;
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const apiBaseUrl = process.env.MERCADOPAGO_API_BASE_URL || "https://api.mercadopago.com";
  if (!accessToken) {
    console.error("Webhook Mercado Pago: access token não configurado");
    return;
  }

  try {
    const paymentRes = await fetch(`${apiBaseUrl}/v1/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!paymentRes.ok) {
      const txt = await paymentRes.text();
      console.error("Webhook Mercado Pago: falha ao buscar pagamento", txt);
      return;
    }

    const payment = (await paymentRes.json()) as {
      id: number;
      status?: string;
      status_detail?: string;
      transaction_amount?: number;
      date_approved?: string | null;
      date_created?: string;
      external_reference?: string | null;
      payment_method_id?: string;
    };

    const clienteId = payment.external_reference ? Number(payment.external_reference) : null;
    if (!clienteId || Number.isNaN(clienteId)) {
      console.warn("Webhook Mercado Pago: external_reference inválida", payment.external_reference);
      return;
    }

    const valorCentavos = payment.transaction_amount != null ? Math.round(payment.transaction_amount * 100) : null;
    const status = payment.status || "unknown";
    const pagoEm = payment.date_approved || null;

    // Upsert simples: atualiza o registro pelo mp_payment_id se já existir
    const existing = await query("SELECT id FROM pagamentos WHERE mp_payment_id = $1", [payment.id]);

    if (existing.rowCount && existing.rowCount > 0) {
      await query(
        "UPDATE pagamentos SET status = $1, status_detail = $2, valor_centavos = COALESCE($3, valor_centavos), pago_em = $4 WHERE mp_payment_id = $5",
        [status, payment.status_detail || null, valorCentavos, pagoEm, payment.id]
      );
    } else {
      await query(
        "INSERT INTO pagamentos (cliente_id, mp_payment_id, status, status_detail, valor_centavos, pago_em, criado_em) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
        [clienteId, payment.id, status, payment.status_detail || null, valorCentavos, pagoEm]
      );
    }
  } catch (error) {
    console.error("Erro ao processar webhook Mercado Pago:", error);
  }
});

// === Rotas da área do cliente ===

// Login do cliente (email + senha)
app.post("/client/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body as { email?: string; senha?: string };

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const result = await query(
      "SELECT id, nome, email, senha_hash, plano, data_pagamento, valor_personalizado_centavos FROM clientes WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const cliente = result.rows[0] as {
      id: number;
      nome: string;
      email: string;
      senha_hash: string;
      plano?: string | null;
      data_pagamento?: string | null;
      valor_personalizado_centavos?: number | null;
    };

    const bcrypt = await import("bcryptjs");
    const senhaOk = await bcrypt.default.compare(senha, cliente.senha_hash);

    if (!senhaOk) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        sub: cliente.id,
        email: cliente.email,
        nome: cliente.nome,
        role: "client",
        plano: cliente.plano ?? null,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        plano: cliente.plano ?? null,
        data_pagamento: cliente.data_pagamento ?? null,
        valor_personalizado_centavos: cliente.valor_personalizado_centavos ?? null,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login do cliente:", error);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Middleware simples para autenticar cliente via Bearer token
const authClientMiddleware = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: number;
      email: string;
      nome: string;
      role?: string;
    };

    // @ts-expect-error anexando info do cliente na request
    req.cliente = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Programações do cliente logado
app.get("/client/programacoes", authClientMiddleware, async (req: Request, res: Response) => {
  // @ts-expect-error payload anexado no middleware
  const cliente = req.cliente as { sub: number };

  try {
    const result = await query(
      "SELECT id, periodo, descricao, criado_em FROM programacoes WHERE cliente_id = $1 ORDER BY criado_em DESC",
      [cliente.sub]
    );

    return res.json({ programacoes: result.rows });
  } catch (error) {
    console.error("Erro ao listar programações do cliente:", error);
    return res.status(500).json({ error: "Erro ao listar programações" });
  }
});

// Status da mensalidade do cliente (último pagamento)
app.get("/client/pagamentos/ultimo", authClientMiddleware, async (req: Request, res: Response) => {
  // @ts-expect-error payload anexado no middleware
  const cliente = req.cliente as { sub: number };

  try {
    const result = await query(
      "SELECT mp_payment_id, status, status_detail, valor_centavos, pago_em, criado_em FROM pagamentos WHERE cliente_id = $1 ORDER BY COALESCE(pago_em, criado_em) DESC LIMIT 1",
      [cliente.sub]
    );

    return res.json({ pagamento: result.rows[0] || null });
  } catch (error) {
    console.error("Erro ao buscar último pagamento do cliente:", error);
    return res.status(500).json({ error: "Erro ao buscar pagamento" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  void testConnection();
});
