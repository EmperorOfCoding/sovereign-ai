"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PainSignals() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <section className="max-w-6xl mx-auto px-6 py-32" />;

  return (
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
}
