import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Início', id: 'inicio' },
    { label: 'Nova Era', id: 'nova-era' },
    {
      label: 'Áreas',
      dropdown: [
        { label: 'Feiras e Eventos', id: 'feiras-eventos' },
        { label: 'Empresas', id: 'empresas' },
        { label: 'Sindicatos', id: 'sindicatos' },
        { label: 'Consultores', id: 'consultores' },
      ],
    },
    { label: 'Planos e Serviços', id: 'planos' },
    { label: 'Contato', id: 'contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection('inicio')}
          className="flex items-center gap-2 group"
        >
          <img
            src="/logo.png"
            alt="Social Agro"
            className={`h-11 md:h-12 w-auto transition-all ${
              isScrolled ? 'opacity-100' : 'opacity-100'
            }`}
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) =>
            item.dropdown ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className={`flex items-center gap-1 font-medium transition-colors hover:text-agro-gold ${
                    isScrolled ? 'text-foreground' : 'text-primary-foreground'
                  }`}
                >
                  {item.label}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border shadow-lg">
                  {item.dropdown.map((subItem) => (
                    <DropdownMenuItem
                      key={subItem.id}
                      onClick={() => scrollToSection(subItem.id)}
                      className="cursor-pointer hover:bg-muted focus:bg-muted"
                    >
                      {subItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors hover:text-agro-gold ${
                  isScrolled ? 'text-foreground' : 'text-primary-foreground'
                }`}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/5575998884064"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={`p-2 rounded-lg transition-colors hover:bg-white/10 ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/socialagromedia"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={`p-2 rounded-lg transition-colors hover:bg-white/10 ${
                isScrolled ? 'text-foreground' : 'text-primary-foreground'
              }`}
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          <Link to="/painel">
            <Button
              variant={isScrolled ? 'outline' : 'heroOutline'}
              size="sm"
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              Painel do Cliente
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 ${
            isScrolled ? 'text-foreground' : 'text-primary-foreground'
          }`}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
          <nav className="container mx-auto py-4 flex flex-col gap-2">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="flex flex-col">
                  <span className="px-4 py-2 font-semibold text-muted-foreground text-sm">
                    {item.label}
                  </span>
                  {item.dropdown.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => scrollToSection(subItem.id)}
                      className="px-6 py-2 text-left hover:bg-muted transition-colors"
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 text-left font-medium hover:bg-muted transition-colors"
                >
                  {item.label}
                </button>
              )
            )}
            <div className="px-4 pt-4 border-t border-border mt-2">
              <div className="flex items-center justify-center gap-3 pb-4">
                <a
                  href="https://wa.me/5575998884064"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/socialagromedia"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
              <Link to="/painel">
                <Button variant="outline" className="w-full gap-2">
                  <LogIn className="w-4 h-4" />
                  Painel do Cliente
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
