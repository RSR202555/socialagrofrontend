import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Target, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-agro.jpg';

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = statsRef.current?.querySelectorAll('.stat-card');
    elements?.forEach((el, index) => {
      (el as HTMLElement).style.animationDelay = `${index * 150}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Users, value: '40+', label: 'PERFIS GERENCIADOS' },
    { icon: Briefcase, value: '+10', label: 'SERVIÇOS OFERECIDOS' },
    { icon: Target, value: '5', label: 'NICHOS DO AGRO ATENDIDOS' },
  ];

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-agro-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-agro-gold animate-pulse" />
            <span className="text-primary-foreground/90 text-sm font-medium tracking-wider uppercase">
              Agromarketing Especializado • Resultados Comprovados
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up delay-100">
            Conecte o agro ao digital com quem entende dos{' '}
            <span className="text-agro-gold">dois mundos</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            Construímos autoridade digital para a sua marca, fazenda, consultor,
            influenciador ou empresa do agro com gestão profissional de mídias sociais
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-300">
            <Button
              variant="gold"
              size="lg"
              onClick={() => scrollToSection('contato')}
              className="w-full sm:w-auto"
            >
              CONSULTORIA GRATUITA
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              onClick={() => scrollToSection('planos')}
              className="w-full sm:w-auto"
            >
              VER PLANOS
            </Button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card opacity-0 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-6 hover:bg-primary-foreground/15 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 rounded-lg bg-agro-gold/20 group-hover:bg-agro-gold/30 transition-colors">
                    <stat.icon className="w-6 h-6 text-agro-gold" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-primary-foreground font-heading">
                      {stat.value}
                    </div>
                    <div className="text-xs text-primary-foreground/70 font-medium tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
