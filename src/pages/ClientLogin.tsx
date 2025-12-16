import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const ClientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login');
        return;
      }

      localStorage.setItem('client_token', data.token);
      localStorage.setItem('client_info', JSON.stringify(data.cliente));
      navigate('/painel/dashboard');
    } catch (err) {
      setError('Erro de conexão ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-agro-green-dark to-primary relative flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-agro-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-agro-green-light/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md md:max-w-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="w-8 h-8 text-agro-gold" />
          <span className="font-heading font-bold text-2xl text-primary-foreground">
            <span className="text-agro-gold">Social</span> Agro
          </span>
        </Link>

        {/* Card */}
        <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg border border-border space-y-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Painel do Cliente
            </h1>
            <p className="text-muted-foreground text-sm">
              Acesse sua conta para acompanhar seus projetos
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">
                  Senha
                </Label>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-4 text-sm text-muted-foreground">
                Ainda não é cliente?
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link to="/#contato">
            <Button
              variant="outline"
              className="w-full border-[#05a372] text-[#05a372] hover:bg-[#05a372] hover:text-primary-foreground"
            >
              Fale com a gente
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-foreground/60 text-sm mt-6">
          © 2024 Social Agro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default ClientLogin;
