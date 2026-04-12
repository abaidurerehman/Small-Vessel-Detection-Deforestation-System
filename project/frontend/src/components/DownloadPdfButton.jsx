import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { downloadDetectionPdf } from '../utils/downloadPdf.js';

export default function DownloadPdfButton({ type, result, accentColor = '#4ade80' }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!result || loading) return;
    setLoading(true);
    try {
      const imageDataUrl = result.annotated_image
        ? `data:image/jpeg;base64,${result.annotated_image}`
        : null;
      await downloadDetectionPdf({ type, result, imageDataUrl });
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={!result || loading}
      whileHover={result && !loading ? { scale: 1.03, boxShadow: `0 0 20px ${accentColor}30` } : {}}
      whileTap={result && !loading ? { scale: 0.97 } : {}}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: result && !loading ? `${accentColor}15` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${result && !loading ? accentColor + '40' : 'rgba(255,255,255,0.08)'}`,
        color: result && !loading ? accentColor : '#475569',
        cursor: result && !loading ? 'pointer' : 'not-allowed',
      }}
    >
      {loading ? (
        <>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 rounded-full border-2 border-current border-t-transparent" />
          Generating PDF…
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download PDF Report
        </>
      )}
    </motion.button>
  );
}
