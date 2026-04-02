"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle2, RefreshCcw, Clock, ArrowUpRight } from 'lucide-react';
import MagneticButton from './MagneticButton';
import SearchResultsModal from './SearchResultsModal';

export default function Hero() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = query.trim();
    if (normalized !== '') {
      setQuery(normalized);
      setIsOpen(true);
    }
  };

  const scrollToSearch = () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const videoUrl = process.env.NEXT_PUBLIC_MUX_VIDEO_URL ||
    "https://player.mux.com/jZJwlj2JLC79VyxbQ61ORYe8n45xC1cFt82gvABrWeM?metadata-video-title=Validate+Idea+AI+Video&video-title=Validate+Idea+AI+Video&autoplay=true&loop=true&muted=true&playsinline=true";

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex flex-col items-center justify-center text-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src={videoUrl}
          className="w-full h-full border-none object-cover"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          title="Background video"
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/70" />
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface to-transparent" />
      </div>

      <div className="max-w-4xl relative z-10">
        <motion.h1
          variants={{
            hidden: { opacity: 1 },
            visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.2 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 uppercase leading-none"
        >
          {"Valide sua próxima ".split('').map((char, index) => (
            <motion.span key={`t1-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          <br />
          <span className="text-primary italic inline-block">
            {"grande ideia".split('').map((char, index) => (
              <motion.span key={`t2-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }}>
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
          {" com IA".split('').map((char, index) => (
            <motion.span key={`t3-${index}`} className="inline-block" variants={{ hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } }}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 1, 0, 1] }}
          viewport={{ once: true }}
          transition={{ delay: 2.2, duration: 0.6, times: [0, 0.4, 0.6, 1] }}
          className="text-zinc-400 text-lg md:text-xl mb-10 font-light"
        >
          Tome decisões inteligentes baseadas em dados reais
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="mb-20 mx-auto w-fit"
        >
          <MagneticButton
            onClick={scrollToSearch}
            className="group relative flex items-center gap-2 bg-primary text-black px-10 py-4 font-bold rounded glow-primary hover:bg-[#2ee600] hover:shadow-[0_0_30px_rgba(51,255,0,0.4)] active:scale-95 transition-all duration-300 cursor-pointer"
            strength={0.4}
          >
            Começar Agora
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-3xl bg-surface-card/90 backdrop-blur-md border border-white/15 rounded-lg overflow-hidden relative z-10"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="text-[0.625rem] text-zinc-500 font-mono uppercase tracking-widest">
            Protocol v2.4.0 active
          </div>
        </div>
        <div className="p-6 text-left font-mono">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Search size={22} className="text-primary shrink-0 hidden sm:block delay-0 transition-all opacity-90" />
            <div className="flex-1 w-full border border-white/10 focus-within:border-white/30 transition-colors h-14 flex items-center bg-black/20">
              <Search size={20} className="text-primary ml-4 shrink-0 sm:hidden" />
              <div className="flex-1 relative h-full flex items-center terminal-input-wrapper">
                <input
                  id="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Descreva um problema..."
                  autoComplete="off"
                  className="w-full bg-transparent text-zinc-300 text-sm md:text-base outline-none px-4 placeholder:text-zinc-600 h-full font-mono flex-1 terminal-input"
                />
                <div 
                  className="terminal-cursor" 
                  style={{ 
                    left: `calc(1rem + ${query.length}ch)`,
                    display: query.length >= 50 ? 'none' : 'block'
                  }} 
                />
              </div>
            </div>
            <MagneticButton
              type="submit"
              disabled={!query.trim()}
              strength={0.25}
              className="shrink-0 flex items-center justify-center gap-3 px-6 h-12 bg-transparent hover:bg-primary transition-all duration-300 border border-white/15 hover:border-primary hover:shadow-[0_0_25px_rgba(51,255,0,0.3)] active:scale-[0.98] rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-2 sm:mt-0 group"
            >
              <div className="w-2 h-2 rounded-full bg-primary group-hover:bg-black group-hover:shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-all duration-300" />
              <span className="text-xs text-primary group-hover:text-black uppercase font-bold tracking-widest mt-0.5 transition-colors duration-300">Deep Research</span>
            </MagneticButton>
          </form>

          <div className="space-y-4 font-mono pl-0 sm:pl-[2.35rem]">
            <div className="flex items-center gap-3 text-sm md:text-base">
              <CheckCircle2 size={18} className="text-primary" />
              <span className="text-zinc-400">Escaneando bases de dados...</span>
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base">
              <RefreshCcw size={18} className="text-primary" />
              <span className="text-zinc-400">Analisando concorrência...</span>
            </div>
            <div className="flex items-center gap-3 text-sm md:text-base">
              <Clock size={18} className="text-white" />
              <span className="text-zinc-400">Gerando relatório de viabilidade...</span>
            </div>
            <div className="pt-4 flex items-center gap-3">
              <span className="text-primary font-bold text-lg leading-none">{'>'}</span>
              <span className="w-3 h-[1.125rem] bg-primary cursor-blink" />
            </div>
          </div>
        </div>
      </motion.div>
      <SearchResultsModal isOpen={isOpen} onClose={() => setIsOpen(false)} query={query} />
    </section>
  );
}
