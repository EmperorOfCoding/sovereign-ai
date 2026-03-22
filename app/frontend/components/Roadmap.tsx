"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Rocket, Cpu, FileText } from 'lucide-react';

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

export default Roadmap;
