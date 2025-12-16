import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiUrl } from '@/lib/api';
import {
  Leaf,
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
} from 'lucide-react';

type Programacao = {
  id: number;
  periodo: string | null;
  descricao: string;
  criado_em: string;
};

type Pagamento = {
  mp_payment_id: number | null;
  status: string | null;
  status_detail: string | null;
  valor_centavos: number | null;
  pago_em: string | null;
  criado_em: string;
};

const ClientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'relatorios' | 'conteudos' | 'calendario' | 'configuracoes'>(
    'dashboard',
  );
  const [programacoes, setProgramacoes] = useState<Programacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [ultimoPagamento, setUltimoPagamento] = useState<Pagamento | null>(null);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  type ClientInfo = {
    id: number;
    nome: string;
    email: string;
    plano?: string | null;
    data_pagamento?: string | null;
    valor_personalizado_centavos?: number | null;
  };

  const clientInfo: ClientInfo | null = (() => {
    try {
      const raw = localStorage.getItem('client_info');
      return raw ? JSON.parse(raw) as ClientInfo : null;
    } catch {
      return null;
    }
  })();

  const menuItems: Array<{
    icon: typeof LayoutDashboard;
    label: string;
    key: 'dashboard' | 'relatorios' | 'conteudos' | 'calendario' | 'configuracoes';
  }> = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
    { icon: BarChart3, label: 'Relatórios', key: 'relatorios' },
    { icon: FileText, label: 'Conteúdos', key: 'conteudos' },
    { icon: Calendar, label: 'Calendário', key: 'calendario' },
    { icon: Settings, label: 'Configurações', key: 'configuracoes' },
  ];

  const getMonthlyPrice = () => {
    if (clientInfo?.valor_personalizado_centavos != null) {
      return clientInfo.valor_personalizado_centavos / 100;
    }

    if (clientInfo?.plano === 'Básico') return 997;
    if (clientInfo?.plano === 'Profissional') return 1997;
    if (clientInfo?.plano === 'Premium') return 3497;

    return 497; // fallback padrão
  };

  const formatPriceBRL = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('client_token');
    if (!token) {
      navigate('/painel');
      return;
    }

    const fetchProgramacoes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl('/client/programacoes'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Erro ao carregar programações');
          if (res.status === 401) {
            localStorage.removeItem('client_token');
            localStorage.removeItem('client_info');
            navigate('/painel');
          }
          return;
        }

        setProgramacoes(data.programacoes || []);
      } catch (err) {
        setError('Erro de conexão ao carregar programações');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUltimoPagamento = async () => {
      try {
        const res = await fetch(apiUrl('/client/pagamentos/ultimo'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          return;
        }
        setUltimoPagamento(data.pagamento || null);
      } catch {
        // ignorar erro de pagamento para não quebrar a tela
      }
    };

    void fetchProgramacoes();
    void fetchUltimoPagamento();
  }, [navigate]);

  const handlePayInvoice = async () => {
    setIsPaying(true);
    setPaymentError(null);

    try {
      const priceNumber = getMonthlyPrice();
      const priceString = String(priceNumber);

      const res = await fetch(apiUrl('/payments/mercadopago/checkout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName: clientInfo?.plano ? `Mensalidade ${clientInfo.plano}` : 'Mensalidade Social Agro',
          price: priceString,
          clienteId: clientInfo?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setPaymentError(data.error || 'Não foi possível gerar o link de pagamento.');
        return;
      }

      window.location.href = data.checkoutUrl as string;
    } catch (err) {
      setPaymentError('Erro de conexão ao iniciar o pagamento.');
    } finally {
      setIsPaying(false);
    }
  };

  const mensalidadePagaNesteMes = () => {
    if (!ultimoPagamento || ultimoPagamento.status !== 'approved' || !ultimoPagamento.pago_em) return false;
    const paid = new Date(ultimoPagamento.pago_em);
    const now = new Date();
    return paid.getFullYear() === now.getFullYear() && paid.getMonth() === now.getMonth();
  };

  const handleLogout = () => {
    localStorage.removeItem('client_token');
    localStorage.removeItem('client_info');
    navigate('/painel');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!senhaAtual || !novaSenha) {
      setPasswordMessage('Preencha a senha atual e a nova senha.');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setPasswordMessage('A confirmação da nova senha não confere.');
      return;
    }

    const token = localStorage.getItem('client_token');
    if (!token) {
      handleLogout();
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch(apiUrl('/client/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordMessage(data.error || 'Erro ao alterar senha.');
        return;
      }

      setPasswordMessage('Senha alterada com sucesso.');
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarNovaSenha('');
    } catch {
      setPasswordMessage('Erro de conexão ao alterar senha.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const getTabTitle = () => {
    if (activeTab === 'dashboard') return 'Dashboard do Cliente';
    if (activeTab === 'relatorios') return 'Relatórios';
    if (activeTab === 'conteudos') return 'Conteúdos';
    if (activeTab === 'calendario') return 'Calendário';
    return 'Configurações';
  };

  const getTabSubtitle = () => {
    if (activeTab === 'dashboard') {
      return clientInfo?.nome ? `Bem-vindo(a), ${clientInfo.nome}` : 'Bem-vindo de volta!';
    }
    if (activeTab === 'relatorios') return 'Acompanhe o status do seu projeto e mensalidade.';
    if (activeTab === 'conteudos') return 'Veja as programações recebidas organizadas.';
    if (activeTab === 'calendario') return 'Visualize suas programações por período.';
    return 'Atualize seus dados e preferências.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00170f] via-[#002919] to-[#00170f] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-black/40 border-r border-border/40 backdrop-blur-md">
        {/* Logo */}
        <div className="p-6 border-b border-border/40">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-agro-gold" />
            <span className="font-heading font-bold text-lg text-foreground">
              <span className="text-primary">Social</span> Agro
            </span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.key
                  ? 'bg-gradient-to-r from-primary to-agro-green-light text-primary-foreground shadow-md shadow-black/30'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border/40">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-agro-gold/20 flex items-center justify-center border border-agro-gold/60">
              <span className="text-agro-gold font-semibold">
                {clientInfo?.nome?.[0] || 'C'}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">
                {clientInfo?.nome || 'Cliente Social Agro'}
              </p>
              <p className="text-muted-foreground text-xs">{clientInfo?.email}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card">
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-black/60">
              <Link to="/" className="flex items-center gap-2">
                <Leaf className="w-6 h-6 text-agro-gold" />
                <span className="font-heading font-bold text-lg text-foreground">
                  <span className="text-primary">Social</span> Agro
                </span>
              </Link>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={() => {
                    setActiveTab(item.key);
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-gradient-to-r from-[#00170f] via-[#002919] to-[#00170f] border-b border-border/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-heading text-xl font-bold text-primary-foreground">{getTabTitle()}</h1>
              <p className="text-sm text-primary-foreground/80">{getTabSubtitle()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/5 rounded-lg">
              <Bell className="w-5 h-5 text-[#002919]" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-agro-gold rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-agro-gold/20 flex items-center justify-center border border-[#002919]/60">
                <span className="text-[#002919] font-semibold">
                  {clientInfo?.nome?.[0] || 'C'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card/95 rounded-2xl p-6 border border-border/60 shadow-lg shadow-black/30 backdrop-blur">
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">
                Sua programação
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Aqui você acompanha o que está planejado e o que já foi entregue para a sua marca.
              </p>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando programações...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : programacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Ainda não há programações cadastradas para sua conta.
                </p>
              ) : (
                <ul className="space-y-4">
                  {programacoes.map((p) => (
                    <li
                      key={p.id}
                      className="border border-border/70 rounded-xl p-4 bg-gradient-to-r from-background/80 to-agro-green-light/10 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary">
                            {p.periodo || 'Período não informado'}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(p.criado_em).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-line">{p.descricao}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-card/95 rounded-2xl p-6 border border-border/60 flex flex-col gap-4 shadow-lg shadow-black/30 backdrop-blur">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground">
                      Faturas e pagamentos
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Pague sua mensalidade de forma rápida e segura via Mercado Pago.
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-agro-gold/20 flex items-center justify-center border border-agro-gold/50">
                    <CreditCard className="w-5 h-5 text-agro-gold" />
                  </div>
                </div>

                <div className="border border-border rounded-xl p-4 bg-background/60 text-sm space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Plano</span>
                      <span className="font-medium text-foreground">
                        {clientInfo?.plano ? `Mensalidade ${clientInfo.plano}` : 'Mensalidade Social Agro'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="font-heading font-semibold text-foreground">
                        {formatPriceBRL(getMonthlyPrice())}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Próximo vencimento</span>
                      <span className="text-foreground">
                        {clientInfo?.data_pagamento
                          ? `Dia ${new Date(clientInfo.data_pagamento).getDate()} de cada mês`
                          : 'Dia 10 de cada mês'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      {mensalidadePagaNesteMes() ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          Pago
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Em aberto
                        </span>
                      )}
                    </div>
                    {mensalidadePagaNesteMes() && ultimoPagamento?.pago_em && (
                      <div className="text-[11px] text-muted-foreground">
                        Pago em {new Date(ultimoPagamento.pago_em).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border/60 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
                      Futuras faturas
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Próximo mês</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Em aberto
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Daqui a 2 meses</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                          Prevista
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Daqui a 3 meses</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                          Prevista
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {paymentError && (
                  <p className="text-sm text-red-500">{paymentError}</p>
                )}

                <Button
                  type="button"
                  onClick={handlePayInvoice}
                  disabled={isPaying}
                  className="w-full"
                  variant="gold"
                >
                  {isPaying ? 'Gerando link de pagamento...' : 'Pagar mensalidade agora'}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  O pagamento é processado via Mercado Pago. Você poderá escolher PIX, cartão ou boleto.
                </p>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border flex flex-col gap-4">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Dicas para aproveitar o painel
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    - Revise a programação com frequência e envie feedbacks para nossa equipe.
                  </p>
                  <p>
                    - Use as datas para se organizar com fotos, vídeos e informações importantes.
                  </p>
                  <p>
                    - Se algo estiver desatualizado, fale com a gente pelo WhatsApp ou e-mail.
                  </p>
                </div>
                <Link to="/#contato" className="mt-auto">
                  <Button variant="heroOutline" size="sm" className="w-full">
                    Falar com a equipe
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          ) : activeTab === 'relatorios' ? (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 bg-card/95 rounded-2xl p-6 border border-border/60 shadow-lg shadow-black/20 backdrop-blur">
                <h2 className="font-heading text-lg font-bold text-foreground mb-2">Resumo</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Informações rápidas sobre sua conta e andamento.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Programações</p>
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-heading text-2xl text-foreground mt-2">{programacoes.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Itens no painel</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Mensalidade</p>
                      {mensalidadePagaNesteMes() ? (
                        <TrendingUp className="w-4 h-4 text-primary" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <p className="font-heading text-2xl text-foreground mt-2">
                      {mensalidadePagaNesteMes() ? 'Em dia' : 'Pendente'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ultimoPagamento?.pago_em
                        ? `Último pagamento: ${new Date(ultimoPagamento.pago_em).toLocaleDateString()}`
                        : 'Sem registro de pagamento'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-border/60 bg-background/60 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Plano</span>
                    <span className="text-foreground">{clientInfo?.plano || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-muted-foreground">Valor mensal</span>
                    <span className="text-foreground">{formatPriceBRL(getMonthlyPrice())}</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/60">
                <h2 className="font-heading text-lg font-bold text-foreground mb-2">Ações</h2>
                <p className="text-sm text-muted-foreground mb-4">Atalhos úteis.</p>
                <Button type="button" className="w-full" variant="gold" onClick={handlePayInvoice} disabled={isPaying}>
                  {isPaying ? 'Gerando...' : 'Pagar mensalidade'}
                </Button>
                <Button type="button" className="w-full mt-2" variant="outline" onClick={() => setActiveTab('conteudos')}>
                  Ver conteúdos
                </Button>
              </div>
            </div>
          ) : activeTab === 'conteudos' ? (
            <div className="bg-card/95 rounded-2xl p-6 border border-border/60 shadow-lg shadow-black/20 backdrop-blur">
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">Conteúdos</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Suas programações recebidas.
              </p>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : programacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma programação encontrada.</p>
              ) : (
                <ul className="space-y-4">
                  {programacoes.map((p) => (
                    <li key={p.id} className="rounded-xl border border-border/60 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{p.periodo || 'Sem período'}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{new Date(p.criado_em).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-line mt-2">{p.descricao}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : activeTab === 'calendario' ? (
            <div className="bg-card/95 rounded-2xl p-6 border border-border/60 shadow-lg shadow-black/20 backdrop-blur">
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">Calendário</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Visualização por período das suas programações.
              </p>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : programacoes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma programação para exibir.</p>
              ) : (
                <div className="space-y-3">
                  {programacoes.map((p) => (
                    <div key={p.id} className="rounded-xl border border-border/60 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{p.periodo || 'Período não informado'}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{new Date(p.criado_em).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-line mt-2">{p.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 bg-card/95 rounded-2xl p-6 border border-border/60 shadow-lg shadow-black/20 backdrop-blur">
                <h2 className="font-heading text-lg font-bold text-foreground mb-2">Dados da conta</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Informações básicas da sua conta.
                </p>
                <div className="grid gap-3">
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Nome</p>
                    <p className="text-sm text-foreground mt-1">{clientInfo?.nome || '—'}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">E-mail</p>
                    <p className="text-sm text-foreground mt-1">{clientInfo?.email || '—'}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Plano</p>
                    <p className="text-sm text-foreground mt-1">{clientInfo?.plano || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border/60">
                <h2 className="font-heading text-lg font-bold text-foreground mb-2">Segurança</h2>
                <p className="text-sm text-muted-foreground mb-4">Troque sua senha quando necessário.</p>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <Input
                    type="password"
                    placeholder="Senha atual"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Nova senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    required
                  />
                  {passwordMessage && <p className="text-sm text-muted-foreground">{passwordMessage}</p>}
                  <Button type="submit" className="w-full" disabled={isSavingPassword}>
                    {isSavingPassword ? 'Salvando...' : 'Alterar senha'}
                  </Button>
                </form>

                <Button type="button" className="w-full mt-3" variant="outline" onClick={handleLogout}>
                  Sair da conta
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
