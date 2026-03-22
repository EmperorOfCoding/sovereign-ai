"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

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

export default CTA;
