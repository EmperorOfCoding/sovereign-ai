import React from 'react';
import Navbar from '../components/Navbar';
import MouseGlow from '../components/MouseGlow';
import Hero from '../components/Hero';
import ValidationArchitecture from '../components/ValidationArchitecture';
import CompetitiveAdvantage from '../components/CompetitiveAdvantage';
import WhySovereignAI from '../components/WhySovereignAI';
import PainSignals from '../components/PainSignals';
import Verdict from '../components/Verdict';
import Roadmap from '../components/Roadmap';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-surface text-white">
      <Navbar />
      <MouseGlow />
      <main>
        <Hero />
        <ValidationArchitecture />
        <CompetitiveAdvantage />
        <WhySovereignAI />
        <PainSignals />
        <Verdict 
          score={82}
          analysis="Sua ideia possui um gap técnico claro no mercado brasileiro. A barreira de entrada é moderada, mas a retenção projetada é alta devido à dor latente identificada no setor logístico. Recomendamos focar no MVP para integração com SEFAZ."
          badges={[
            { label: '[+] ALTO POTENCIAL DE LTV', tone: 'positive' },
            { label: '[!] CAC ELEVADO INICIAL', tone: 'neutral' }
          ]}
        />
        <Roadmap />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
