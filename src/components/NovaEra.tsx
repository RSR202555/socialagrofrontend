import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Share2,
  Video,
  Palette,
  GraduationCap,
  Globe,
  Instagram,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const NovaEra = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  const services = [
    { icon: Calendar, label: 'Programação de conteúdo' },
    { icon: Share2, label: 'Gestão de redes sociais' },
    { icon: Video, label: 'Edição de vídeo e imagem' },
    { icon: Palette, label: 'Criação e desenvolvimento de identidade visual digital' },
    { icon: GraduationCap, label: 'Treinamento de equipes' },
    { icon: Globe, label: 'Criação e manutenção de sites' },
  ];

  const achievements = [
    'Cobertura e marketing completo de dois dos maiores eventos agropecuários da Bahia por 2 anos consecutivos',
    'Atuação com Sindicato Rural referência estadual',
    'Marketing de um dos maiores podcasts do Agro',
    'Gestão para consultora agrícola referência no Nordeste',
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="nova-era"
      ref={sectionRef}
      className="py-24 bg-gradient-subtle relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-agro-cream/50 -skew-x-12 origin-top-right" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div>
            {/* Badge */}
            <div className="animate-on-scroll opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                Nova Era
              </span>
            </div>

            {/* Title */}
            <h2 className="animate-on-scroll opacity-0 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
              O Agro entrou no digital, e ficar para trás{' '}
              <span className="text-primary">não é uma opção</span>
            </h2>

            {/* Description */}
            <p className="animate-on-scroll opacity-0 text-lg text-muted-foreground mb-8">
              Na Social Agro, unimos conhecimento do campo com estratégia digital. 
              Entendemos as necessidades únicas do agronegócio e traduzimos em 
              presença online que gera resultados reais.
            </p>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="animate-on-scroll opacity-0 flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="p-2 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {service.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Highlight */}
            <div className="animate-on-scroll opacity-0 flex items-center gap-3 p-4 rounded-lg bg-agro-gold/10 border border-agro-gold/30 mb-8">
              <Instagram className="w-6 h-6 text-agro-gold" />
              <span className="font-medium text-foreground">
                Nosso carro-chefe:{' '}
                <span className="text-primary font-semibold">
                  Gestão de redes sociais (Instagram, TikTok, YouTube, Facebook)
                </span>
              </span>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div className="animate-on-scroll opacity-0">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-agro-gold rounded-full" />
                Resultados Comprovados
              </h3>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm leading-relaxed">
                      {achievement}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-border">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={() => scrollToSection('contato')}
                >
                  Faça parte da Nova Era do Agro!
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NovaEra;
