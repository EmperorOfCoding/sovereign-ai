"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CheckCircle2, 
  RefreshCcw, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Timer, 
  ArrowUpRight, 
  Zap,
  AlertCircle,
  Target,
  Rocket,
  Cpu,
  FileText,
  X,
  MessageSquareWarning,
  TrendingUp,
  DollarSign,
  Compass,
  Gavel,
  Brain,
  ChevronRight
} from 'lucide-react';

/* ─────────────── Navbar ─────────────── */
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold tracking-tighter text-primary uppercase">
        Sovereign AI
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-primary border-b-2 border-primary pb-1 font-medium">APIs</a>
        <a href="#" className="text-zinc-400 hover:text-primary transition-colors font-medium">Dados</a>
        <a href="#" className="text-zinc-400 hover:text-primary transition-colors font-medium">Blog</a>
      </div>
      <button className="bg-primary text-black px-6 py-2 font-bold rounded hover:scale-95 transition-transform">
        Login
      </button>
    </div>
  </nav>
);

/* ─────────────── Score Bar Component ─────────────── */
const ScoreBar = ({ score, maxScore = 10, label, delay = 0 }: { score: number; maxScore?: number; label: string; delay?: number }) => {
  const percentage = (score / maxScore) * 100;
  const getColor = (s: number) => {
    if (s >= 7) return 'bg-primary';
    if (s >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getTextColor = (s: number) => {
    if (s >= 7) return 'text-primary';
    if (s >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 text-xs w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor(score)}`}
        />
      </div>
      <span className={`text-sm font-bold font-mono w-8 ${getTextColor(score)}`}>{score}</span>
    </div>
  );
};

/* ─────────────── Search Results Modal (Redesigned) ─────────────── */
const SearchResultsModal = ({ isOpen, onClose, query }: { isOpen: boolean; onClose: () => void; query: string }) => {
  const [step, setStep] = useState(0);
  const [loadingText, setLoadingText] = useState('Cruzando bases de dados globais...');
  const contentRef = useRef<HTMLDivElement>(null);

  // Simulated analysis results
  const analysisResults = {
    evidences: [
      { source: 'Reddit /r/startup', text: '"Ninguém resolve o problema de integração de APIs de pagamento no Brasil de forma simples. Desisti de três ferramentas esse mês."', votes: 847 },
      { source: 'Twitter / X', text: '"Cansado de ter que usar 5 planilhas pra gerir minha logística. Bem que podia ter uma IA que fizesse isso automático..."', likes: 2340 },
      { source: 'Reclame Aqui', text: '"O suporte das grandes empresas de CRM não entende o pequeno empreendedor. Estamos abandonados."', reclamacoes: 156 },
    ],
    painScore: 8,
    aiSummaryScore: 7,
    paymentScore: 6,
    nextSteps: [
      'Entrevistar 10-15 empreendedores do setor logístico para validar a dor identificada',
      'Refinar o problema: focar em "integração de APIs de pagamento para PMEs brasileiras"',
      'Criar um protótipo de solução mínima e testar a disposição de pagamento (WTP)',
      'Mapear concorrentes diretos e indiretos no mercado brasileiro'
    ],
    verdict: 'VÁLIDO' as const,
    verdictReason: 'A dor identificada é forte (8/10), com evidências reais de múltiplas fontes. O indicador de pagamento é moderado (6/10), sugerindo que o público pagaria por uma solução, mas é sensível a preço. Recomendamos prosseguir com validação via entrevistas.'
  };

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setLoadingText('Cruzando bases de dados globais...');
      const t1 = setTimeout(() => { setStep(1); setLoadingText('Analisando sinais de dor...'); }, 1500);
      const t2 = setTimeout(() => { setStep(2); setLoadingText('Processando evidências...'); }, 3000);
      const t3 = setTimeout(() => { setStep(3); setLoadingText('Calculando indicadores...'); }, 4500);
      const t4 = setTimeout(() => setStep(4), 6000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isLoading = step < 4;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 md:pt-20 text-left overflow-y-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-card border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden relative shadow-2xl flex flex-col my-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 bg-surface-card z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Brain size={22} className="text-primary" />
                Análise Sovereign AI
              </h3>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1">
                <X size={22} />
              </button>
            </div>

            {/* Query */}
            <div className="px-6 py-4 border-b border-white/5 bg-black/20">
              <div className="font-mono text-sm">
                <span className="text-zinc-500">Pesquisa: </span>
                <span className="text-primary">&quot;{query}&quot;</span>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-16 gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <Brain size={24} className="absolute inset-0 m-auto text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="text-zinc-400 font-mono animate-pulse block">{loadingText}</span>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-white/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {!isLoading && (
              <div ref={contentRef} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                
                {/* 1. Evidências Encontradas */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareWarning size={18} className="text-primary" />
                    <h4 className="font-bold text-white uppercase text-sm tracking-wide">Evidências Encontradas</h4>
                    <span className="text-[0.625rem] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded font-mono">
                      {analysisResults.evidences.length} fontes
                    </span>
                  </div>
                  {analysisResults.evidences.map((ev, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[0.625rem] text-primary font-mono font-bold uppercase">{ev.source}</span>
                      </div>
                      <p className="text-sm text-zinc-300 italic leading-relaxed">{ev.text}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 2. Indicadores (Scores) */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={18} className="text-primary" />
                    <h4 className="font-bold text-white uppercase text-sm tracking-wide">Indicadores de Análise</h4>
                  </div>
                  <div className="bg-black/30 p-5 rounded-lg border border-white/5 space-y-4">
                    <ScoreBar score={analysisResults.painScore} label="Dor" delay={0.3} />
                    <ScoreBar score={analysisResults.aiSummaryScore} label="Resumo IA" delay={0.4} />
                    <ScoreBar score={analysisResults.paymentScore} label="Pagamento" delay={0.5} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-center">
                      <AlertCircle size={18} className="text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-primary font-mono">{analysisResults.painScore}/10</div>
                      <div className="text-[0.625rem] text-zinc-500 uppercase tracking-wider">Indicador de Dor</div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-center">
                      <Brain size={18} className="text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-primary font-mono">{analysisResults.aiSummaryScore}/10</div>
                      <div className="text-[0.625rem] text-zinc-500 uppercase tracking-wider">Resumo IA</div>
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-center">
                      <DollarSign size={18} className="text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-yellow-500 font-mono">{analysisResults.paymentScore}/10</div>
                      <div className="text-[0.625rem] text-zinc-500 uppercase tracking-wider">Pagamento</div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 italic">
                    Pagamento: Uma pessoa pagaria por uma solução que resolvesse esse problema?
                  </p>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 3. Resumo gerado por IA */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu size={18} className="text-primary" />
                    <h4 className="font-bold text-white uppercase text-sm tracking-wide">Resumo Gerado por IA</h4>
                  </div>
                  <div className="bg-black/30 p-5 rounded-lg border border-white/5 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-zinc-500 text-[0.625rem] uppercase">Análise Executiva</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      O problema de integração de APIs de pagamento para PMEs brasileiras é real e documentado em múltiplas
                      plataformas. Existe uma frustração generalizada com as soluções existentes, especialmente entre small businesses 
                      do setor de e-commerce e logística. O mercado demonstra sinais claros de disposição para adotar alternativas, 
                      porém com sensibilidade a preço. O gap técnico principal está na simplificação da integração multi-gateway.
                    </p>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 4. Próximos Passos */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Compass size={18} className="text-primary" />
                    <h4 className="font-bold text-white uppercase text-sm tracking-wide">Próximos Passos</h4>
                  </div>
                  <div className="space-y-2">
                    {analysisResults.nextSteps.map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-white/5 group hover:border-primary/20 transition-colors"
                      >
                        <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-primary text-[0.625rem] font-bold font-mono">{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">{step}</p>
                        <ChevronRight size={14} className="text-zinc-600 group-hover:text-primary transition-colors shrink-0 mt-1" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 5. Veredito */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Gavel size={18} className="text-primary" />
                    <h4 className="font-bold text-white uppercase text-sm tracking-wide">Veredito Final</h4>
                  </div>
                  <div className={`p-5 rounded-lg border-2 ${
                    analysisResults.verdict === 'VÁLIDO' 
                      ? 'border-primary/30 bg-primary/5' 
                      : 'border-red-500/30 bg-red-500/5'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1.5 rounded font-bold text-sm uppercase tracking-wider ${
                        analysisResults.verdict === 'VÁLIDO' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {analysisResults.verdict === 'VÁLIDO' ? '✓' : '✗'} {analysisResults.verdict}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className={`w-2.5 h-5 rounded-sm ${
                              i <= Math.ceil(analysisResults.painScore / 2) ? 'bg-primary' : 'bg-white/10'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {analysisResults.verdictReason}
                    </p>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-2"
                >
                  <button 
                    onClick={onClose} 
                    className="w-full bg-primary text-black font-bold py-3.5 rounded hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Entendi — Voltar à Página
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────── Hero with Video Background ─────────────── */
const Hero = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setIsOpen(true);
    }
  };

  return (
  <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex flex-col items-center justify-center text-center">
    {/* Video Background */}
    <div className="absolute inset-0 z-0">
      <iframe
        src="https://player.mux.com/5OTUJtFO003U9enYhdQeXRHob01CX9dvO02JxTEH021DJS8?metadata-video-title=Matrix+New&video-title=Matrix+New&autoplay=autoplay&loop=loop&muted&playsinline"
        className="w-full h-full border-none object-cover"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        title="Background video"
      />
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface to-transparent" />
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl relative z-10"
    >
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 uppercase leading-none">
        Valide sua próxima <br />
        <span className="text-primary italic">grande ideia</span> com IA
      </h1>
      <p className="text-zinc-400 text-lg md:text-xl mb-10 font-light">
        Tome decisões inteligentes baseadas em dados reais
      </p>
      <button className="group relative flex items-center gap-2 bg-primary text-black px-10 py-4 font-bold rounded glow-primary transition-all hover:scale-105 mb-20 mx-auto">
        Começar Agora
        <ArrowUpRight size={20} />
      </button>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="w-full max-w-3xl bg-surface-card/90 backdrop-blur-md border border-primary/20 rounded-lg overflow-hidden glow-border relative z-10"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="text-[0.625rem] text-zinc-500 font-mono uppercase tracking-widest">
          Protocol v2.4.0 active
        </div>
      </div>
      <div className="p-6 text-left font-mono">
        <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 bg-black/30 rounded border border-white/5 mb-6">
          <Search size={18} className="text-primary" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Como o mercado de SaaS no Brasil reagirá à nova regulamentação?"
            autoComplete="off"
            className="flex-1 bg-transparent text-zinc-300 text-sm outline-none w-full placeholder:text-zinc-600"
          />
          <button type="submit" disabled={!query.trim()} className="flex items-center gap-2 px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[0.625rem] text-primary uppercase font-bold tracking-wider">Deep Research</span>
          </button>
        </form>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-zinc-400">Escaneando bases de dados...</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <RefreshCcw size={16} className="text-primary animate-spin" />
            <span className="text-zinc-400">Analisando concorrência...</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-primary/50" />
            <span className="text-zinc-400">Gerando relatório de viabilidade...</span>
          </div>
          <div className="pt-4 flex items-center gap-2">
            <span className="text-primary font-bold">&gt;</span>
            <span className="w-2.5 h-5 bg-primary cursor-blink" />
          </div>
        </div>
      </div>
    </motion.div>
    <SearchResultsModal isOpen={isOpen} onClose={() => setIsOpen(false)} query={query} />
  </section>
  );
};

/* ─────────────── Validation Architecture ─────────────── */
const ValidationArchitecture = () => (
  <section className="max-w-6xl mx-auto px-6 py-32">
    <div className="text-center mb-16">
      <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Processo Sovereign</span>
      <h2 className="text-4xl font-bold uppercase tracking-tight">Arquitetura de Validação</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          num: '01',
          title: 'Pesquisa Profunda',
          desc: 'Cruzamento massivo de dados setoriais, tendências de mercado e comportamento do consumidor em escala global.',
          icon: <Search size={48} />
        },
        {
          num: '02',
          title: 'Análise de Dores',
          desc: 'Identificação de problemas reais em redes sociais, fóruns e portais de reclamação para encontrar demandas reprimidas.',
          icon: <AlertCircle size={48} />
        },
        {
          num: '03',
          title: 'Veredito Honesto',
          desc: 'Análise final crítica sem viés otimista. Nossa IA dirá se o seu negócio tem tração ou se é uma perda de tempo.',
          icon: <CheckCircle2 size={48} />
        }
      ].map((item, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          whileHover={{ y: -6 }}
          className="bg-surface-card border border-white/5 p-8 rounded-xl relative overflow-hidden group hover:border-primary/20 transition-colors"
        >
          <div className="absolute -right-3 -top-3 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity text-white">
            {React.cloneElement(item.icon, { size: 80 })}
          </div>
          <div className="text-primary mb-6">
            <span className="text-3xl font-mono font-bold">{item.num}</span>
          </div>
          <h3 className="text-xl font-bold mb-4">{item.title}</h3>
          <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─────────────── Competitive Advantage ─────────────── */
const CompetitiveAdvantage = () => (
  <section className="py-32">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Performance</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Vantagem Competitiva Algorítmica</h2>
        <div className="space-y-6">
          {[
            { icon: <ShieldCheck className="text-primary" />, title: 'Evidências Reais', desc: 'Não trabalhamos com suposições. Cada veredito é baseado em logs e dados transacionais históricos.' },
            { icon: <CreditCard className="text-primary" />, title: 'Indicadores de Pagamento', desc: 'Identificamos o "Willingness to Pay" do seu público alvo através de análise de benchmarks competitivos.' },
            { icon: <Timer className="text-primary" />, title: 'Economia de Tempo', desc: 'Reduza de 6 meses para 6 segundos o tempo necessário para invalidar ideias que não dão lucro.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-surface-card p-10 rounded-2xl border border-white/10 text-center glow-border"
      >
        <div className="text-primary text-7xl font-bold mb-4">98.4%</div>
        <div className="text-xl font-bold uppercase tracking-widest mb-2">Precisão Preditiva</div>
        <div className="text-zinc-500 text-sm mb-10">Taxa de sucesso na validação de modelos SaaS e Consumer Tech em 2023.</div>
        <div className="flex justify-center gap-2">
          {[1, 0.85, 0.7, 0.55, 0.4, 0.25].map((op, i) => (
            <div key={i} className="w-1.5 h-10 bg-primary rounded-sm" style={{ opacity: op }} />
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─────────────── Pain Signals ─────────────── */
const PainSignals = () => (
  <section className="max-w-6xl mx-auto px-6 py-32">
    <div className="text-center mb-16">
      <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Monitoramento</span>
      <h2 className="text-4xl font-bold uppercase tracking-tight">Sinais de Dor Detectados</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { platform: 'Reddit /r/startup', urgency: 'Crítica', color: 'red', text: '"Ninguém resolve o problema de integração de APIs de pagamento no Brasil de forma simples. Desisti de três ferramentas esse mês."', tag: 'Oportunidade Detectada' },
        { platform: 'Twitter / X', urgency: 'Média', color: 'yellow', text: '"Cansado de ter que usar 5 planilhas pra gerir minha logística. Bem que podia ter uma IA que fizesse isso automático..."', tag: 'Sinal de Mercado' },
        { platform: 'Reclame Aqui', urgency: 'Crítica', color: 'red', text: '"O suporte das grandes empresas de CRM não entende o pequeno empreendedor. Estamos abandonados."', tag: 'Gap de Concorrência' }
      ].map((item, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`bg-surface-card p-6 rounded-lg border border-white/5 border-l-4 ${item.color === 'red' ? 'border-l-red-500' : 'border-l-yellow-500'} hover:border-white/10 transition-all hover:translate-y-[-0.25rem]`}
        >
          <div className="flex justify-between items-center mb-4">
            <span className={`text-[0.625rem] ${item.color === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'} px-2 py-1 rounded font-bold uppercase`}>
              Urgência: {item.urgency}
            </span>
            <span className="text-xs text-zinc-500 font-mono">{item.platform}</span>
          </div>
          <p className="text-sm italic text-zinc-300 mb-4 leading-relaxed">{item.text}</p>
          <div className="text-[0.625rem] text-primary font-bold uppercase tracking-wide">{item.tag}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─────────────── Verdict ─────────────── */
const Verdict = () => (
  <section className="max-w-4xl mx-auto px-6 py-32">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-surface-card border border-primary/15 rounded-2xl p-8 md:p-12 relative overflow-hidden glow-border-strong"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 uppercase italic tracking-tighter">Veredito Sovereign</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-lg" />
            <div className="absolute inset-2 border border-primary/10 rounded-md bg-primary/5" />
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle 
                cx="80" cy="80" r="55" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                className="text-primary/10"
              />
              <circle 
                cx="80" cy="80" r="55" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                className="text-primary score-circle"
                strokeDasharray="345.6"
                strokeDashoffset="62.2"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-6xl font-bold text-primary relative z-10">82</div>
          </div>
          <div className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">Market Viability Score</div>
        </div>

        <div className="bg-black/40 p-6 rounded-lg font-mono text-sm border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-bold">ANÁLISE EXECUTIVA</span>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-4">
            &quot;Sua ideia possui um gap técnico claro no mercado brasileiro. A barreira de entrada é moderada, mas a retenção projetada é alta devido à dor latente identificada no setor logístico. Recomendamos focar no MVP para integração com SEFAZ.&quot;
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="text-green-500 text-[0.625rem] md:text-xs">[+] ALTO POTENCIAL DE LTV</span>
            <span className="text-yellow-500 text-[0.625rem] md:text-xs">[!] CAC ELEVADO INICIAL</span>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

/* ─────────────── Roadmap ─────────────── */
const Roadmap = () => (
  <section className="max-w-6xl mx-auto px-6 py-32">
    <h2 className="text-3xl font-bold mb-12 uppercase">Roadmap de Execução</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { num: '01.', title: 'Definição de Core', desc: 'Focar na funcionalidade que resolve 80% da dor detectada.', icon: <Target size={20} /> },
        { num: '02.', title: 'Aquisição Alpha', desc: 'Abordagem direta dos leads identificados no relatório.', icon: <Rocket size={20} /> },
        { num: '03.', title: 'Refinamento IA', desc: 'Ajuste de precificação com base nos benchmarks de mercado.', icon: <Cpu size={20} /> },
        { num: '04.', title: 'Pitch Deck', desc: 'Exportar os dados Sovereign para rodada de investimento.', icon: <FileText size={20} /> }
      ].map((item, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface-card p-6 rounded-lg border border-white/5 hover:border-primary/30 transition-colors"
        >
          <div className="text-primary font-mono mb-4">{item.num}</div>
          <h4 className="font-bold mb-2">{item.title}</h4>
          <p className="text-xs text-zinc-500">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ─────────────── CTA ─────────────── */
const CTA = () => (
  <section className="max-w-6xl mx-auto px-6 pb-32">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.06] font-mono text-[0.625rem] leading-none pointer-events-none select-none overflow-hidden flex flex-wrap text-black">
        {Array(20).fill('VALIDATE. DATA. TRUTH. SOVEREIGN. SYSTEM. ACTIVE. 01010101. ').join('')}
      </div>
      <div className="relative z-10 text-black flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tighter leading-[1.1]">
          Chega de adivinhar.<br />Comece a validar.
        </h2>
        <p className="text-black/70 font-medium text-lg mb-10 max-w-xl mx-auto">
          O mercado não perdoa o amadorismo. Use a inteligência que os grandes players usam para dominar seu nicho.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black text-primary px-10 py-4 font-bold rounded flex items-center justify-center gap-2 hover:scale-105 transition-transform">
            Começar Agora
            <Zap size={20} />
          </button>
          <button className="border border-black/30 text-black px-10 py-4 font-bold rounded hover:bg-black/10 transition-colors">
            Ver Demonstração
          </button>
        </div>
      </div>
    </motion.div>
  </section>
);

/* ─────────────── Footer ─────────────── */
const Footer = () => (
  <footer className="border-t border-white/5 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start">
        <div className="text-xl font-bold tracking-tighter text-primary uppercase mb-2">
          Sovereign AI
        </div>
        <div className="text-[0.625rem] uppercase tracking-widest text-zinc-500">
          © 2024 Sovereign AI. Terminal Protocol Active.
        </div>
      </div>
      <div className="flex gap-8">
        {['Privacidade', 'Termos', 'Documentação', 'API'].map((link) => (
          <a key={link} href="#" className="text-[0.625rem] uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[0.625rem] font-mono text-primary uppercase tracking-widest">System Online: v2.4.0</span>
      </div>
    </div>
  </footer>
);

/* ─────────────── Page ─────────────── */
export default function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main>
        <Hero />
        <ValidationArchitecture />
        <CompetitiveAdvantage />
        <PainSignals />
        <Verdict />
        <Roadmap />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
