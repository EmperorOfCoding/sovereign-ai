"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  SearchX,
  Link2,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import DifferentialCardModal, {
  type DifferentialItem,
} from "./DifferentialCardModal";

// ─── Data ─────────────────────────────────────────────────────────────────────

const comparisons: DifferentialItem[] = [
  {
    id: "verifiable-evidence",
    icon: <ShieldCheck aria-hidden="true" focusable={false} />,
    sovereign:
      "Evidências verificáveis com URLs rastreáveis direto da fonte.",
    generic: "Respostas genéricas sem fontes verificáveis.",
    title: "Evidências Verificáveis",
    colorHsl: "hsl(142, 70%, 45%)",
    detail: {
      headline: "Por que evidência verificável é o diferencial central?",
      points: [
        "Cada dado retornado inclui a URL exata da fonte original — não apenas um resumo.",
        "Você pode auditar, confrontar e citar cada insight sem depender de memória de IA.",
        "Rastreabilidade garante que decisões estratégicas sejam baseadas em fatos, não em alucinações.",
        "Permite criar documentação de produto fundamentada antes mesmo do primeiro código.",
      ],
      cta: "Sem evidência verificável, qualquer análise de mercado é apenas uma opinião. Sovereign AI entrega fatos com endereço.",
    },
  },
  {
    id: "real-market-pain",
    icon: <AlertTriangle aria-hidden="true" focusable={false} />,
    sovereign:
      "Foco em dor real de mercado: reclamações, frustrações e gaps.",
    generic: "Apenas resumo superficial de conteúdo existente.",
    title: "Foco em Dor Real",
    colorHsl: "hsl(45, 90%, 55%)",
    detail: {
      headline: "Surfacing the pain that drives purchasing decisions",
      points: [
        "Coleta reclamações reais de Reddit, G2, Capterra, Trustpilot e fóruns setoriais.",
        "Agrupa frustrações por padrão de linguagem — não por categoria genérica de produto.",
        "Identifica gaps que concorrentes ignoram: funcionalidades ausentes, UX quebrada, suporte ruim.",
        "Transforma reclamações em oportunidades de posicionamento com base em evidência direta.",
      ],
      cta: "A dor não expressada é a oportunidade não capturada. Sovereign AI lê o que o mercado está gritando.",
    },
  },
  {
    id: "source-traceability",
    icon: <Link2 aria-hidden="true" focusable={false} />,
    sovereign:
      "Rastreabilidade total: cada sinal tem origem, URL e data.",
    generic: "Sem trilha de auditoria ou rastreamento de informação.",
    title: "Rastreabilidade das Fontes",
    colorHsl: "hsl(200, 85%, 55%)",
    detail: {
      headline: "Auditoria completa de cada sinal de mercado",
      points: [
        "Cada evidência é exibida com título, URL, domínio e timestamp — prontos para copiar.",
        "Filtros por categoria: reclamações, pesquisas acadêmicas, benchmarks, notícias de setor.",
        "Histórico de pesquisas permite comparar sinais de mercado ao longo do tempo.",
        "Compatível com fluxos de due diligence e relatórios para investidores.",
      ],
      cta: "Se você não pode mostrar de onde veio a informação, ela não serve como base de decisão.",
    },
  },
  {
    id: "idea-validation",
    icon: <Lightbulb aria-hidden="true" focusable={false} />,
    sovereign:
      "Apoio real para validação de ideias e tomada de decisão.",
    generic: "Informação superficial sem suporte para decisão.",
    title: "Validação de Ideias",
    colorHsl: "hsl(280, 70%, 60%)",
    detail: {
      headline: "Do insight à decisão em minutos, não semanas",
      points: [
        "Cruza sua hipótese com dados de mercado reais antes de você escrever uma linha de código.",
        "Aponta se o mercado já demanda a solução — ou se a dor ainda não foi articulada.",
        "Gera score de intensidade de dor com base no volume e recência dos sinais coletados.",
        "Integra com seu fluxo de discovery: product brief, entrevista de usuário, pitch deck.",
      ],
      cta: "Valide antes de construir. Sovereign AI é seu co-fundador de pesquisa antes do primeiro commit.",
    },
  },
];

// ─── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const itemVariantsReduced = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export default function WhySovereignAI() {
  const shouldReduceMotion = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  // Close on Escape globally
  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && openId) setOpenId(null);
    },
    [openId]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (openId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [openId]);

  const cardVariants = shouldReduceMotion ? itemVariantsReduced : itemVariants;

  return (
    <section id="why-sovereign" className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(51,255,0,0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={18} className="text-primary" aria-hidden="true" />
            <span className="text-primary text-xs font-bold uppercase tracking-[0.4em]">
              Diferencial
            </span>
            <Sparkles size={18} className="text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
            Por que a análise do{" "}
            <span className="text-primary">Sovereign AI</span>{" "}
            é melhor do que uma pesquisa comum em ferramentas de IA?
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Pesquisas genéricas geram respostas genéricas. Nós entregamos sinais
            de mercado reais, verificáveis e acionáveis — tudo o que você
            precisa para tomar decisões com confiança.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          /**
           * When a modal is open we need the grid to stay in the DOM so
           * layoutId can animate the card back to its original position.
           * The backdrop sits on top via z-index layering.
           */
        >
          {comparisons.map((item) => (
            <DifferentialCardModal
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onOpen={() => setOpenId(item.id)}
              onClose={() => setOpenId(null)}
              animVariants={cardVariants}
            />
          ))}
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-14"
        >
          <div className="inline-flex items-center gap-2 text-sm text-zinc-500 border border-white/5 px-5 py-2.5 rounded-full bg-surface-card/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="font-mono text-xs tracking-wider">
              Dados reais{" "}
              <ArrowRight size={12} className="inline mx-1 opacity-50" aria-hidden="true" />{" "}
              Decisões inteligentes
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
