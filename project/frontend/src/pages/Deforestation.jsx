import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader.jsx';
import SpinnerOverlay from '../components/SpinnerOverlay.jsx';
import { predictDeforestation } from '../utils/api';
import DownloadPdfButton from '../components/DownloadPdfButton.jsx';

const ACCENT = '#16a34a';

/* ── Scroll-reveal wrapper ─────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
      scale: direction === 'scale' ? 0.92 : 1,
    },
    show: {
      opacity: 1, y: 0, x: 0, scale: 1,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Confidence slider ─────────────────────────────────── */
function Slider({ label, value, onChange, min = 0.01, max = 1, step = 0.01, leftLabel, rightLabel, accent = ACCENT }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color: accent }}>{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: accent }} />
      {leftLabel && (
        <div className="flex justify-between mt-1.5 text-xs text-slate-400 font-mono">
          <span>{leftLabel}</span><span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

/* ── Summary block ─────────────────────────────────────── */
function SummaryBlock({ text }) {
  if (!text) return null;
  return (
    <div className="rounded-xl p-4 text-sm leading-relaxed"
      style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)' }}>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**'))
          return <p key={i} className="font-semibold text-slate-800 mb-1">{line.replace(/\*\*/g, '')}</p>;
        if (line.startsWith('- '))
          return <p key={i} className="text-slate-600 ml-3">• {line.slice(2)}</p>;
        if (line.trim() === '') return <div key={i} className="h-1" />;
        return <p key={i} className="text-slate-600">{line.replace(/\*\*/g, '')}</p>;
      })}
    </div>
  );
}

/* ── Stat card ─────────────────────────────────────────── */
function StatCard({ value, label, color, delay }) {
  return (
    <Reveal delay={delay} direction="scale">
      <motion.div whileHover={{ scale: 1.05, y: -3 }} transition={{ type: 'spring', stiffness: 300 }}
        className="rounded-xl p-4 text-center"
        style={{ background: `${color}12`, border: `1.5px solid ${color}30` }}>
        <p className="font-mono font-bold text-3xl mb-1" style={{ color }}>{value}</p>
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      </motion.div>
    </Reveal>
  );
}

/* ── Floating particle ─────────────────────────────────── */
function Particle({ x, y, size, color, dur, delay }) {
  return (
    <motion.div
      animate={{ y: [-12, 12, -12], x: [-6, 6, -6], opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(40px)', transform: 'translate(-50%,-50%)' }}
    />
  );
}

/* ── Main page ─────────────────────────────────────────── */
export default function Deforestation() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [conf, setConf] = useState(0.25);
  const [iou, setIou] = useState(0.45);
  const [lightbox, setLightbox] = useState(null);

  const handleFile = useCallback((f) => { setFile(f); setResult(null); }, []);

  const handleDetect = async () => {
    if (!file) { toast.error('Please upload an image first.'); return; }
    setLoading(true); setProgress(0);
    try {
      const data = await predictDeforestation(file, conf, iou, setProgress);
      setResult(data);
      toast.success(`Analysis complete — ${data.total_detections} detection${data.total_detections !== 1 ? 's' : ''}`);
    } catch (err) { toast.error(err.message || 'Analysis failed.'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      className="relative min-h-screen px-6 pt-28 pb-20"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f0f4f8 45%, #e8f4fd 100%)' }}>

      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 20% 15%, rgba(34,197,94,0.15) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 85% 80%, rgba(34,197,94,0.08) 0%, transparent 55%)' }} />
        <Particle x="8%" y="30%" size={260} color="rgba(34,197,94,0.13)" dur={7} delay={0} />
        <Particle x="88%" y="55%" size={180} color="rgba(34,197,94,0.09)" dur={9} delay={2} />
        <Particle x="50%" y="85%" size={140} color="rgba(16,185,129,0.08)" dur={6} delay={1} />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setLightbox(null)}>
            <motion.img initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              src={lightbox} alt="Preview"
              className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
              onClick={e => e.stopPropagation()} />
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-mono tracking-widest uppercase"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#15803d' }}>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-600" />
            Deforestationmodel — {result ? (result.simulation ? 'Simulation' : 'Live YOLO') : 'Ready'}
          </motion.div>

          {/* Title with letter animation */}
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight mb-5">
            <span className="text-slate-800">🌳 Deforestation </span>
            <span className="text-gradient-forest">Detection</span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            YOLOv8-based Satellite Imagery Analysis — detect and classify deforestation indicators with bounding boxes and confidence scores.
          </motion.p>

          {/* Quick stats row */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-7">
            {[
              { label: '94%+ mAP', icon: '🎯' },
              { label: '10m Resolution', icon: '🛰️' },
              { label: 'CPU Inference', icon: '⚡' },
              { label: 'YOLO Architecture', icon: '🧠' },
            ].map(({ label, icon }) => (
              <span key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-slate-600"
                style={{ background: 'rgba(34,197,94,0.09)', border: '1px solid rgba(34,197,94,0.2)' }}>
                {icon} {label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── TRAINING GALLERY ── */}
        <Reveal className="mb-8">
          <div className="glass rounded-2xl p-6" style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.08)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-600">📷</span>
              <h3 className="font-display font-semibold text-slate-700">Model Training Overview</h3>
              <span className="text-xs text-slate-400 font-normal ml-1">— click to enlarge</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Sample images, dataset split, and training results from the Deforestationmodel.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { src: '/images/sample_deforestation.PNG', label: 'Sample Detections', color: '#16a34a' },
                { src: '/images/training_result_deforestation_model.PNG', label: 'Training Results', color: '#16a34a' },
                { src: '/images/confusion_metrix_deforestation_model.PNG', label: 'Confusion Matrix', color: '#0284c7' },
                { src: '/images/deforestation_dataset_split.PNG', label: 'Dataset Split', color: '#7c3aed' },
              ].map(({ src, label, color }, i) => (
                <motion.div key={src}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.04, y: -3, boxShadow: `0 12px 32px ${color}20` }}
                  className="cursor-pointer rounded-xl overflow-hidden"
                  style={{ border: `1.5px solid ${color}25`, background: '#fff' }}
                  onClick={() => setLightbox(src)}>
                  <img src={src} alt={label} className="w-full object-cover" style={{ height: 100 }} />
                  <div className="px-2 py-1.5" style={{ background: `${color}0d` }}>
                    <p className="text-xs font-mono font-medium truncate" style={{ color }}>{label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── MAIN TWO-COLUMN LAYOUT ── */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT — Upload */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-6 flex flex-col gap-5"
            style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.08)' }}>

            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>1</span>
              <h2 className="font-display font-semibold text-slate-700">Upload Satellite Image</h2>
            </div>

            <div className="relative">
              <ImageUploader onFileSelected={handleFile} accentColor={ACCENT} label="Drop satellite / aerial image" />
              <AnimatePresence>{loading && <SpinnerOverlay message="Running YOLO Inference…" accentColor={ACCENT} />}</AnimatePresence>
            </div>

            {/* Settings panel */}
            <div className="rounded-xl p-4 flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(34,197,94,0.18)', boxShadow: '0 2px 8px rgba(34,197,94,0.06)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-green-600 font-semibold uppercase tracking-widest">⚡ Inference Settings</span>
              </div>
              <Slider label="Confidence Threshold" value={conf} onChange={setConf}
                leftLabel="0.01 (detect all)" rightLabel="1.00 (strict)" />
              <Slider label="IoU Threshold" value={iou} onChange={setIou}
                leftLabel="0.01" rightLabel="1.00" />
            </div>

            {/* Detect button */}
            <motion.button onClick={handleDetect} disabled={!file || loading}
              whileHover={file && !loading ? { scale: 1.02, boxShadow: '0 8px 32px rgba(34,197,94,0.4)' } : {}}
              whileTap={file && !loading ? { scale: 0.98 } : {}}
              className="w-full py-4 rounded-xl font-display font-semibold text-base transition-all"
              style={{
                background: file && !loading ? 'linear-gradient(135deg,#16a34a,#22c55e)' : 'rgba(0,0,0,0.05)',
                color: file && !loading ? '#fff' : '#94a3b8',
                cursor: file && !loading ? 'pointer' : 'not-allowed',
                boxShadow: file && !loading ? '0 4px 18px rgba(34,197,94,0.3)' : 'none',
              }}>
              {loading ? `Uploading ${progress}%…` : '🔍 Detect Deforestation'}
            </motion.button>
          </motion.div>

          {/* RIGHT — Results */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-6 flex flex-col"
            style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.08)' }}>

            <div className="flex items-center gap-2 mb-5">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>2</span>
              <h2 className="font-display font-semibold text-slate-700">Detection Results</h2>
            </div>

            <AnimatePresence mode="wait">
              {/* Empty state */}
              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.2)' }}>
                    🌿
                  </motion.div>
                  <p className="text-slate-500 text-sm">Upload an image and click Detect</p>
                  <p className="text-slate-400 text-xs font-mono">JPEG · PNG · WEBP · TIFF up to 20 MB</p>
                </motion.div>
              )}

              {/* Results */}
              {result && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: '72vh' }}>

                  {/* Simulation warning */}
                  {result.simulation && (
                    <div className="px-4 py-3 rounded-xl flex items-start gap-2"
                      style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
                      <span>⚠️</span>
                      <p className="text-xs text-amber-700">
                        Simulation — place <code className="font-mono bg-amber-400/10 px-1 rounded">Deforestationmodel.pt</code> in{' '}
                        <code className="font-mono bg-amber-400/10 px-1 rounded">./models/</code> and restart.
                      </p>
                    </div>
                  )}

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <StatCard value={result.total_detections} label="Total Detections" color="#16a34a" delay={0} />
                    <StatCard value={result.average_confidence_percent} label="Avg Confidence" color="#0284c7" delay={0.06} />
                  </div>

                  {/* Annotated image */}
                  {result.annotated_image && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">Detection Output</p>
                      <motion.div whileHover={{ scale: 1.01 }} className="rounded-xl overflow-hidden cursor-zoom-in"
                        style={{ border: '1.5px solid rgba(34,197,94,0.2)', boxShadow: '0 4px 20px rgba(34,197,94,0.1)' }}
                        onClick={() => setLightbox(`data:image/jpeg;base64,${result.annotated_image}`)}>
                        <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="Annotated"
                          className="w-full object-contain rounded-xl"
                          style={{ maxHeight: 280, background: '#f8fafc' }} />
                      </motion.div>
                    </div>
                  )}

                  {/* Summary */}
                  {result.summary && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">Detection Summary</p>
                      <SummaryBlock text={result.summary} />
                    </div>
                  )}

                  {/* PDF download */}
                  <DownloadPdfButton type="deforestation" result={result} accentColor={ACCENT} />

                  {/* Footer meta */}
                  <div className="flex justify-between text-xs font-mono text-slate-400 pt-3"
                    style={{ borderTop: '1px solid rgba(34,197,94,0.15)' }}>
                    <span>{result.model_version}</span>
                    <span>{result.image_size?.width}×{result.image_size?.height}px</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── HOW TO USE ── */}
        <div className="mt-16">
          <Reveal className="text-center mb-8">
            <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-2">Guide</p>
            <h2 className="font-display font-bold text-2xl text-slate-700">How to Use This Tool</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: '01', icon: '📤', title: 'Upload Image', desc: 'Upload a satellite or aerial image in JPEG, PNG, WEBP or TIFF format up to 20 MB.', color: '#16a34a' },
              { step: '02', icon: '⚙️', title: 'Adjust Settings', desc: 'Tune the Confidence and IoU thresholds to control detection sensitivity.', color: '#0284c7' },
              { step: '03', icon: '📊', title: 'View & Export', desc: 'See annotated results, confidence scores, and download a full PDF report.', color: '#7c3aed' },
            ].map(({ step, icon, title, desc, color }, i) => (
              <Reveal key={step} delay={i * 0.1} direction="scale">
                <motion.div whileHover={{ y: -5, boxShadow: `0 16px 40px ${color}18` }}
                  transition={{ type: 'spring', stiffness: 280 }}
                  className="glass rounded-2xl p-6 relative overflow-hidden">
                  <div className="font-mono text-6xl font-bold absolute -top-1 -right-1 select-none"
                    style={{ color: `${color}10` }}>{step}</div>
                  <div className="text-2xl mb-3">{icon}</div>
                  <h3 className="font-display font-semibold text-slate-700 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  <div className="absolute bottom-0 left-0 h-0.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${color}70, transparent)` }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}