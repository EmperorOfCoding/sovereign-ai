"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ValidationArchitecture() {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = (delay: number) => ({
    initial: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    whileInView: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 },
    transition: { delay: shouldReduceMotion ? 0 : delay },
  });

  return (
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
            {...animationProps(i * 0.2)}
            viewport={{ once: true }}
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
}
