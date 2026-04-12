import React from 'react';
import { motion } from 'framer-motion';

export default function ConfidenceBar({ label, value, color = '#4ade80', delay = 0 }) {
  const pct = Math.round(value * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-400 truncate pr-2">{label}</span>
        <span className="text-sm font-mono font-medium text-white shrink-0">{pct}%</span>
      </div>
      <div className="confidence-bar w-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className="confidence-fill"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}50`,
          }}
        />
      </div>
    </div>
  );
}
