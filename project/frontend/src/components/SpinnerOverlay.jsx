import React from 'react';
import { motion } from 'framer-motion';

export default function SpinnerOverlay({ message = 'Analyzing...', accentColor = '#4ade80' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 rounded-2xl"
      style={{ background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(8px)' }}
    >
      {/* Radar ring */}
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${accentColor}` }}
            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
            transition={{
              duration: 1.8,
              delay: i * 0.6,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full"
          style={{ border: `2px solid ${accentColor}20`, borderTop: `2px solid ${accentColor}` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
      </div>

      <div className="text-center">
        <p className="font-display font-semibold text-white mb-1">{message}</p>
        <p className="text-xs text-slate-500 font-mono">Processing satellite imagery...</p>
      </div>

      {/* Scanning bar */}
      <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}
