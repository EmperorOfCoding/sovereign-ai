"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Brain, 
  Clock, 
  AlertCircle, 
  MessageSquareWarning, 
  TrendingUp, 
  Cpu, 
  DollarSign, 
  Compass, 
  Gavel, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import ScoreBar from './ScoreBar';
import { AnalysisResult, ApiError, EvidenceType } from '../types/analysis';

/** Human-readable label + colour for each evidence category */
const EVIDENCE_TYPE_META: Record<EvidenceType, { label: string; className: string }> = {
  RELATO_DIRETO:   { label: 'Relato Direto',   className: 'text-green-400 bg-green-400/10 border-green-400/30' },
  FORUM_DISCUSSAO: { label: 'Fórum/Comunidade', className: 'text-sky-400 bg-sky-400/10 border-sky-400/30' },
  DADOS_MERCADO:   { label: 'Dados de Mercado', className: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
};

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

const SearchResultsModal = ({ isOpen, onClose, query }: SearchResultsModalProps) => {
  const [step, setStep] = useState(0);
  const [loadingText, setLoadingText] = useState('Cruzando bases de dados globais...');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<ApiError>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Stabilize query on open
  const queryOnOpenRef = useRef(query);

  useEffect(() => {
    if (!isOpen) return;

    // Capture the current query value only when the modal opens
    queryOnOpenRef.current = query;

    // Reset state
    setStep(0);
    setAnalysisResults(null);
    setApiError(null);
    setLoadingText('Cruzando bases de dados globais...');

    // Animate loading steps
    const t1 = setTimeout(() => { setStep(1); setLoadingText('Analisando sinais de dor...'); }, 1500);
    const t2 = setTimeout(() => { setStep(2); setLoadingText('Processando evidências...'); }, 3000);
    const t3 = setTimeout(() => { setStep(3); setLoadingText('Calculando indicadores...'); }, 4500);

    // Fetch from backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const controller = new AbortController();

    fetch(`${backendUrl}/api/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryOnOpenRef.current }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 429) {
          setApiError('RATE_LIMIT_EXCEEDED');
          setStep(4);
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          setApiError('ANALYSIS_FAILED');
          setStep(4);
          return;
        }

        try {
          const body = await res.json();
          if (!body.success) {
            setApiError('ANALYSIS_FAILED');
          } else {
            setAnalysisResults(body.data);
          }
          setStep(4);
        } catch (err) {
          setApiError('ANALYSIS_FAILED');
          setStep(4);
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setApiError('ANALYSIS_FAILED');
        setStep(4);
      });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      controller.abort();
    };
  }, [isOpen]); // Only depend on isOpen to prevent re-fetches when query changes while open

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
                <span className="text-primary italic">&quot;{queryOnOpenRef.current}&quot;</span>
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

            {/* Error States */}
            {!isLoading && apiError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8"
              >
                {apiError === 'RATE_LIMIT_EXCEEDED' ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
                    <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                      <Clock size={36} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-yellow-500 mb-2">Limite Diário Atingido</p>
                      <p className="text-zinc-400">Você usou todas as suas pesquisas de hoje. Volte amanhã para continuar validando suas ideias.</p>
                    </div>
                    <button onClick={onClose} className="mt-2 px-8 py-3 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer text-sm font-bold uppercase tracking-widest">
                      Entendido
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
                    <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
                      <AlertCircle size={36} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-red-500 mb-2">Erro na Análise</p>
                      <p className="text-zinc-400">Não foi possível processar sua pesquisa. Por favor, tente novamente em instantes.</p>
                    </div>
                    <button onClick={onClose} className="mt-2 px-8 py-3 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer text-sm font-bold uppercase tracking-widest">
                      Fechar
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {!isLoading && !apiError && analysisResults && (
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
                    {analysisResults.evidences.map((ev, i) => {
                      const meta = EVIDENCE_TYPE_META[ev.evidenceType] ?? EVIDENCE_TYPE_META.RELATO_DIRETO;
                      return (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-black/30 p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-primary font-mono font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">{ev.source}</span>
                            <span className={`text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${meta.className}`}>
                              {meta.label}
                            </span>
                          </div>
                          <p className="text-base text-zinc-300 italic leading-relaxed font-medium">&quot;{ev.text}&quot;</p>
                          {ev.sourceUrl && (
                            <a
                              href={ev.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-3 text-[0.65rem] text-zinc-500 hover:text-primary transition-colors font-mono underline underline-offset-2"
                            >
                              → Verificar fonte
                            </a>
                          )}
                        </motion.div>
                      );
                    })}
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
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-black/20 p-8 rounded-2xl border border-white/5">
                    <div className="space-y-6">
                      <ScoreBar score={analysisResults.painScore} label="Intensidade da Dor" delay={0.3} />
                      <ScoreBar score={analysisResults.aiSummaryScore} label="Consistência IA" delay={0.4} />
                      <ScoreBar score={analysisResults.paymentScore} label="Viabilidade Financeira" delay={0.5} />

                      {/* Data Confidence indicator */}
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-zinc-400" />
                            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Confiança dos Dados</span>
                          </div>
                          <span className={`text-xs font-black font-mono ${
                            analysisResults.dataConfidence >= 70 ? 'text-green-400' :
                            analysisResults.dataConfidence >= 40 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{analysisResults.dataConfidence}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResults.dataConfidence}%` }}
                            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              analysisResults.dataConfidence >= 70 ? 'bg-green-400' :
                              analysisResults.dataConfidence >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                            }`}
                          />
                        </div>
                        <p className="text-[0.65rem] text-zinc-600 mt-1.5">
                          {analysisResults.dataConfidence >= 70
                            ? 'Alta confiança: evidências diretas e volumosas'
                            : analysisResults.dataConfidence >= 40
                              ? 'Confiança moderada: alguns sinais diretos, parcialmente documentado'
                              : 'Baixa confiança: dados escassos — valide manualmente antes de decidir'}
                        </p>
                      </div>
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
                        <div className="text-[0.625rem] text-zinc-500 uppercase font-bold tracking-widest mt-1">Consistência</div>
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
                      <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Relatório Executivo — IA</span>
                    </div>
                    <p className="text-zinc-200 leading-relaxed font-medium">
                      {analysisResults.verdictReason}
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
                    {analysisResults.nextSteps.map((nextStep, i) => (
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
                        <p className="text-base text-zinc-300 leading-relaxed font-semibold group-hover:text-white transition-colors">{nextStep}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* 5. Veredito */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    boxShadow: [
                      "0 0 0px rgba(51, 255, 0, 0)", 
                      "0 0 40px rgba(51, 255, 0, 0.4)", 
                      "0 0 15px rgba(51, 255, 0, 0.1)"
                    ]
                  }} 
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    opacity: { duration: 0.5, delay: 0.6 },
                    y: { duration: 0.5, delay: 0.6 },
                    boxShadow: { duration: 1.5, delay: 0.8, times: [0, 0.3, 1] }
                  }}
                  className="verdict-shimmer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Gavel size={22} className="text-primary" />
                    </div>
                    <h4 className="font-bold text-white uppercase text-base tracking-widest">Veredito Sovereign</h4>
                  </div>
                  <div className={`p-8 rounded-2xl border-2 transition-all duration-500 ${
                    analysisResults.verdict === 'VÁLIDO' 
                      ? 'border-primary/40 bg-primary/5 shadow-primary-subtle' 
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

export default SearchResultsModal;
