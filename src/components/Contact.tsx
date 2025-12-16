import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Send,
  Leaf,
} from 'lucide-react';

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.animate-on-scroll');
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-fade-up');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Mensagem enviada!',
      description: 'Entraremos em contato em breve.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/socialagromedia', label: 'socialagromedia' },
  ];

  const quickLinks = [
    { label: 'Início', id: 'inicio' },
    { label: 'Nova Era', id: 'nova-era' },
    { label: 'Feiras e Eventos', id: 'feiras-eventos' },
    { label: 'Empresas', id: 'empresas' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="py-24 bg-gradient-hero relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-agro-gold/10 rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Form */}
          <div className="animate-on-scroll opacity-0">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Entre em <span className="text-agro-gold">Contato</span>
            </h2>

            <p className="text-primary-foreground/80 mb-8">
              Pronto para transformar a presença digital do seu negócio no agro? 
              Fale conosco e agende uma consultoria gratuita.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-agro-gold"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="email"
                  type="email"
                  placeholder="Seu e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-agro-gold"
                />

                <Input
                  name="phone"
                  type="tel"
                  placeholder="Seu telefone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-agro-gold"
                />
              </div>

              <Textarea
                name="message"
                placeholder="Sua mensagem"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-agro-gold resize-none"
              />

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="animate-on-scroll opacity-0 space-y-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-primary-foreground mb-4">
                Informações de Contato
              </h3>

              <a
                href="https://wa.me/5575998884064"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                aria-label="WhatsApp (75) 99888-4064"
              >
                <div className="p-3 rounded-lg bg-primary-foreground/10">
                  <Phone className="w-5 h-5 text-agro-gold" />
                </div>
                <span>(75) 99888-4064</span>
              </a>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-heading text-xl font-bold text-primary-foreground mb-4">
                Redes Sociais
              </h3>

              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="px-4 py-3 rounded-lg bg-primary-foreground/10 hover:bg-agro-gold/20 transition-colors group inline-flex items-center gap-2"
                  >
                    <social.icon className="w-5 h-5 text-primary-foreground group-hover:text-agro-gold transition-colors" />
                    <span className="text-primary-foreground/90 text-sm font-medium group-hover:text-agro-gold transition-colors">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-xl font-bold text-primary-foreground mb-4">
                Links Rápidos
              </h3>

              <div className="flex flex-wrap gap-2">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(link.id)}
                    className="px-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Social Agro"
                className="h-10 w-auto"
              />
            </div>

            {/* Copyright */}
            <p className="text-primary-foreground/60 text-sm">
              © 2024 Social Agro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
