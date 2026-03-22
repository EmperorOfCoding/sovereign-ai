import React from 'react';
import { motion } from 'framer-motion';

const ScoreBar = ({ score, maxScore = 10, label, delay = 0 }: { score: number; maxScore?: number; label: string; delay?: number }) => {
  const percentage = (score / maxScore) * 100;
  const getColor = (s: number) => {
    if (s >= 7) return 'bg-primary';
    if (s >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getTextColor = (s: number) => {
    if (s >= 7) return 'text-primary';
    if (s >= 4) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 text-xs w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className={`h-full rounded-full ${getColor(score)}`}
        />
      </div>
      <span className={`text-sm font-bold font-mono w-8 ${getTextColor(score)}`}>{score}</span>
    </div>
  );
};

export default ScoreBar;
