"use client";

import React from 'react';
import { motion } from 'framer-motion';

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

export default Verdict;
