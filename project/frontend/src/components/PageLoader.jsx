import React from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-full"
        style={{
          border: '2px solid rgba(255,255,255,0.05)',
          borderTop: '2px solid #4ade80',
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-500 text-sm font-mono tracking-widest uppercase"
      >
        Loading...
      </motion.p>
    </div>
  );
}
