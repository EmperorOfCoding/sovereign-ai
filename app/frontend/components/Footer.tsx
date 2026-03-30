import React from 'react';

const Footer = () => (
  <footer className="border-t border-white/5 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex flex-col items-center md:items-start">
        <div className="text-xl font-bold tracking-tighter text-primary uppercase mb-2">
          Sovereign AI
        </div>
        <div className="text-[0.625rem] uppercase tracking-widest text-zinc-500">
          © 2024 Sovereign AI. Terminal Protocol Active.
        </div>
      </div>
      <div className="flex gap-8">
        {['Privacidade', 'Termos'].map((link) => (
          <a key={link} href="#" className="text-[0.625rem] uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-4 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[0.625rem] font-mono text-primary uppercase tracking-widest">System Online: v2.4.0</span>
      </div>
    </div>
  </footer>
);

export default Footer;
