import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db";

const router = Router();

const toCentavos = (valor?: string | number | null) => {
  if (valor === undefined || valor === null) return null;

  const raw = String(valor).trim();
  if (!raw) return null;

  // Se tiver vírgula ou ponto, tratar como valor em reais com casas decimais
  if (raw.includes(",") || raw.includes(".")) {
    const normalized = raw.replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
    const num = Number(normalized);
    if (Number.isNaN(num)) return null;
    return Math.round(num * 100);
  }

  // Só dígitos: interpretar como reais inteiros e converter para centavos
  const numeric = Number(raw.replace(/[^0-9]/g, ""));
  if (Number.isNaN(numeric)) return null;
  return numeric * 100;
};

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const FIXED_ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FIXED_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/register", async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body as { nome?: string; email?: string; senha?: string };

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const existing = await query("SELECT id FROM admins WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ error: "Já existe um admin com esse email" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await query(
      "INSERT INTO admins (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, criado_em",
      [nome, email, senhaHash]
    );

    const admin = result.rows[0];

    return res.status(201).json({ admin });
  } catch (error) {
    console.error("Erro ao registrar admin:", error);
    return res.status(500).json({ error: "Erro ao registrar admin" });
  }
});

router.put("/clientes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email, senha, plano, data_pagamento, valor_personalizado } = req.body as {
    nome?: string;
    email?: string;
    senha?: string;
    plano?: string;
    data_pagamento?: string;
    valor_personalizado?: string | number;
  };

  if (!nome || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  try {
    // Verificar se existe outro cliente com o mesmo email
    const existing = await query("SELECT id FROM clientes WHERE email = $1 AND id <> $2", [email, id]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ error: "Já existe um cliente com esse email" });
    }

    let result;

    const valorCentavos = toCentavos(valor_personalizado ?? null);

    if (senha && senha.trim().length > 0) {
      const senhaHash = await bcrypt.hash(senha, 10);
      result = await query(
        "UPDATE clientes SET nome = $1, email = $2, senha_hash = $3, plano = $4, data_pagamento = $5, valor_personalizado_centavos = $6 WHERE id = $7 RETURNING id, nome, email, plano, data_pagamento, valor_personalizado_centavos, criado_em",
        [nome, email, senhaHash, plano || null, data_pagamento || null, valorCentavos, id]
      );
    } else {
      result = await query(
        "UPDATE clientes SET nome = $1, email = $2, plano = $3, data_pagamento = $4, valor_personalizado_centavos = $5 WHERE id = $6 RETURNING id, nome, email, plano, data_pagamento, valor_personalizado_centavos, criado_em",
        [nome, email, plano || null, data_pagamento || null, valorCentavos, id]
      );
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    return res.json({ cliente: result.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, senha } = req.body as { email?: string; senha?: string };

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    // Se credenciais fixas estiverem configuradas no .env, usar esse caminho simples
    if (FIXED_ADMIN_EMAIL && FIXED_ADMIN_PASSWORD) {
      if (email === FIXED_ADMIN_EMAIL && senha === FIXED_ADMIN_PASSWORD) {
        const token = jwt.sign(
          { sub: 1, email: FIXED_ADMIN_EMAIL, nome: "Admin", role: "admin" },
          JWT_SECRET,
          { expiresIn: "8h" }
        );

        return res.json({
          token,
          admin: { id: 1, nome: "Admin", email: FIXED_ADMIN_EMAIL },
        });
      }

      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Caminho padrão usando banco de dados
    const result = await query("SELECT id, nome, email, senha_hash FROM admins WHERE email = $1", [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const admin = result.rows[0] as { id: number; nome: string; email: string; senha_hash: string };

    const senhaOk = await bcrypt.compare(senha, admin.senha_hash);
    if (!senhaOk) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, nome: admin.nome, role: "admin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token, admin: { id: admin.id, nome: admin.nome, email: admin.email } });
  } catch (error) {
    console.error("Erro ao fazer login do admin:", error);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Clientes
router.get("/clientes", async (req: Request, res: Response) => {
  try {
    const result = await query(
      "SELECT id, nome, email, plano, data_pagamento, valor_personalizado_centavos, criado_em FROM clientes ORDER BY nome ASC"
    );
    return res.json({ clientes: result.rows });
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

router.post("/clientes", async (req: Request, res: Response) => {
  const { nome, email, senha, plano, data_pagamento, valor_personalizado } = req.body as {
    nome?: string;
    email?: string;
    senha?: string;
    plano?: string;
    data_pagamento?: string;
    valor_personalizado?: string | number;
  };

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const existing = await query("SELECT id FROM clientes WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      return res.status(409).json({ error: "Já existe um cliente com esse email" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const valorCentavos = toCentavos(valor_personalizado ?? null);

    const result = await query(
      "INSERT INTO clientes (nome, email, senha_hash, plano, data_pagamento, valor_personalizado_centavos) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, plano, data_pagamento, valor_personalizado_centavos, criado_em",
      [nome, email, senhaHash, plano || null, data_pagamento || null, valorCentavos]
    );

    return res.status(201).json({ cliente: result.rows[0] });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

// Programações por cliente
router.get("/clientes/:id/programacoes", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      "SELECT id, periodo, descricao, criado_em FROM programacoes WHERE cliente_id = $1 ORDER BY criado_em DESC",
      [id]
    );

    return res.json({ programacoes: result.rows });
  } catch (error) {
    console.error("Erro ao listar programações:", error);
    return res.status(500).json({ error: "Erro ao listar programações" });
  }
});

router.post("/clientes/:id/programacoes", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { periodo, descricao } = req.body as { periodo?: string; descricao?: string };

  if (!descricao) {
    return res.status(400).json({ error: "Descrição da programação é obrigatória" });
  }

  try {
    const result = await query(
      "INSERT INTO programacoes (cliente_id, periodo, descricao) VALUES ($1, $2, $3) RETURNING id, periodo, descricao, criado_em",
      [id, periodo || null, descricao]
    );

    return res.status(201).json({ programacao: result.rows[0] });
  } catch (error) {
    console.error("Erro ao cadastrar programação:", error);
    return res.status(500).json({ error: "Erro ao cadastrar programação" });
  }
});

export default router;
