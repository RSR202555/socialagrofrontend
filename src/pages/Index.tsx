import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NovaEra from '@/components/NovaEra';
import FeirasEventos from '@/components/FeirasEventos';
import Empresas from '@/components/Empresas';
import Planos from '@/components/Planos';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <NovaEra />
        <FeirasEventos />
        <Empresas />
        <Planos />
        <Contact />
      </main>
    </div>
  );
};

export default Index;
