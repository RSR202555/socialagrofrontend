import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, CalendarRange, ListTodo, LogOut } from "lucide-react";

type Cliente = {
  id: number;
  nome: string;
  email: string;
  plano?: string | null;
  data_pagamento?: string | null;
   valor_personalizado_centavos?: number | null;
  criado_em: string;
};

type Programacao = {
  id: number;
  periodo: string | null;
  descricao: string;
  criado_em: string;
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [programacoes, setProgramacoes] = useState<Programacao[]>([]);
  const [isLoadingClientes, setIsLoadingClientes] = useState(false);
  const [isLoadingProgramacoes, setIsLoadingProgramacoes] = useState(false);
  const [clienteNome, setClienteNome] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [clienteSenha, setClienteSenha] = useState("");
  const [clientePlano, setClientePlano] = useState("");
  const [clienteDataPagamento, setClienteDataPagamento] = useState("");
  const [clienteValorPersonalizado, setClienteValorPersonalizado] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPlano, setEditPlano] = useState("");
  const [editDataPagamento, setEditDataPagamento] = useState("");
  const [editSenha, setEditSenha] = useState("");
  const [editValorPersonalizado, setEditValorPersonalizado] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      void fetchClientes();
    }
  }, [navigate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const fetchClientes = async () => {
    setIsLoadingClientes(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/admin/clientes", {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao carregar clientes");
        return;
      }
      setClientes(data.clientes || []);
    } catch (err) {
      setError("Erro de conexão ao carregar clientes");
    } finally {
      setIsLoadingClientes(false);
    }
  };

  const fetchProgramacoes = async (clienteId: number) => {
    setIsLoadingProgramacoes(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/admin/clientes/${clienteId}/programacoes`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao carregar programações");
        return;
      }
      setProgramacoes(data.programacoes || []);
    } catch (err) {
      setError("Erro de conexão ao carregar programações");
    } finally {
      setIsLoadingProgramacoes(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/admin/clientes", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: clienteNome,
          email: clienteEmail,
          senha: clienteSenha,
          plano: clientePlano,
          data_pagamento: clienteDataPagamento || null,
          valor_personalizado: clienteValorPersonalizado || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar cliente");
        return;
      }
      setClientes((prev) => [...prev, data.cliente]);
      setClienteNome("");
      setClienteEmail("");
      setClienteSenha("");
      setClientePlano("");
      setClienteDataPagamento("");
      setClienteValorPersonalizado("");
    } catch (err) {
      setError("Erro de conexão ao cadastrar cliente");
    }
  };

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setProgramacoes([]);
    void fetchProgramacoes(cliente.id);
  };

  const openEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setEditNome(cliente.nome);
    setEditEmail(cliente.email);
    setEditPlano(cliente.plano || "");
    setEditDataPagamento(cliente.data_pagamento ? cliente.data_pagamento.substring(0, 10) : "");
    setEditSenha("");
    setEditValorPersonalizado(
      typeof cliente.valor_personalizado_centavos === "number"
        ? (cliente.valor_personalizado_centavos / 100).toFixed(2).replace(".", ",")
        : ""
    );
  };

  const handleUpdateCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCliente) return;
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/admin/clientes/${editingCliente.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          nome: editNome,
          email: editEmail,
          senha: editSenha || undefined,
          plano: editPlano || null,
          data_pagamento: editDataPagamento || null,
          valor_personalizado: editValorPersonalizado || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao atualizar cliente");
        return;
      }

      const updated = data.cliente as Cliente;
      setClientes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

      if (selectedCliente && selectedCliente.id === updated.id) {
        setSelectedCliente(updated);
      }

      setEditingCliente(null);
    } catch (err) {
      setError("Erro de conexão ao atualizar cliente");
    }
  };

  const handleCreateProgramacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) return;
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:3000/admin/clientes/${selectedCliente.id}/programacoes`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ periodo, descricao }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar programação");
        return;
      }
      setProgramacoes((prev) => [data.programacao, ...prev]);
      setPeriodo("");
      setDescricao("");
    } catch (err) {
      setError("Erro de conexão ao cadastrar programação");
    }
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col bg-gradient-to-br from-[#00170f] via-[#002919] to-[#00170f] relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-agro-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-agro-green-light/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/50 px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#00170f] via-[#002919] to-[#00170f] backdrop-blur">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-agro-gold/80 mb-1">Área restrita</p>
          <h1 className="font-heading text-xl md:text-2xl font-bold text-primary-foreground flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-agro-gold/15 border border-agro-gold/40">
              <Users className="h-4 w-4 text-agro-gold" />
            </span>
            Painel do Admin
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border-agro-gold text-agro-gold hover:bg-agro-gold hover:text-primary-foreground gap-1"
        >
          <LogOut className="w-3 h-3" />
          Sair
        </Button>
      </header>

      <main className="relative z-10 flex-1 p-4 md:p-6 flex flex-col gap-4">
        {/* Resumo rápido */}
        <section className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-agro-gold/40 bg-black/20 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-agro-gold/80">Clientes</p>
              <p className="font-heading text-xl text-primary-foreground">{clientes.length}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-agro-gold/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-agro-gold" />
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-black/15 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Programações</p>
              <p className="font-heading text-xl text-primary-foreground">
                {selectedCliente ? programacoes.length : "-"}
              </p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="rounded-xl border border-border/50 bg-black/10 px-4 py-3 hidden md:flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Período atual</p>
              <p className="text-sm text-primary-foreground/90">
                {selectedCliente ? "Editando programação" : "Selecione um cliente"}
              </p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-agro-green-light/15 flex items-center justify-center">
              <CalendarRange className="w-5 h-5 text-primary-foreground/90" />
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.1fr,2fr] flex-1 min-h-0">
        {/* Coluna esquerda: Clientes */}
        <section className="rounded-2xl border border-border/70 bg-card/95 backdrop-blur p-4 md:p-5 flex flex-col gap-4 shadow-lg shadow-black/20">
          <div>
            <h2 className="font-heading font-semibold mb-1">Clientes</h2>
            <p className="text-xs text-muted-foreground">
              Cadastre e selecione um cliente para gerenciar a programação.
            </p>
          </div>

          <form onSubmit={handleCreateCliente} className="space-y-2">
            <Input
              placeholder="Nome do cliente"
              value={clienteNome}
              onChange={(e) => setClienteNome(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="E-mail do cliente"
              value={clienteEmail}
              onChange={(e) => setClienteEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha do cliente"
              value={clienteSenha}
              onChange={(e) => setClienteSenha(e.target.value)}
              required
            />
            <Input
              type="date"
              placeholder="Data de pagamento"
              value={clienteDataPagamento}
              onChange={(e) => setClienteDataPagamento(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Valor mensal personalizado (opcional)"
              value={clienteValorPersonalizado}
              onChange={(e) => setClienteValorPersonalizado(e.target.value)}
            />
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              value={clientePlano}
              onChange={(e) => setClientePlano(e.target.value)}
            >
              <option value="">Selecione um plano (opcional)</option>
              <option value="Básico">Básico</option>
              <option value="Profissional">Profissional</option>
              <option value="Premium">Premium</option>
            </select>
            <Button type="submit" className="w-full" size="sm">
              Cadastrar cliente
            </Button>
          </form>

          <div className="flex-1 overflow-auto border-t border-border/60 pt-3 mt-2">
            {isLoadingClientes ? (
              <p className="text-sm text-muted-foreground">Carregando clientes...</p>
            ) : clientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado ainda.</p>
            ) : (
              <ul className="space-y-2">
                {clientes.map((cliente) => (
                  <li key={cliente.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectCliente(cliente)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                        selectedCliente?.id === cliente.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">{cliente.nome}</div>
                      <div className="text-xs text-muted-foreground">{cliente.email}</div>
                      {cliente.plano && (
                        <div className="text-[11px] text-primary mt-0.5">Plano: {cliente.plano}</div>
                      )}
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-xs"
                      onClick={() => openEditCliente(cliente)}
                    >
                      ✎
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Coluna direita: Programação do cliente selecionado */}
        <section className="rounded-2xl border border-border/70 bg-card/95 backdrop-blur p-4 md:p-5 flex flex-col gap-4 shadow-lg shadow-black/25">
          {selectedCliente ? (
            <>
              <div>
                <h2 className="font-heading font-semibold mb-1">
                  Programação - {selectedCliente.nome}
                </h2>
                <p className="text-xs text-muted-foreground">{selectedCliente.email}</p>
              </div>

              <form onSubmit={handleCreateProgramacao} className="space-y-3">
                <div className="flex gap-2 flex-col md:flex-row">
                  <Input
                    placeholder="Período (ex.: Semana 1, Março/2025)"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Descreva aqui a programação de posts, ações e entregas para este cliente..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="min-h-[120px]"
                  required
                />
                <Button type="submit" size="sm">
                  Salvar programação
                </Button>
              </form>

              <div className="border-t border-border/60 pt-3 mt-2 flex-1 overflow-auto">
                {isLoadingProgramacoes ? (
                  <p className="text-sm text-muted-foreground">Carregando programações...</p>
                ) : programacoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma programação cadastrada ainda para este cliente.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {programacoes.map((p) => (
                      <li key={p.id} className="border border-border/70 rounded-xl p-3 text-sm bg-background/60">
                        {p.periodo && (
                          <div className="text-xs font-semibold text-primary mb-1">{p.periodo}</div>
                        )}
                        <p className="whitespace-pre-line text-foreground mb-1">{p.descricao}</p>
                        <div className="text-[11px] text-muted-foreground">
                          {new Date(p.criado_em).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm">
              Selecione um cliente na coluna ao lado para cadastrar e visualizar a programação.
            </div>
          )}
        </section>
        </section>
      </main>

      {error && (
        <div className="px-6 pb-4 text-sm text-red-500">{error}</div>
      )}

      <Dialog open={!!editingCliente} onOpenChange={(open) => !open && setEditingCliente(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCliente} className="space-y-3 mt-2">
            <Input
              placeholder="Nome do cliente"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="E-mail do cliente"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Nova senha (opcional)"
              value={editSenha}
              onChange={(e) => setEditSenha(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Data de pagamento"
              value={editDataPagamento}
              onChange={(e) => setEditDataPagamento(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Valor mensal personalizado (opcional)"
              value={editValorPersonalizado}
              onChange={(e) => setEditValorPersonalizado(e.target.value)}
            />
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              value={editPlano}
              onChange={(e) => setEditPlano(e.target.value)}
            >
              <option value="">Selecione um plano (opcional)</option>
              <option value="Básico">Básico</option>
              <option value="Profissional">Profissional</option>
              <option value="Premium">Premium</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditingCliente(null)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar alterações</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
