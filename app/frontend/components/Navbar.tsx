"use client";

import React from 'react';

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-2xl font-bold tracking-tighter text-primary uppercase cursor-pointer"
      >
        Sovereign AI
      </div>
    </div>
  </nav>
);

export default Navbar;
