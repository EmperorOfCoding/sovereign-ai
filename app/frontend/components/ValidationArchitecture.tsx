"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Target, Zap, Clock, Compass, Scale, BrainCircuit, RotateCcw, TrendingUp } from 'lucide-react';

export default function ValidationArchitecture() {
  const shouldReduceMotion = useReducedMotion();

  const motives = [
    {
      title: "Dados não-enviesados",
      desc: "A Sovereign te entrega dados não-enviesados de mercado que te ajudam a validar sua ideia antes de construí-la.",
      cardBg: "bg-[#BCE6EB]",
      tagIcon: <Target size={20} />,
      tagText: "imparcial",
      cardTitle: "100%",
      cardSubtitle: "Dados Reais",
      illustration: <Scale size={200} strokeWidth={1} className="absolute -bottom-16 -right-16 text-black/10 transform rotate-12" />
    },
    {
      title: "Tecnologias de ponta",
      desc: "A Sovereign se destaca por utilizar tecnologias de ponta para otimizar o nível de pesquisa, incomparável com outros modelos, como Claude, ChatGPT, etc.",
      cardBg: "bg-[#FCEBA2]",
      tagIcon: <Zap size={20} />,
      tagText: "tecnologia",
      cardTitle: "Deep",
      cardSubtitle: "Research",
      illustration: <BrainCircuit size={200} strokeWidth={1} className="absolute -bottom-16 -left-16 text-black/10 transform -rotate-12" />
    },
    {
      title: "Honestidade radical",
      desc: "A Sovereign é extremamente honesta, caso a sua ideia não resolva um problema, ela te diz e ainda te informa qual direção tomar a seguir, seguindo o modelo de Lean Startup (pivotar ou avançar).",
      cardBg: "bg-[#FCA5A5]",
      tagIcon: <Compass size={20} />,
      tagText: "veredito",
      cardTitle: "Pivotar",
      cardSubtitle: "ou Avançar",
      illustration: <RotateCcw size={200} strokeWidth={1} className="absolute -bottom-16 -right-16 text-black/10 transform rotate-45" />
    },
    {
      title: "Dados atualizados",
      desc: "A Sovereign apenas busca dados atualizados, o que ajuda a ver tendências recentes e não se basear em dados antigos.",
      cardBg: "bg-[#C4B5FD]",
      tagIcon: <Clock size={20} />,
      tagText: "real-time",
      cardTitle: "Tempo",
      cardSubtitle: "Real",
      illustration: <TrendingUp size={200} strokeWidth={1} className="absolute -bottom-16 -left-16 text-black/10" />
    }
  ];

  return (
    <section className="bg-surface py-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 md:mb-32"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-primary"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Produto
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white max-w-3xl leading-tight">
            Por que usar a Sovereign?
          </h2>
        </motion.div>

        <div className="space-y-32">
          {motives.map((motive, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
              >
                {/* Text Content */}
                <motion.div 
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="w-full md:w-1/2"
                >
                  <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6 leading-tight">
                    {motive.title}
                  </h3>
                  <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
                    {motive.desc}
                  </p>
                </motion.div>

                {/* Card Visual */}
                <motion.div 
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="w-full md:w-1/2"
                >
                  <div className={`relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden ${motive.cardBg} text-black p-8 md:p-12 shadow-2xl flex flex-col justify-center items-center text-center group transition-transform hover:-translate-y-2 duration-500`}>
                    
                    {/* Top Tag */}
                    <div className="absolute top-8 left-8 flex items-center gap-2 font-mono text-sm md:text-base font-bold uppercase tracking-wider opacity-80">
                      {motive.tagIcon}
                      {motive.tagText}
                    </div>

                    {/* Main Card Text */}
                    <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                      <div className="text-6xl md:text-[5.5rem] lg:text-[7rem] font-black tracking-tighter leading-none mb-4">
                        {motive.cardTitle}
                      </div>
                      <div className="text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80 border-t-2 border-black/10 pt-4 mt-2 inline-block">
                        {motive.cardSubtitle}
                      </div>
                    </div>

                    {/* Abstract Illustration */}
                    {motive.illustration}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
