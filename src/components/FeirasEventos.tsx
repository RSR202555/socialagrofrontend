import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Camera, BarChart3, Trophy, ArrowRight } from 'lucide-react';

const FeirasEventos = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const openWhatsApp = () => {
    window.open('https://wa.me/5575998884064', '_blank', 'noopener,noreferrer');
  };

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

  const phases = [
    {
      icon: Calendar,
      title: 'PRÉ-EVENTO',
      description: 'Estratégia, posicionamento, divulgação e preparação completa para maximizar o alcance do seu evento.',
    },
    {
      icon: Camera,
      title: 'DURANTE',
      description: 'Cobertura em tempo real, fotos profissionais, vídeos dinâmicos e stories impactantes.',
    },
    {
      icon: BarChart3,
      title: 'PÓS-EVENTO',
      description: 'Conteúdo institucional, relatórios detalhados e fortalecimento contínuo da marca.',
    },
  ];

  const cases = [
    {
      title: 'AGROTECH Inhambupe',
      subtitle: '3ª maior feira da Bahia',
      description: 'Cobertura completa de marketing digital com resultados expressivos em engajamento e alcance.',
    },
    {
      title: 'SEALBA + Citros + Milho',
      subtitle: 'Parceria com Sindicato Rural',
      description: 'Estratégia integrada para múltiplos eventos do setor agropecuário baiano.',
    },
  ];

  return (
    <section
      id="feiras-eventos"
      ref={sectionRef}
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Feiras e Eventos
            </span>
          </div>

          <h2 className="animate-on-scroll opacity-0 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Feiras e Eventos <span className="text-primary">Agro</span>
          </h2>

          <p className="animate-on-scroll opacity-0 text-lg text-muted-foreground">
            Especialistas em marketing completo para feiras agropecuárias. 
            Do planejamento à execução, garantimos presença digital impactante em todas as etapas.
          </p>
        </div>

        {/* Phases */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {/* Number Badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                <phase.icon className="w-8 h-8 text-primary" />
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {phase.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>

        {/* Cases Section */}
        <div className="animate-on-scroll opacity-0">
          <div className="text-center mb-10">
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Cases de <span className="text-agro-gold">Sucesso</span>
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {cases.map((caseItem, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-primary/5 to-agro-gold/5 rounded-2xl p-8 border border-border hover:border-agro-gold/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-agro-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-agro-gold" />
                    <span className="text-xs font-semibold text-agro-gold uppercase tracking-wider">
                      Case de Sucesso
                    </span>
                  </div>

                  <h4 className="font-heading text-xl font-bold text-foreground mb-1">
                    {caseItem.title}
                  </h4>

                  <p className="text-sm text-primary font-medium mb-3">
                    {caseItem.subtitle}
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {caseItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="animate-on-scroll opacity-0 text-center mt-12">
          <Button variant="default" size="lg" onClick={openWhatsApp}>
            SAIBA MAIS
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeirasEventos;
