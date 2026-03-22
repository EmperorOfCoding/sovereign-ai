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
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-2xl font-bold tracking-tighter text-primary uppercase cursor-pointer"
      >
        Sovereign AI
      </div>
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
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 md:pt-20 text-left overflow-y-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-card border border-white/10 rounded-2xl w-full max-w-5xl overflow-hidden relative shadow-2xl flex flex-col my-4 md:my-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-8 border-b border-white/5 sticky top-0 bg-surface-card z-10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Brain size={28} className="text-primary" />
                Análise Sovereign AI
              </h3>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-2 bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Query */}
            <div className="px-8 py-5 border-b border-white/5 bg-black/20">
              <div className="font-mono text-base md:text-lg">
                <span className="text-zinc-500 font-bold">RESEARCH_TARGET: </span>
                <span className="text-primary italic">&quot;{query}&quot;</span>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="p-8">
                <div className="flex flex-col items-center justify-center py-24 gap-8">
                  <div className="relative">
                    <div className="w-20 h-20 border-2 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 w-20 h-20 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <Brain size={32} className="absolute inset-0 m-auto text-primary" />
                  </div>
                  <div className="text-center">
                    <span className="text-zinc-400 text-lg font-mono animate-pulse block">{loadingText}</span>
                    <div className="flex items-center justify-center gap-3 mt-6">
                      {[0, 1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary scale-110 shadow-[0_0_8px_rgba(51,255,0,0.5)]' : 'bg-white/10'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {!isLoading && (
              <div ref={contentRef} className="p-8 space-y-10 overflow-y-auto max-h-[75vh] custom-scrollbar">
                
                {/* 1. Evidências Encontradas */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquareWarning size={22} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white uppercase text-base tracking-widest">Evidências Encontradas</h4>
                    <span className="text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full font-mono font-bold">
                      {analysisResults.evidences.length} fontes detectadas
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResults.evidences.map((ev, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-black/30 p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-primary font-mono font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">{ev.source}</span>
                        </div>
                        <p className="text-base text-zinc-300 italic leading-relaxed font-medium">&quot;{ev.text}&quot;</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 2. Indicadores (Scores) */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp size={22} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white uppercase text-base tracking-widest">Indicadores de Análise</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-black/20 p-8 rounded-2xl border border-white/5">
                    <div className="space-y-6">
                      <ScoreBar score={analysisResults.painScore} label="Intensidade da Dor" delay={0.3} />
                      <ScoreBar score={analysisResults.aiSummaryScore} label="Consistência IA" delay={0.4} />
                      <ScoreBar score={analysisResults.paymentScore} label="Viabilidade Financeira" delay={0.5} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-surface/40 p-5 rounded-xl border border-white/5 text-center group hover:border-primary/30 transition-all">
                        <AlertCircle size={24} className="text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-2xl font-black text-primary font-mono">{analysisResults.painScore}/10</div>
                        <div className="text-[0.625rem] text-zinc-500 uppercase font-bold tracking-widest mt-1">Dor</div>
                      </div>
                      <div className="bg-surface/40 p-5 rounded-xl border border-white/5 text-center group hover:border-primary/30 transition-all">
                        <Brain size={24} className="text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-2xl font-black text-primary font-mono">{analysisResults.aiSummaryScore}/10</div>
                        <div className="text-[0.625rem] text-zinc-500 uppercase font-bold tracking-widest mt-1">Confiança</div>
                      </div>
                      <div className="bg-surface/40 p-5 rounded-xl border border-white/5 text-center group hover:border-primary/30 transition-all">
                        <DollarSign size={24} className="text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-2xl font-black text-yellow-500 font-mono">{analysisResults.paymentScore}/10</div>
                        <div className="text-[0.625rem] text-zinc-500 uppercase font-bold tracking-widest mt-1">Pagamento</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 3. Resumo gerado por IA */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Cpu size={22} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white uppercase text-base tracking-widest">Resumo Gerado por IA</h4>
                  </div>
                  <div className="bg-black/40 p-8 rounded-2xl border border-white/10 font-mono text-base relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Relatório Executivo v1.02</span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed font-medium">
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Compass size={22} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white uppercase text-base tracking-widest">Próximos Passos Recomendados</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResults.nextSteps.map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex items-start gap-4 p-5 bg-black/20 rounded-xl border border-white/5 group hover:border-primary/30 transition-all hover:bg-primary/5"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
                          <span className="text-primary group-hover:text-black text-xs font-black font-mono">{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <p className="text-base text-zinc-300 leading-relaxed font-semibold group-hover:text-white transition-colors">{step}</p>
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Gavel size={22} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white uppercase text-base tracking-widest">Veredito Sovereign</h4>
                  </div>
                  <div className={`p-8 rounded-2xl border-2 transition-all duration-500 ${
                    analysisResults.verdict === 'VÁLIDO' 
                      ? 'border-primary/40 bg-primary/5 shadow-[0_0_30px_rgba(51,255,0,0.05)]' 
                      : 'border-red-500/40 bg-red-500/5'
                  }`}>
                    <div className="flex items-center flex-wrap gap-4 mb-6">
                      <div className={`px-5 py-2.5 rounded-full font-black text-lg uppercase tracking-widest flex items-center gap-2 ${
                        analysisResults.verdict === 'VÁLIDO' 
                          ? 'bg-primary text-black' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {analysisResults.verdict === 'VÁLIDO' ? '✓ Veredito: ' : '✗ Veredito: '} {analysisResults.verdict}
                      </div>
                      <div className="flex items-center gap-1.5 p-2 bg-black/20 rounded-lg">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div 
                            key={i} 
                            className={`w-3.5 h-7 rounded-md transition-all duration-1000 ${
                              i <= Math.ceil(analysisResults.painScore / 2) ? 'bg-primary shadow-[0_0_10px_rgba(51,255,0,0.4)]' : 'bg-white/10'
                            }`} 
                            style={{ transitionDelay: `${i * 100}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                      {analysisResults.verdictReason}
                    </p>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4"
                >
                  <button 
                    onClick={onClose} 
                    className="w-full bg-primary text-black font-black text-lg py-5 rounded-xl hover:bg-[#2ee600] hover:shadow-[0_0_30px_rgba(51,255,0,0.4)] active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 group"
                  >
                    <CheckCircle2 size={24} className="group-hover:scale-125 transition-transform" />
                    CONCLUIR ANÁLISE E CONTINUAR
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

    <div className="max-w-4xl relative z-10">
      <motion.h1 
        variants={{
          hidden: { opacity: 1 },
          visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.2 } }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-6 uppercase leading-none"
      >
        {"Valide sua próxima ".split('').map((char, index) => (
          <motion.span key={`t1-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        <br />
        <span className="text-primary italic inline-block">
          {"grande ideia".split('').map((char, index) => (
            <motion.span key={`t2-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
        {" com IA".split('').map((char, index) => (
          <motion.span key={`t3-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }}>
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0, 1] }}
        viewport={{ once: true }}
        transition={{ delay: 2.2, duration: 0.6, times: [0, 0.4, 0.6, 1] }}
        className="text-zinc-400 text-lg md:text-xl mb-10 font-light"
      >
        Tome decisões inteligentes baseadas em dados reais
      </motion.p>
      
      <motion.button 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="group relative flex items-center gap-2 bg-primary text-black px-10 py-4 font-bold rounded glow-primary hover:bg-[#2ee600] hover:shadow-[0_0_30px_rgba(51,255,0,0.4)] active:scale-95 transition-all duration-300 mb-20 mx-auto cursor-pointer"
      >
        Começar Agora
        <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
      </motion.button>
    </div>

    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="w-full max-w-3xl bg-surface-card/90 backdrop-blur-md border border-white/15 rounded-lg overflow-hidden relative z-10"
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
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <Search size={22} className="text-primary shrink-0 hidden sm:block delay-0 transition-all opacity-90" />
          <div className="flex-1 w-full border border-white/10 focus-within:border-white/30 transition-colors h-14 flex items-center bg-black/20">
            <Search size={20} className="text-primary ml-4 shrink-0 sm:hidden" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Como o mercado de SaaS no Brasil reagirá à nova regulamentação?"
              autoComplete="off"
              className="w-full bg-transparent text-zinc-300 text-sm md:text-base outline-none px-4 placeholder:text-zinc-600 h-full font-mono flex-1"
            />
          </div>
          <button type="submit" disabled={!query.trim()} className="shrink-0 flex items-center justify-center gap-3 px-6 h-12 bg-transparent hover:bg-primary transition-all duration-300 border border-white/15 hover:border-primary hover:shadow-[0_0_25px_rgba(51,255,0,0.3)] active:scale-[0.98] rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-2 sm:mt-0 group">
            <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-black group-hover:shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-300" />
            <span className="text-xs text-primary group-hover:text-black uppercase font-bold tracking-widest mt-0.5 transition-colors duration-300">Deep Research</span>
          </button>
        </form>
        
        <div className="space-y-4 font-mono pl-0 sm:pl-[2.35rem]">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <CheckCircle2 size={18} className="text-primary" />
            <span className="text-zinc-400">Escaneando bases de dados...</span>
          </div>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <RefreshCcw size={18} className="text-primary" />
            <span className="text-zinc-400">Analisando concorrência...</span>
          </div>
          <div className="flex items-center gap-3 text-sm md:text-base">
            <Clock size={18} className="text-white" />
            <span className="text-zinc-400">Gerando relatório de viabilidade...</span>
          </div>
          <div className="pt-4 flex items-center gap-3">
            <span className="text-primary font-bold text-lg leading-none">{'>'}</span>
            <span className="w-3 h-[1.125rem] bg-primary cursor-blink" />
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.2, duration: 0.6 } }
      }}
      className="bg-surface-card border border-primary/15 rounded-2xl p-8 md:p-12 relative overflow-hidden glow-border-strong"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 uppercase italic tracking-tighter cursor-default hover:text-primary transition-colors duration-500">Veredito Sovereign</h2>
          <motion.div 
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { delay: 0.4, duration: 0.6 } } }}
            className="h-1 w-20 bg-primary mx-auto rounded-full origin-left" 
          />
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } } }} className="flex flex-col items-center mb-12">
          <div className="relative w-40 h-40 flex items-center justify-center group cursor-default">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-lg group-hover:rotate-12 transform transition-transform duration-700" />
            <div className="absolute inset-2 border border-primary/10 rounded-md bg-primary/5 group-hover:-rotate-12 transform transition-transform duration-700" />
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle 
                cx="80" cy="80" r="55" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                className="text-primary/10"
              />
              <motion.circle 
                cx="80" cy="80" r="55" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6"
                className="text-primary drop-shadow-[0_0_8px_rgba(51,255,0,0.5)]"
                strokeDasharray="345.6"
                initial={{ strokeDashoffset: 345.6 }}
                whileInView={{ strokeDashoffset: 62.2 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-6xl font-bold text-primary relative z-10">
              <motion.span
                initial={{ opacity: 0, filter: "blur(10px)", scale: 0.5 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="inline-block"
              >
                82
              </motion.span>
            </div>
          </div>
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }} className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">Market Viability Score</motion.div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-black/40 p-6 rounded-lg font-mono text-sm border border-white/5 hover:border-primary/30 transition-colors duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(51,255,0,0.6)]" />
            <span className="font-bold relative z-10">ANÁLISE EXECUTIVA</span>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-4 relative z-10 group-hover:text-zinc-300 transition-colors duration-500">
            &quot;Sua ideia possui um gap técnico claro no mercado brasileiro. A barreira de entrada é moderada, mas a retenção projetada é alta devido à dor latente identificada no setor logístico. Recomendamos focar no MVP para integração com SEFAZ.&quot;
          </p>
          <div className="flex flex-wrap gap-4 relative z-10">
            <span className="text-green-500 text-[0.625rem] md:text-xs bg-green-500/10 border border-green-500/20 px-2 py-1 rounded shadow-sm">[+] ALTO POTENCIAL DE LTV</span>
            <span className="text-yellow-500 text-[0.625rem] md:text-xs bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded shadow-sm">[!] CAC ELEVADO INICIAL</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

const Roadmap = () => (
  <section className="max-w-6xl mx-auto px-6 py-32 relative">
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } }
      }}
    >
      <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="mb-12 md:mb-16">
        <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Próximos Passos</span>
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">Roadmap de Execução</h2>
      </motion.div>

      <div className="relative">
        {/* Linha do Tempo (Somente Desktop) */}
        <div className="hidden md:block absolute top-[9px] left-[12.5%] w-[75%] h-px bg-white/10" />
        <motion.div 
          className="hidden md:block absolute top-[9px] left-[12.5%] w-[75%] h-[2px] bg-primary shadow-[0_0_15px_rgba(51,255,0,0.8)] origin-left" 
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.5, ease: "easeOut", delay: 0.5 } } }}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 md:pt-10">
          {[
            { num: '01', title: 'Definição de Core', desc: 'Focar na funcionalidade que resolve 80% da dor detectada.', icon: <Target size={24} /> },
            { num: '02', title: 'Aquisição Alpha', desc: 'Abordagem direta dos leads identificados no relatório.', icon: <Rocket size={24} /> },
            { num: '03', title: 'Refinamento IA', desc: 'Ajuste de precificação com base nos benchmarks de mercado.', icon: <Cpu size={24} /> },
            { num: '04', title: 'Pitch Deck', desc: 'Exportar os dados Sovereign para rodada de investimento.', icon: <FileText size={24} /> }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }}
              className="relative group mt-6 md:mt-0"
            >
              {/* Ponto na Linha do Tempo */}
              <div className="hidden md:flex absolute -top-10 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-surface border-2 border-white/20 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(51,255,0,0.6)] transition-all duration-500 items-center justify-center z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-colors duration-500" />
              </div>

              {/* Card */}
              <div className="bg-surface-card p-8 rounded-xl border border-white/5 hover:border-primary/40 hover:bg-black/40 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(51,255,0,0.06)] h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="text-4xl text-white/5 font-mono font-bold group-hover:text-primary/20 transition-colors duration-500">{item.num}</div>
                  <div className="text-zinc-600 group-hover:text-primary transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-[0_0_10px_rgba(51,255,0,0.8)]">
                    {item.icon}
                  </div>
                </div>
                
                <h4 className="font-bold mb-3 text-lg group-hover:text-white transition-colors duration-500 relative z-10">{item.title}</h4>
                <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500 leading-relaxed relative z-10">{item.desc}</p>
                
                {/* Linha Inferior do Card */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/0 group-hover:bg-primary transition-colors duration-500 shadow-[0_0_15px_rgba(51,255,0,0.8)] opacity-0 group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
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
          <button className="group bg-black text-primary px-10 py-4 font-bold rounded flex items-center justify-center gap-2 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(51,255,0,0.2)] active:scale-95 transition-all duration-300 cursor-pointer">
            Começar Agora
            <Zap size={20} className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(51,255,0,0.8)] transition-all duration-300" />
          </button>
          <button className="border border-black/30 text-black px-10 py-4 font-bold rounded hover:bg-black/5 hover:border-black/50 active:scale-95 transition-all duration-300 cursor-pointer">
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
        {['Privacidade', 'Termos'].map((link) => (
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
