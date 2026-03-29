"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function CTA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <section className="max-w-6xl mx-auto px-6 pb-32" />;

  return (
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
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 1 },
              visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
            }}
            className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tighter leading-[1.1]"
          >
            {"Chega de adivinhar.".split('').map((char, index) => (
              <motion.span key={`c1-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            <br />
            {"Comece a validar.".split('').map((char, index) => (
              <motion.span key={`c2-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-black/70 font-medium text-lg mb-10 max-w-xl mx-auto"
          >
            O mercado não perdoa o amadorismo. Use a inteligência que os grandes players usam para dominar seu nicho.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="group bg-black text-primary px-10 py-4 font-bold rounded flex items-center justify-center gap-2 hover:bg-zinc-900 hover:shadow-[0_0_20px_rgba(51,255,0,0.2)] active:scale-95 transition-all duration-300 cursor-pointer">
              Começar Agora
              <Zap size={20} className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(51,255,0,0.8)] transition-all duration-300" />
            </button>
            <button className="border border-black/30 text-black px-10 py-4 font-bold rounded hover:bg-black/5 hover:border-black/50 active:scale-95 transition-all duration-300 cursor-pointer">
              Ver Demonstração
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
