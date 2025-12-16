import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';

const Planos = () => {
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

  const handlePlanWhatsApp = (planName: string) => {
    const message = encodeURIComponent(
      `Olá! Tenho interesse em saber mais sobre o plano ${planName} da Social Agro.`
    );
    const phone = '5575998884064';
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const plans = [
    {
      name: 'Muda',
      icon: Zap,
      price: '997',
      period: '/mês',
      description: 'Ideal para quem está começando no digital',
      features: [
        'Planejamento de conteúdo estratégico',
        'Design gráfico',
        'Gestão de Redes Sociais (Instagram + Facebook)',
        'Edição e produção de vídeos',
        'Até 15 publicações mensais',
        'Criação de conteúdo exclusivo',
        'Narração',
      ],
      popular: false,
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Raíz',
      icon: Star,
      price: '1.997',
      period: '/mês',
      description: 'Para quem busca resultados consistentes',
      features: [
        'Tudo do plano anterior +',
        'Roteirista e copywriter',
        'Direção criativa',
        'Contato direto com colaboradores para produção de conteúdos',
        'Adição de três redes sociais (Tiktok, X e Linkedin)',
        'Quantidade ilimitada de posts.',
      ],
      popular: true,
      buttonVariant: 'gold' as const,
    },
    {
      name: 'Safra',
      icon: Crown,
      price: '3.497',
      period: '/mês',
      description: 'Gestão completa para marcas exigentes',
      features: [
        'Tudo do plano anterior +',
        'Criação e produção de conteúdo para canal do YouTube',
        'Equipe de modelos e apresentadores',
        'Todo material digital audiovisual necessário para empresa (inclusive para impressões físicas, como estampas de camisa, outdoors)',
        'Reuniões frequentes',
        'Criação ou manutenção de sites',
        'Gestão de tráfego pago',
        'Funis de Vendas e Contato inicial com Leads',
      ],
      popular: false,
      buttonVariant: 'default' as const,
    },
  ];

  return (
    <section
      id="planos"
      ref={sectionRef}
      className="py-24 bg-gradient-subtle relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-agro-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Star className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Planos e Serviços
            </span>
          </div>

          <h2 className="animate-on-scroll opacity-0 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Escolha o plano ideal para{' '}
            <span className="text-primary">seu negócio</span>
          </h2>

          <p className="animate-on-scroll opacity-0 text-lg text-muted-foreground">
            Soluções personalizadas para cada estágio do seu negócio no agro.
            Todos os planos incluem suporte especializado.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-on-scroll opacity-0 relative bg-card rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 ${
                plan.popular
                  ? 'border-agro-gold shadow-gold scale-105 z-10'
                  : 'border-border shadow-card hover:shadow-card-hover'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-agro-gold text-primary-foreground text-sm font-semibold">
                  Mais Popular
                </div>
              )}

              {/* Icon */}
              <div
                className={`p-4 rounded-xl w-fit mb-6 ${
                  plan.popular ? 'bg-agro-gold/20' : 'bg-primary/10'
                }`}
              >
                <plan.icon
                  className={`w-8 h-8 ${
                    plan.popular ? 'text-agro-gold' : 'text-primary'
                  }`}
                />
              </div>

              {/* Plan Name */}
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>

              {/* Price removido a pedido do cliente */}
              <div className="mb-8" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div
                      className={`p-0.5 rounded-full ${
                        plan.popular ? 'bg-agro-gold' : 'bg-primary'
                      }`}
                    >
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.buttonVariant}
                size="lg"
                className="w-full"
                onClick={() => handlePlanWhatsApp(plan.name)}
              >
                SAIBA MAIS
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Custom Plan CTA */}
        <div className="animate-on-scroll opacity-0 text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Precisa de algo mais específico?
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => handlePlanWhatsApp('Personalizado')}
          >
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Planos;
