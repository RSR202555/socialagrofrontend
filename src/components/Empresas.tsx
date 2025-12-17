import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Rocket, Trophy, ArrowRight } from 'lucide-react';

const Empresas = () => {
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

  const cases = [
    {
      name: 'Círculo Verde',
      description: 'Revenda líder de Pivô de Irrigação na Bahia',
      highlight: 'Estratégia digital completa para fortalecimento de marca regional',
      icon: '🌱',
    },
    {
      name: 'AGROCULTURAS',
      description: 'Tecnologia para produtividade agrícola',
      highlight: 'Marketing de conteúdo e gestão de redes sociais focada em inovação',
      icon: '🚜',
    },
  ];

  return (
    <section
      id="empresas"
      ref={sectionRef}
      className="py-24 bg-agro-cream relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-agro-gold/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="animate-on-scroll opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              Empresas do Agro
            </span>
          </div>

          <h2 className="animate-on-scroll opacity-0 font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Marketing Estratégico para{' '}
            <span className="text-primary">Empresas do Agro</span>
          </h2>

          <p className="animate-on-scroll opacity-0 text-lg text-muted-foreground">
            Desde startups até marcas consolidadas, desenvolvemos estratégias 
            personalizadas para impulsionar a presença digital da sua empresa.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className="animate-on-scroll opacity-0 group bg-card rounded-2xl p-8 border border-border hover:border-primary/30 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-5xl mb-6">{caseItem.icon}</div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agro-gold/10 border border-agro-gold/30 mb-4">
                <Trophy className="w-3 h-3 text-agro-gold" />
                <span className="text-xs font-semibold text-agro-gold uppercase tracking-wider">
                  Case de Sucesso
                </span>
              </div>

              {/* Content */}
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                {caseItem.name}
              </h3>

              <p className="text-primary font-medium mb-4">
                {caseItem.description}
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {caseItem.highlight}
              </p>

              {/* Hover Arrow */}
              <div className="mt-6 flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">Ver detalhes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="animate-on-scroll opacity-0 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-primary/10 border border-primary/20">
            <Rocket className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-semibold text-foreground">
              Dezenas de empresas de grande porte atendidas
            </span>
          </div>
        </div>
      </div>

      {/* Área: Consultores Agrícolas e Influenciadores */}
      <section
        id="consultores"
        className="border-t border-border bg-background/80"
      >
        <div className="container mx-auto py-20 grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary">
              Áreas de atuação
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Consultores Agrícolas e Influenciadores
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Na Social Agro, somos especialistas em posicionamento digital estratégico para consultores agrícolas
              e influenciadores do agronegócio que desejam construir autoridade, credibilidade e reconhecimento no mercado.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Entendemos que, no agro, confiança gera negócio. Por isso, nosso trabalho vai muito além de postagens:
              criamos uma presença digital sólida, profissional e alinhada com o conhecimento técnico de cada profissional,
              fortalecendo sua imagem como referência no setor.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Para consultores agrícolas, desenvolvemos estratégias que aumentam a autoridade técnica, ampliam visibilidade
              e geram mais oportunidades de consultorias, mentorias, palestras e contratos com empresas e produtores rurais.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Para influenciadores do agro, estruturamos um posicionamento estratégico que fortalece a marca pessoal,
              aumenta o alcance qualificado e facilita o fechamento de publicidades, parcerias e campanhas com empresas
              do setor, sempre mantendo credibilidade e conexão real com o público.
            </p>

            <div className="mt-4">
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mb-2">
                Nosso trabalho envolve:
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
                <li>Definição de posicionamento e autoridade digital</li>
                <li>Estratégia de conteúdo técnico e educativo</li>
                <li>Gestão profissional de redes sociais</li>
                <li>Produção e edição de vídeos, reels e conteúdos institucionais</li>
                <li>Organização da comunicação para fortalecer a marca pessoal</li>
                <li>Estratégias para crescimento, engajamento e monetização no agro</li>
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-agro-gold mb-1">
                Case de resultado
              </p>
              <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                Mari Anna – Citricultora
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              A Social Agro é responsável pelo posicionamento digital de Mari Anna, citricultora reconhecida em nível
              Nordeste. Por meio de uma estratégia clara de conteúdo, identidade e comunicação digital, conseguimos
              ampliar significativamente sua autoridade nas redes sociais, destacando seu conhecimento técnico e sua
              vivência prática no campo.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Com nossa assessoria, Mari Anna ganhou ainda mais visibilidade e reconhecimento no setor, consolidando-se
              como referência na citricultura e ampliando suas oportunidades profissionais dentro do agronegócio.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Na Social Agro, transformamos conhecimento técnico em autoridade digital, e autoridade em oportunidades
              reais para quem vive e ensina o agro.
            </p>

            <div className="pt-2">
              <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={openWhatsApp}>
                SAIBA MAIS
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Área: Sindicatos Rurais */}
      <section
        id="sindicatos"
        className="border-t border-border bg-agro-cream/80"
      >
        <div className="container mx-auto py-20 grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary">
              Áreas de atuação
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              Sindicatos Rurais
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Na Social Agro, atuamos de forma estratégica no posicionamento digital e na comunicação institucional
              de Sindicatos Rurais, fortalecendo sua imagem, ampliando visibilidade e criando uma comunicação clara,
              profissional e alinhada com produtores, parceiros e entidades do setor.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Sabemos que o sindicato é um elo fundamental entre o produtor rural e as instituições do agro. Por isso,
              nosso trabalho foca em organizar, valorizar e comunicar de forma eficiente tudo o que o sindicato oferece,
              gerando mais engajamento, participação e reconhecimento institucional.
            </p>

            <div className="mt-4">
              <h3 className="font-heading text-base md:text-lg font-semibold text-foreground mb-2">
                Desenvolvemos uma gestão completa de comunicação digital, que inclui:
              </h3>
              <ul className="list-disc list-inside text-sm md:text-base text-muted-foreground space-y-1">
                <li>Estruturação do posicionamento institucional</li>
                <li>Organização e divulgação de cursos, capacitações e eventos</li>
                <li>Gestão profissional de redes sociais</li>
                <li>Criação de conteúdos informativos, educativos e institucionais</li>
                <li>Fortalecimento da relação com federações, entidades e parceiros</li>
                <li>Aumento da visibilidade das ações e serviços oferecidos aos produtores</li>
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-agro-gold mb-1">
                Case de resultado
              </p>
              <h3 className="font-heading text-lg md:text-xl font-bold text-foreground">
                Sindicato Rural de Inhambupe
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              A Social Agro foi responsável pela transformação da comunicação digital do Sindicato Rural de Inhambupe,
              promovendo uma evolução significativa no seu posicionamento institucional, inclusive no relacionamento com
              a Federação Baiana.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Por meio de uma gestão estratégica e organizada da comunicação, passamos a mostrar de forma clara e
              profissional todos os cursos, capacitações e serviços oferecidos pelo sindicato, evidenciando sua atuação
              ativa, seu alcance e sua relevância regional.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Esse novo posicionamento gerou maior visibilidade institucional e um aumento expressivo na quantidade de
              cursos e ações disponibilizadas pela Federação Baiana ao sindicato, fortalecendo ainda mais sua atuação
              junto aos produtores rurais da região.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Na Social Agro, transformamos comunicação em fortalecimento institucional, valorizando o papel dos
              Sindicatos Rurais e ampliando seu impacto no desenvolvimento do agro.
            </p>

            <div className="pt-2">
              <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={openWhatsApp}>
                SAIBA MAIS
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder removido: a âncora de 'planos' agora é apenas a seção Planos.tsx */}
    </section>
  );
};

export default Empresas;
