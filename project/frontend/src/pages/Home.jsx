import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ── Scroll-reveal wrapper ─────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      scale: direction === 'scale' ? 0.9 : 1,
    },
    show: {
      opacity: 1, y: 0, x: 0, scale: 1,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Parallax section bg ───────────────────────────────── */
function ParallaxBg({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {children}
      </motion.div>
    </div>
  );
}

/* ── FAQ ───────────────────────────────────────────────── */
const faqs = [
  { q: 'What satellite data do the models use?', a: 'Both models are trained on multi-spectral satellite imagery including SAR, Sentinel-2, and high-resolution optical data at resolutions up to 10m per pixel.' },
  { q: 'How accurate is the deforestation detection?', a: 'The Deforestationmodel achieves over 94% mAP on benchmark datasets, validated against ground-truth surveys from multiple forest regions.' },
  { q: 'What vessel sizes can be detected?', a: 'The Vesselmodel reliably detects vessels from 5m in length in calm sea conditions with high-resolution SAR or optical satellite imagery.' },
  { q: 'Can I use my own trained model?', a: 'Yes. Place your .pt file in the ./models/ directory, update the MODEL_PATH environment variable in docker-compose.yml, and restart the service.' },
  { q: 'Is the API secure?', a: 'All endpoints are protected with Bearer token authentication. Restrict CORS to your frontend domain and enable HTTPS via a reverse proxy in production.' },
  { q: 'What image formats are supported?', a: 'JPEG, PNG, WEBP, and TIFF formats are accepted, up to 20 MB per upload.' },
  { q: 'Do I need a GPU?', a: 'No GPU is required. The system runs on CPU inside Docker. Inference takes 2-8 seconds per image on a standard laptop.' },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(34,197,94,0.18)', boxShadow: '0 2px 12px rgba(34,197,94,0.06)' }}
      onClick={() => setOpen(v => !v)}
    >
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-display font-medium text-slate-700 text-sm md:text-base group-hover:text-green-700 transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background: open ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}>
            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Counter animation ─────────────────────────────────── */
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseFloat(to);
    const dur = 1400;
    const step = (end / dur) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.round(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const stats = [
  { value: '94', suffix: '%', label: 'Detection Accuracy' },
  { value: '10', suffix: 'm', label: 'Pixel Resolution' },
  { value: '2', suffix: 's', label: 'Avg Inference Time' },
  { value: '3', suffix: '+', label: 'Satellite Sources' },
];

/* ── Floating particle ─────────────────────────────────── */
function Particle({ x, y, size, color, dur, delay }) {
  return (
    <motion.div
      animate={{ y: [-14, 14, -14], x: [-7, 7, -7], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(40px)', transform: 'translate(-50%,-50%)' }}
    />
  );
}

/* ── Home Page ─────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOp = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const go = (path) => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate(path); };

  // Hero title text split into two lines
  const line1 = 'Earth Detection';
  const line2 = 'from Space.';

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f0f4f8 45%, #e8f4fd 100%)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
        {/* Background layer */}
        <motion.div style={{ y: heroY, opacity: heroOp }} className="absolute inset-0 pointer-events-none">
          {/* Dot pattern */}
          <div className="absolute inset-0 dot-pattern opacity-50" />
          {/* Radial glows */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(34,197,94,0.2) 0%, transparent 65%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 35% at 88% 75%, rgba(14,165,233,0.13) 0%, transparent 55%)' }} />
          {/* Floating color orbs */}
          <Particle x="10%" y="28%" size={300} color="rgba(34,197,94,0.15)" dur={7} delay={0} />
          <Particle x="85%" y="52%" size={210} color="rgba(14,165,233,0.12)" dur={9} delay={1.5} />
          <Particle x="55%" y="85%" size={160} color="rgba(167,139,250,0.1)" dur={6} delay={3} />
          <Particle x="28%" y="72%" size={130} color="rgba(34,197,94,0.1)" dur={8} delay={2} />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Live badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-mono tracking-widest uppercase"
            style={{ background: 'rgba(34,197,94,0.13)', border: '1px solid rgba(34,197,94,0.3)', color: '#15803d' }}>
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-600" />
            AI-Powered Satellite Intelligence
          </motion.div>

          {/* ── LETTER-BY-LETTER TITLE ── */}
          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.08] mb-6">
            {/* Line 1 — "Earth Detection" — dark text, each letter rises */}
            <span className="block text-slate-800" style={{ perspective: '600px' }}>
              {line1.split('').map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  initial={{ opacity: 0, y: 36, rotateX: -70 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.2 + i * 0.048,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: 'inline-block',
                    transformOrigin: 'bottom center',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>

            {/* Line 2 — "from Space." — gradient, each letter pops up with slight bounce */}
            <span className="block">
              {line2.split('').map((char, i) => (
                <motion.span
                  key={`l2-${i}`}
                  initial={{ opacity: 0, y: 36, scale: 0.65 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.55,
                    delay: 1.0 + i * 0.055,
                    ease: [0.22, 1, 0.36, 1],
                    scale: { type: 'spring', stiffness: 300, damping: 18, delay: 1.0 + i * 0.055 },
                  }}
                  className="text-gradient-forest"
                  style={{
                    display: 'inline-block',
                    whiteSpace: char === ' ' ? 'pre' : 'normal',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.75 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Detect deforestation patterns and small maritime vessels in satellite imagery using
            state-of-the-art YOLO deep learning models — in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.95 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <motion.button onClick={() => go('/deforestation')}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(34,197,94,0.38)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-display font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
              🌿 Deforestation Detection →
            </motion.button>
            <motion.button onClick={() => go('/vessel-detection')}
              whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(14,165,233,0.26)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-display font-semibold text-sky-700 text-sm"
              style={{ background: 'rgba(14,165,233,0.1)', border: '1.5px solid rgba(14,165,233,0.35)' }}>
              🚢 Vessel Detection →
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.15 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ value, suffix, label }, i) => (
              <motion.div key={label}
                whileHover={{ scale: 1.07, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="glass rounded-xl p-4 text-center">
                <div className="font-display font-bold text-2xl text-green-600 mb-1">
                  <CountUp to={value} suffix={suffix} />
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }}
            className="mt-16 flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">Scroll to explore</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
              style={{ border: '1.5px solid rgba(34,197,94,0.4)' }}>
              <div className="w-1 h-2 rounded-full bg-green-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section className="px-6 py-28 relative">
        <ParallaxBg className="absolute inset-0">
          <div style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)', position: 'absolute', inset: 0 }} />
        </ParallaxBg>
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-3">About the Platform</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4">
              Two Models. <span className="text-gradient-forest">One Mission.</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Two specialized YOLO deep learning pipelines behind a clean, production-grade FastAPI microservice architecture — making satellite AI accessible to everyone.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji: '🌿', title: 'Deforestation Detection', color: '#16a34a', bg: 'rgba(34,197,94,0.06)',
                desc: 'Multi-spectral analysis locates deforested, degraded, and recovering forest zones with YOLO bounding boxes and confidence scores on any uploaded satellite image.',
                path: '/deforestation' },
              { emoji: '🚢', title: 'Small Vessel Detection', color: '#0284c7', bg: 'rgba(14,165,233,0.06)',
                desc: 'Object-detection network locates and classifies maritime vessels in SAR or optical satellite imagery, returning annotated bounding boxes with class labels.',
                path: '/vessel-detection' },
            ].map(({ emoji, title, color, bg, desc, path }, i) => (
              <Reveal key={title} delay={i * 0.12} direction={i === 0 ? 'left' : 'right'}>
                <motion.button onClick={() => go(path)} className="block h-full w-full text-left"
                  whileHover={{ y: -8, boxShadow: `0 24px 60px ${color}20` }}
                  transition={{ type: 'spring', stiffness: 250 }}>
                  <div className="glass rounded-2xl p-8 h-full transition-all duration-300"
                    style={{ border: `1.5px solid ${color}28`, background: bg }}>
                    <div className="text-4xl mb-5">{emoji}</div>
                    <h3 className="font-display font-semibold text-xl text-slate-800 mb-3">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{desc}</p>
                    <span className="text-sm font-semibold" style={{ color }}>Try it now →</span>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="px-6 py-28 relative" style={{ background: 'linear-gradient(180deg, transparent, rgba(14,165,233,0.04), transparent)' }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-mono text-sky-600 tracking-widest uppercase mb-3">Workflow</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4">
              How It <span className="text-gradient-ocean">Works</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Image', desc: 'Drag & drop any satellite or aerial image. JPEG, PNG, WEBP and TIFF up to 20MB supported.', emoji: '📤', color: '#16a34a' },
              { step: '02', title: 'AI Inference', desc: 'Your image runs through YOLO on our FastAPI microservice. Real detections in 2–8 seconds on CPU.', emoji: '🧠', color: '#0284c7' },
              { step: '03', title: 'View & Download', desc: 'Receive an annotated image, bounding boxes, class names, confidence scores, and download a PDF report.', emoji: '📊', color: '#7c3aed' },
            ].map(({ step, title, desc, emoji, color }, i) => (
              <Reveal key={step} delay={i * 0.12} direction="scale">
                <motion.div whileHover={{ y: -6, scale: 1.03, boxShadow: `0 20px 48px ${color}18` }}
                  transition={{ type: 'spring', stiffness: 250 }}
                  className="glass rounded-2xl p-7 relative overflow-hidden">
                  <div className="font-mono text-7xl font-bold absolute -top-2 -right-2 select-none"
                    style={{ color: `${color}12` }}>{step}</div>
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3 className="font-display font-semibold text-slate-800 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                  <div className="absolute bottom-0 left-0 h-0.5 w-full"
                    style={{ background: `linear-gradient(90deg, ${color}80, transparent)` }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODEL IMAGES ───────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-3">Training Evidence</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-3">
              Model Samples &amp; <span className="text-gradient-forest">Results</span>
            </h2>
            <p className="text-slate-500 text-sm">Real training images and performance charts from both models</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: '/images/sample_vessel.PNG', label: 'Vessel Samples', color: '#0284c7' },
              { src: '/images/vessel_training_result.png', label: 'Vessel Training', color: '#0284c7' },
              { src: '/images/sample_deforestation.PNG', label: 'Deforestation Samples', color: '#16a34a' },
              { src: '/images/training_result_deforestation_model.PNG', label: 'Forest Training', color: '#16a34a' },
            ].map(({ src, label, color }, i) => (
              <Reveal key={src} delay={i * 0.08} direction="up">
                <motion.div whileHover={{ scale: 1.04, y: -5, boxShadow: `0 16px 40px ${color}22` }}
                  transition={{ type: 'spring', stiffness: 280 }}
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ border: `1.5px solid ${color}30`, background: '#fff', boxShadow: `0 2px 12px ${color}10` }}>
                  <img src={src} alt={label} className="w-full object-cover" style={{ height: 140 }} />
                  <div className="px-3 py-2" style={{ background: `${color}0d` }}>
                    <p className="text-xs font-mono font-semibold" style={{ color }}>{label}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGY HIGHLIGHTS ──────────────────────────── */}
      <section className="px-6 py-20 relative">
        <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-mono text-purple-600 tracking-widest uppercase mb-3">Technology</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-800">
              Built on <span className="text-gradient-forest">Cutting-Edge</span> Stack
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: '⚡', name: 'YOLOv8', desc: 'Real-time object detection', color: '#d97706' },
              { icon: '🐍', name: 'FastAPI', desc: 'High-performance Python API', color: '#0ea5e9' },
              { icon: '🐳', name: 'Docker', desc: 'Containerized microservices', color: '#2563eb' },
              { icon: '🛰️', name: 'Sentinel-2', desc: 'Multispectral satellite data', color: '#16a34a' },
            ].map(({ icon, name, desc, color }, i) => (
              <Reveal key={name} delay={i * 0.1} direction="scale">
                <motion.div
                  whileHover={{ y: -6, scale: 1.05, boxShadow: `0 16px 40px ${color}1a` }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="glass rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="font-display font-bold text-slate-800 mb-1">{name}</div>
                  <div className="text-xs text-slate-500">{desc}</div>
                  <div className="mt-3 h-0.5 w-8 rounded-full mx-auto" style={{ background: color }} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="px-6 py-28">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-xs font-mono text-green-600 tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-800">
              Common <span className="text-gradient-forest">Questions</span>
            </h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <motion.div
              whileHover={{ boxShadow: '0 0 80px rgba(34,197,94,0.2)' }}
              className="relative rounded-3xl overflow-hidden p-12 text-center"
              style={{ background: 'linear-gradient(135deg, rgba(240,253,244,0.95), rgba(240,249,255,0.95))', border: '1.5px solid rgba(34,197,94,0.22)', backdropFilter: 'blur(16px)', boxShadow: '0 8px 48px rgba(34,197,94,0.1)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.13) 0%, transparent 70%)' }} />
              {[0, 1].map(i => (
                <motion.div key={i}
                  animate={{ rotate: i === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
                  transition={{ duration: 14 + i * 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute rounded-full pointer-events-none"
                  style={{ width: 220 + i * 110, height: 220 + i * 110,
                    border: `1.5px solid rgba(34,197,94,${0.12 - i * 0.04})`,
                    top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
              ))}
              <div className="relative z-10">
                <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-4">
                  Start Analysing <span className="text-gradient-forest">Today</span>
                </h2>
                <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                  Upload your first satellite image and see AI-powered environmental intelligence in action — no account required.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button onClick={() => go('/deforestation')}
                    whileHover={{ scale: 1.06, boxShadow: '0 8px 40px rgba(34,197,94,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 rounded-xl font-display font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 4px 18px rgba(34,197,94,0.3)' }}>
                    🌿 Forest Analysis
                  </motion.button>
                  <motion.button onClick={() => go('/vessel-detection')}
                    whileHover={{ scale: 1.06, boxShadow: '0 8px 40px rgba(14,165,233,0.28)' }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3.5 rounded-xl font-display font-semibold text-sky-700"
                    style={{ background: 'rgba(14,165,233,0.1)', border: '1.5px solid rgba(14,165,233,0.32)' }}>
                    🚢 Maritime Analysis
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
