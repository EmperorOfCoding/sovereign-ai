"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    
    const revealOnScroll = () => {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Initial check

    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <div className="text-on-surface antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <header className="bg-[#0a0a0a]/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-primary-container/10">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-[#33FF00] uppercase font-headline">
            Sovereign AI
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-[#33FF00] border-b-2 border-[#33FF00] pb-1 font-bold font-space-grotesk tracking-tight" href="#">APIs</a>
            <a className="text-slate-400 hover:text-[#33FF00] transition-colors font-space-grotesk tracking-tight" href="#">Dados</a>
            <a className="text-slate-400 hover:text-[#33FF00] transition-colors font-space-grotesk tracking-tight" href="#">Blog</a>
          </nav>
          <button className="bg-primary-container text-on-primary px-6 py-2 font-bold hover:scale-95 transition-transform duration-150 rounded-md">
            Login
          </button>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden min-h-screen flex items-center">
          {/* Video Background */}
          <div className="video-background-container">
            <iframe allow="autoplay; encrypted-media;" src="https://player.mux.com/Lij8ctevw21VYOYcMXEECG8tzDD32bzWFLUfqjiqSWg?metadata-video-title=Matrix+Landpage&video-title=Matrix+Landpage&autoplay=1&loop=1&muted=1" style={{ border: 'none', opacity: 0.6 }} />
          </div>
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center px-6 pt-32 pb-20 relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase leading-none">
              <span className="animate-letter" style={{ animationDelay: '0.05s' }}>V</span>
              <span className="animate-letter" style={{ animationDelay: '0.1s' }}>A</span>
              <span className="animate-letter" style={{ animationDelay: '0.15s' }}>L</span>
              <span className="animate-letter" style={{ animationDelay: '0.2s' }}>I</span>
              <span className="animate-letter" style={{ animationDelay: '0.25s' }}>D</span>
              <span className="animate-letter" style={{ animationDelay: '0.3s' }}>E</span>
              <span className="animate-letter" style={{ animationDelay: '0.35s' }}>&nbsp;</span>
              <span className="animate-letter" style={{ animationDelay: '0.4s' }}>S</span>
              <span className="animate-letter" style={{ animationDelay: '0.45s' }}>U</span>
              <span className="animate-letter" style={{ animationDelay: '0.5s' }}>A</span>
              <span className="animate-letter" style={{ animationDelay: '0.55s' }}>&nbsp;</span>
              <span className="animate-letter" style={{ animationDelay: '0.6s' }}>P</span>
              <span className="animate-letter" style={{ animationDelay: '0.65s' }}>R</span>
              <span className="animate-letter" style={{ animationDelay: '0.7s' }}>Ó</span>
              <span className="animate-letter" style={{ animationDelay: '0.75s' }}>X</span>
              <span className="animate-letter" style={{ animationDelay: '0.8s' }}>I</span>
              <span className="animate-letter" style={{ animationDelay: '0.85s' }}>M</span>
              <span className="animate-letter" style={{ animationDelay: '0.9s' }}>A</span> 
              <br/>
              <span className="text-primary-container">
                <span className="animate-letter" style={{ animationDelay: '1s' }}>G</span>
                <span className="animate-letter" style={{ animationDelay: '1.05s' }}>R</span>
                <span className="animate-letter" style={{ animationDelay: '1.1s' }}>A</span>
                <span className="animate-letter" style={{ animationDelay: '1.15s' }}>N</span>
                <span className="animate-letter" style={{ animationDelay: '1.2s' }}>D</span>
                <span className="animate-letter" style={{ animationDelay: '1.25s' }}>E</span>
                <span className="animate-letter" style={{ animationDelay: '1.3s' }}>&nbsp;</span>
                <span className="animate-letter" style={{ animationDelay: '1.35s' }}>I</span>
                <span className="animate-letter" style={{ animationDelay: '1.4s' }}>D</span>
                <span className="animate-letter" style={{ animationDelay: '1.45s' }}>E</span>
                <span className="animate-letter" style={{ animationDelay: '1.5s' }}>I</span>
                <span className="animate-letter" style={{ animationDelay: '1.55s' }}>A</span>
              </span>
              <span className="animate-letter" style={{ animationDelay: '1.6s' }}>&nbsp;</span>
              <span className="animate-letter" style={{ animationDelay: '1.65s' }}>C</span>
              <span className="animate-letter" style={{ animationDelay: '1.7s' }}>O</span>
              <span className="animate-letter" style={{ animationDelay: '1.75s' }}>M</span>
              <span className="animate-letter" style={{ animationDelay: '1.8s' }}>&nbsp;</span>
              <span className="animate-letter" style={{ animationDelay: '1.85s' }}>I</span>
              <span className="animate-letter" style={{ animationDelay: '1.9s' }}>A</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 font-light animate-fade-up-slow" style={{ animationDelay: '2s' }}>
              Tome decisões inteligentes baseadas em dados reais
            </p>
            <button className="group relative flex items-center gap-2 bg-primary-container text-on-primary px-10 py-4 font-bold rounded-md glow-primary transition-all hover:bg-primary-fixed hover:glow-sm mb-20 animate-fade-up-slow" style={{ animationDelay: '2.2s' }}>
              Começar Agora
              <span className="material-symbols-outlined text-xl">north_east</span>
            </button>
            
            {/* Console Component */}
            <div className="w-full max-w-3xl bg-surface-container-lowest/80 backdrop-blur-sm border border-primary-container/30 rounded-lg overflow-hidden glow-border animate-fade-up-slow" style={{ animationDelay: '2.4s' }}>
              {/* Console Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low border-b border-outline-variant/20">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <div className="text-[10px] text-outline font-mono uppercase tracking-widest opacity-60">
                  Protocol v2.4.0 active
                </div>
              </div>
              
              {/* Console Content */}
              <div className="p-6 text-left font-mono">
                {/* Search Input Simulation */}
                <div className="flex items-center gap-3 p-4 bg-surface-container rounded border border-outline-variant/10 mb-6">
                  <span className="text-primary-container material-symbols-outlined">search</span>
                  <div className="flex-1 text-on-surface/90 text-sm">
                    Como o mercado de SaaS no Brasil reagirá à nova regulamentação?
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary-container/10 border border-primary-container/20 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></div>
                    <span className="text-[10px] text-primary-container uppercase font-bold tracking-wider">Deep Research</span>
                  </div>
                </div>
                
                {/* Steps Simulation */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-primary-container material-symbols-outlined text-base">check_circle</span>
                    <span className="text-on-surface/60">Escaneando bases de dados...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-primary-container material-symbols-outlined text-base">sync</span>
                    <span className="text-on-surface/60">Analisando concorrência...</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-primary-container/50 material-symbols-outlined text-base">pending</span>
                    <span className="text-on-surface/60">Gerando relatório de viabilidade...</span>
                  </div>
                  <div className="pt-4 flex items-center gap-2">
                    <span className="text-primary-container font-bold">&gt;</span>
                    <span className="w-2.5 h-5 bg-primary-container cursor-blink"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Arquitetura de Validação */}
        <section className="max-w-6xl mx-auto px-6 mb-40 mt-12 reveal">
          <div className="text-center mb-16">
            <span className="text-primary-container text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Processo Sovereign</span>
            <h2 className="text-4xl font-bold text-white uppercase tracking-tight">Arquitetura de Validação</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Layer 1 */}
            <div className="bg-surface-container-low border border-outline-variant/20 p-8 rounded-xl relative overflow-hidden group card-hover reveal stagger-1">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">search_insights</span>
              </div>
              <div className="text-primary-container mb-6">
                <span className="text-3xl font-mono font-bold">01</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pesquisa Profunda</h3>
              <p className="text-on-surface-variant leading-relaxed">Cruzamento massivo de dados setoriais, tendências de mercado e comportamento do consumidor em escala global.</p>
            </div>
            
            {/* Layer 2 */}
            <div className="bg-surface-container-low border border-outline-variant/20 p-8 rounded-xl relative overflow-hidden group card-hover reveal stagger-2">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">warning</span>
              </div>
              <div className="text-primary-container mb-6">
                <span className="text-3xl font-mono font-bold">02</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Análise de Dores</h3>
              <p className="text-on-surface-variant leading-relaxed">Identificação de problemas reais em redes sociais, fóruns e portais de reclamação para encontrar demandas reprimidas.</p>
            </div>
            
            {/* Layer 3 */}
            <div className="bg-surface-container-low border border-outline-variant/20 p-8 rounded-xl relative overflow-hidden group card-hover reveal stagger-3">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px]">gavel</span>
              </div>
              <div className="text-primary-container mb-6">
                <span className="text-3xl font-mono font-bold">03</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Veredito Honesto</h3>
              <p className="text-on-surface-variant leading-relaxed">Análise final crítica sem viés otimista. Nossa IA dirá se o seu negócio tem tração ou se é uma perda de tempo.</p>
            </div>
          </div>
        </section>

        {/* 2. Vantagem Competitiva Algorítmica */}
        <section className="bg-surface-container-lowest py-32 mb-40 border-y border-primary-container/10 reveal">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-container text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Performance</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Vantagem Competitiva Algorítmica</h2>
              <div className="space-y-6">
                <div className="flex gap-4 reveal stagger-1">
                  <span className="material-symbols-outlined text-primary-container">shield_check</span>
                  <div>
                    <h4 className="text-white font-bold">Evidências Reais</h4>
                    <p className="text-on-surface-variant text-sm">Não trabalhamos com suposições. Cada veredito é baseado em logs e dados transacionais históricos.</p>
                  </div>
                </div>
                <div className="flex gap-4 reveal stagger-2">
                  <span className="material-symbols-outlined text-primary-container">payments</span>
                  <div>
                    <h4 className="text-white font-bold">Indicadores de Pagamento</h4>
                    <p className="text-on-surface-variant text-sm">Identificamos o &quot;Willingness to Pay&quot; do seu público alvo através de análise de benchmarks competitivos.</p>
                  </div>
                </div>
                <div className="flex gap-4 reveal stagger-3">
                  <span className="material-symbols-outlined text-primary-container">timer</span>
                  <div>
                    <h4 className="text-white font-bold">Economia de Tempo</h4>
                    <p className="text-on-surface-variant text-sm">Reduza de 6 meses para 6 segundos o tempo necessário para invalidar ideias que não dão lucro.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-10 rounded-2xl border border-outline-variant/20 text-center glow-border card-hover reveal stagger-4">
              <div className="text-primary-container text-7xl font-bold mb-4 animate-flicker">98.4%</div>
              <div className="text-white text-xl font-bold uppercase tracking-widest mb-2">Precisão Preditiva</div>
              <div className="text-on-surface-variant text-sm mb-10">Taxa de sucesso na validação de modelos SaaS e Consumer Tech em 2023.</div>
              <div className="flex justify-center gap-2">
                <div className="w-1 h-8 bg-primary-container"></div>
                <div className="w-1 h-8 bg-primary-container/80"></div>
                <div className="w-1 h-8 bg-primary-container/60"></div>
                <div className="w-1 h-8 bg-primary-container/40"></div>
                <div className="w-1 h-8 bg-primary-container/20"></div>
                <div className="w-1 h-8 bg-primary-container/10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Sinais de Dor Detectados */}
        <section className="max-w-6xl mx-auto px-6 mb-40 reveal">
          <div className="text-center mb-16">
            <span className="text-primary-container text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Monitoramento</span>
            <h2 className="text-4xl font-bold text-white uppercase tracking-tight">Sinais de Dor Detectados</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-red-500 card-hover reveal stagger-1">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-bold uppercase">Urgência: Crítica</span>
                <span className="text-xs text-on-surface-variant font-mono">Reddit /r/startup</span>
              </div>
              <p className="text-sm italic text-on-surface/80 mb-4">&quot;Ninguém resolve o problema de integração de APIs de pagamento no Brasil de forma simples. Desisti de três ferramentas esse mês.&quot;</p>
              <div className="text-[10px] text-primary-container font-bold uppercase">Oportunidade Detectada</div>
            </div>
            
            {/* Card 2 */}
            <div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-yellow-500 card-hover reveal stagger-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded font-bold uppercase">Urgência: Média</span>
                <span className="text-xs text-on-surface-variant font-mono">Twitter / X</span>
              </div>
              <p className="text-sm italic text-on-surface/80 mb-4">&quot;Cansado de ter que usar 5 planilhas pra gerir minha logística. Bem que podia ter uma IA que fizesse isso automático...&quot;</p>
              <div className="text-[10px] text-primary-container font-bold uppercase">Sinal de Mercado</div>
            </div>
            
            {/* Card 3 */}
            <div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-red-500 card-hover reveal stagger-3">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-bold uppercase">Urgência: Crítica</span>
                <span className="text-xs text-on-surface-variant font-mono">Reclame Aqui</span>
              </div>
              <p className="text-sm italic text-on-surface/80 mb-4">&quot;O suporte das grandes empresas de CRM não entende o pequeno empreendedor. Estamos abandonados.&quot;</p>
              <div className="text-[10px] text-primary-container font-bold uppercase">Gap de Concorrência</div>
            </div>
          </div>
        </section>

        {/* 4. Avaliação Honesta */}
        <section className="max-w-4xl mx-auto px-6 mb-40 reveal">
          <div className="bg-surface-container-lowest border border-primary-container/20 rounded-2xl p-1 md:p-12 overflow-hidden relative card-hover">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-container/5 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2 uppercase italic tracking-tighter">Veredito Sovereign</h2>
                <div className="h-1 w-20 bg-primary-container mx-auto"></div>
              </div>
              
              <div className="space-y-12">
                {/* Score Display */}
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full border-8 border-primary-container/20 flex items-center justify-center relative animate-pulse-ring">
                    <div className="text-6xl font-bold text-primary-container animate-flicker">82</div>
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle className="text-primary-container" cx="96" cy="96" fill="none" r="88" stroke="currentColor" strokeDasharray="552.9" strokeDashoffset="110.5" strokeWidth="8"></circle>
                    </svg>
                  </div>
                  <div className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary-container">Market Viability Score</div>
                </div>
                
                {/* Critique */}
                <div className="bg-surface-container p-6 rounded-lg font-mono text-sm border border-outline-variant/10 reveal stagger-2">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    <span className="text-white font-bold">ANÁLISE EXECUTIVA</span>
                  </div>
                  <p className="text-on-surface/70 leading-relaxed mb-4">
                    &quot;Sua ideia possui um gap técnico claro no mercado brasileiro. A barreira de entrada é moderada, mas a retenção projetada é alta devido à dor latente identificada no setor logístico. Recomendamos focar no MVP para integração com SEFAZ.&quot;
                  </p>
                  <div className="flex gap-4">
                    <span className="text-green-500">[+] ALTO POTENCIAL DE LTV</span>
                    <span className="text-yellow-500">[!] CAC ELEVADO INICIAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Próximos Passos */}
        <section className="max-w-6xl mx-auto px-6 mb-40 reveal">
          <h2 className="text-3xl font-bold text-white mb-12 uppercase text-center md:text-left">Roadmap de Execução</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-low p-6 rounded-lg card-hover reveal stagger-1">
              <div className="text-primary-container font-mono mb-4">01.</div>
              <h4 className="text-white font-bold mb-2">Definição de Core</h4>
              <p className="text-xs text-on-surface-variant">Focar na funcionalidade que resolve 80% da dor detectada.</p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-lg card-hover reveal stagger-2">
              <div className="text-primary-container font-mono mb-4">02.</div>
              <h4 className="text-white font-bold mb-2">Aquisição Alpha</h4>
              <p className="text-xs text-on-surface-variant">Abordagem direta dos leads identificados no relatório.</p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-lg card-hover reveal stagger-3">
              <div className="text-primary-container font-mono mb-4">03.</div>
              <h4 className="text-white font-bold mb-2">Refinamento IA</h4>
              <p className="text-xs text-on-surface-variant">Ajuste de precificação com base nos benchmarks de mercado.</p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-lg card-hover reveal stagger-4">
              <div className="text-primary-container font-mono mb-4">04.</div>
              <h4 className="text-white font-bold mb-2">Pitch Deck</h4>
              <p className="text-xs text-on-surface-variant">Exportar os dados Sovereign para rodada de investimento.</p>
            </div>
          </div>
        </section>

        {/* 6. CTA Final */}
        <section className="max-w-6xl mx-auto px-6 mb-32 reveal">
          <div className="bg-primary-container rounded-3xl p-12 md:p-20 text-center relative overflow-hidden group">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10 font-mono text-[10px] leading-none pointer-events-none select-none overflow-hidden flex flex-wrap">
              VALIDATE. DATA. TRUTH. SOVEREIGN. SYSTEM. ACTIVE. 01010101. 
              VALIDATE. DATA. TRUTH. SOVEREIGN. SYSTEM. ACTIVE. 01010101. 
              VALIDATE. DATA. TRUTH. SOVEREIGN. SYSTEM. ACTIVE. 01010101. 
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-bold text-on-primary mb-6 uppercase tracking-tighter leading-[1.1] reveal stagger-1">
                Chega de adivinhar.<br/>Comece a validar.
              </h2>
              <p className="text-on-primary/80 font-medium text-lg mb-10 max-w-xl mx-auto reveal stagger-2">
                O mercado não perdoa o amadorismo. Use a inteligência que os grandes players usam para dominar seu nicho.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center reveal stagger-3">
                <button className="bg-on-primary text-primary-container px-10 py-4 font-bold rounded-md hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  Começar Agora
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </button>
                <button className="border border-on-primary/40 text-on-primary px-10 py-4 font-bold rounded-md hover:bg-on-primary/5 transition-colors">
                  Ver Demonstração
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-primary-container/10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 gap-8 max-w-screen-2xl mx-auto">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-xl font-bold tracking-tighter text-[#33FF00] uppercase font-headline mb-4">
              Sovereign AI
            </div>
            <div className="font-space-grotesk text-xs uppercase tracking-[0.05em] text-slate-500 opacity-70">
              © 2024 Sovereign AI. Terminal Protocol Active.
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-space-grotesk text-xs uppercase tracking-[0.05em] text-slate-500 hover:text-[#33FF00] transition-colors" href="#">Privacidade</a>
            <a className="font-space-grotesk text-xs uppercase tracking-[0.05em] text-slate-500 hover:text-[#33FF00] transition-colors" href="#">Termos</a>
            <a className="font-space-grotesk text-xs uppercase tracking-[0.05em] text-slate-500 hover:text-[#33FF00] transition-colors" href="#">Documentação</a>
            <a className="font-space-grotesk text-xs uppercase tracking-[0.05em] text-slate-500 hover:text-[#33FF00] transition-colors" href="#">API</a>
          </div>
          <div className="flex items-center gap-4 bg-primary-container/5 px-4 py-2 rounded-full border border-primary-container/10">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="text-[10px] font-mono text-primary-container uppercase tracking-widest">System Online: v2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
