"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Timer } from 'lucide-react';

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
        <div className="text-primary text-5xl font-bold mb-4 uppercase tracking-tighter">Demo Data</div>
        <div className="text-xl font-bold uppercase tracking-widest mb-2 opacity-50">Precisão Preditiva</div>
        <div className="text-zinc-500 text-sm mb-10 leading-relaxed">
          Taxa de sucesso na validação de modelos SaaS e Consumer Tech em 2023.
          <br />
          <span className="text-[0.625rem] text-primary/40 mt-4 block uppercase tracking-widest">
            * Métricas ilustrativas para fins de demonstração
          </span>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 0.85, 0.7, 0.55, 0.4, 0.25].map((op, i) => (
            <div key={i} className="w-1.5 h-10 bg-primary rounded-sm" style={{ opacity: op }} />
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default CompetitiveAdvantage;
