import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ── Scroll-reveal wrapper ─────────────────────────────── */
function Reveal({ children, delay = 0, className = '', direction = 'up' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const variants = {
    hidden: { opacity: 0, y: direction==='up'?40:direction==='down'?-40:0, x: direction==='left'?40:direction==='right'?-40:0, scale: direction==='scale'?0.9:1 },
    show:   { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0.7, delay, ease: [0.22,1,0.36,1] } },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView?'show':'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Parallax section bg ───────────────────────────────── */
function ParallaxBg({ children, className='' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0,1], ['-8%','8%']);
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
  { q:'What satellite data do the models use?', a:'Both models are trained on multi-spectral satellite imagery including SAR, Sentinel-2, and high-resolution optical data at resolutions up to 10m per pixel.' },
  { q:'How accurate is the deforestation detection?', a:'The Deforestationmodel achieves over 94% mAP on benchmark datasets, validated against ground-truth surveys from multiple forest regions.' },
  { q:'What vessel sizes can be detected?', a:'The Vesselmodel reliably detects vessels from 5m in length in calm sea conditions with high-resolution SAR or optical satellite imagery.' },
  { q:'Can I use my own trained model?', a:'Yes. Place your .pt file in the ./models/ directory, update the MODEL_PATH environment variable in docker-compose.yml, and restart the service.' },
  { q:'Is the API secure?', a:'All endpoints are protected with Bearer token authentication. Restrict CORS to your frontend domain and enable HTTPS via a reverse proxy in production.' },
  { q:'What image formats are supported?', a:'JPEG, PNG, WEBP, and TIFF formats are accepted, up to 20 MB per upload.' },
  { q:'Do I need a GPU?', a:'No GPU is required. The system runs on CPU inside Docker. Inference takes 2-8 seconds per image on a standard laptop.' },
];

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:24 }} animate={inView?{opacity:1,y:0}:{opacity:0,y:24}}
      transition={{ duration:0.5, delay: index*0.06, ease:[0.22,1,0.36,1] }}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}
      onClick={()=>setOpen(v=>!v)}
    >
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        <span className="font-display font-medium text-white text-sm md:text-base group-hover:text-green-400 transition-colors">{q}</span>
        <motion.div animate={{ rotate: open?45:0 }} transition={{ duration:0.25 }} className="shrink-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ background: open?'rgba(74,222,128,0.2)':'rgba(74,222,128,0.1)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
            style={{ overflow:'hidden' }}>
            <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Counter animation ─────────────────────────────────── */
function CountUp({ to, suffix='' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  React.useEffect(() => {
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
  { value:'94', suffix:'%', label:'Detection Accuracy' },
  { value:'10', suffix:'m', label:'Pixel Resolution' },
  { value:'2',  suffix:'s', label:'Avg Inference Time' },
  { value:'3',  suffix:'+', label:'Satellite Sources' },
];

/* ── Home Page ─────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const heroRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0,1], ['0%','30%']);
  const heroOp   = useTransform(scrollYProgress, [0,0.7], [1,0]);

  const go = (path) => { window.scrollTo({top:0,behavior:'smooth'}); navigate(path); };

  return (
    <div className="relative overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-20">
        <motion.div style={{ y: heroY, opacity: heroOp }}
          className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.14) 0%, transparent 60%)' }}/>
          <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse 60% 40% at 80% 80%, rgba(14,165,233,0.08) 0%, transparent 50%)' }}/>
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize:'60px 60px',
          }}/>
          {/* Floating orbs */}
          {[
            { x:'15%', y:'25%', size:300, color:'rgba(34,197,94,0.06)', dur:7 },
            { x:'80%', y:'60%', size:200, color:'rgba(14,165,233,0.07)', dur:9 },
            { x:'50%', y:'80%', size:150, color:'rgba(167,139,250,0.05)', dur:6 },
          ].map((orb,i) => (
            <motion.div key={i}
              animate={{ y:[-12,12,-12], x:[-6,6,-6] }}
              transition={{ duration:orb.dur, repeat:Infinity, ease:'easeInOut', delay:i*1.5 }}
              className="absolute rounded-full pointer-events-none"
              style={{ left:orb.x, top:orb.y, width:orb.size, height:orb.size,
                       background:orb.color, filter:'blur(60px)', transform:'translate(-50%,-50%)' }}/>
          ))}
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-mono tracking-widest uppercase"
            style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.2)', color:'#4ade80' }}>
            <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:1.8, repeat:Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"/>
            AI-Powered Satellite Intelligence
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.9, delay:0.1, ease:[0.22,1,0.36,1] }}
            className="font-display font-800 text-5xl md:text-7xl leading-[1.05] mb-6">
            <span className="text-white">Earth Detection</span>
            <br />
            <motion.span
              initial={{ backgroundPosition:'200% center' }}
              animate={{ backgroundPosition:'0% center' }}
              transition={{ duration:1.2, delay:0.6 }}
              className="text-gradient-forest">
              from Space.
            </motion.span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Detect deforestation patterns and small maritime vessels in satellite imagery using
            state-of-the-art YOLO deep learning models — in seconds.
          </motion.p>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.45 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <motion.button onClick={() => go('/deforestation')}
              whileHover={{ scale:1.05, boxShadow:'0 0 40px rgba(34,197,94,0.5)' }}
              whileTap={{ scale:0.97 }}
              className="px-8 py-3.5 rounded-xl font-display font-semibold text-black text-sm"
              style={{ background:'linear-gradient(135deg,#4ade80,#22c55e)' }}>
              Deforestation Detection →
            </motion.button>
            <motion.button onClick={() => go('/vessel-detection')}
              whileHover={{ scale:1.05, boxShadow:'0 0 40px rgba(14,165,233,0.4)' }}
              whileTap={{ scale:0.97 }}
              className="px-8 py-3.5 rounded-xl font-display font-semibold text-white text-sm"
              style={{ background:'rgba(14,165,233,0.15)', border:'1px solid rgba(14,165,233,0.3)' }}>
              Vessel Detection →
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7, delay:0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ value, suffix, label }, i) => (
              <motion.div key={label}
                whileHover={{ scale:1.06, y:-4 }}
                transition={{ type:'spring', stiffness:300 }}
                className="glass rounded-xl p-4 text-center">
                <div className="font-display font-bold text-2xl text-green-400 mb-1">
                  <CountUp to={value} suffix={suffix}/>
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            className="mt-16 flex flex-col items-center gap-2">
            <span className="text-xs text-slate-600 font-mono tracking-widest uppercase">Scroll to explore</span>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:1.5, repeat:Infinity }}
              className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
              style={{ border:'1px solid rgba(255,255,255,0.15)' }}>
              <div className="w-1 h-2 rounded-full bg-green-400"/>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────── */}
      <section className="px-6 py-28 relative">
        <ParallaxBg className="absolute inset-0">
          <div style={{ background:'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(34,197,94,0.04) 0%, transparent 70%)', position:'absolute', inset:0 }}/>
        </ParallaxBg>
        <div className="max-w-6xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-mono text-green-400 tracking-widest uppercase mb-3">About the Platform</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Two Models. One Mission.</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Two specialized YOLO deep learning pipelines behind a clean, production-grade FastAPI microservice architecture — making satellite AI accessible to everyone.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { emoji:'🌿', title:'Deforestation Detection', color:'#4ade80',
                desc:'Multi-spectral analysis locates deforested, degraded, and recovering forest zones with YOLO bounding boxes and confidence scores on any uploaded satellite image.',
                path:'/deforestation' },
              { emoji:'🚢', title:'Small Vessel Detection', color:'#38bdf8',
                desc:'Object-detection network locates and classifies maritime vessels in dark SAR or optical satellite imagery, returning annotated bounding boxes with class labels.',
                path:'/vessel-detection' },
            ].map(({ emoji, title, color, desc, path }, i) => (
              <Reveal key={title} delay={i*0.12} direction={i===0?'left':'right'}>
                <motion.button onClick={() => go(path)} className="block h-full w-full text-left"
                  whileHover={{ y:-8, boxShadow:`0 24px 64px ${color}18` }}
                  transition={{ type:'spring', stiffness:250 }}>
                  <div className="glass rounded-2xl p-8 h-full transition-all duration-300"
                    style={{ border:`1px solid ${color}20` }}>
                    <div className="text-4xl mb-5">{emoji}</div>
                    <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
                    <span className="text-sm font-medium" style={{ color }}>Try it now →</span>
                  </div>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className="px-6 py-28 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)' }}/>
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-3">Workflow</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">How It Works</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step:'01', title:'Upload Image',   desc:'Drag & drop any satellite or aerial image. JPEG, PNG, WEBP and TIFF up to 20MB supported.', emoji:'📤' },
              { step:'02', title:'AI Inference',   desc:'Your image runs through YOLO on our FastAPI microservice. Real detections in 2–8 seconds on CPU.', emoji:'🧠' },
              { step:'03', title:'View & Download', desc:'Receive an annotated image, bounding boxes, class names, confidence scores, and download a PDF report.', emoji:'📊' },
            ].map(({ step, title, desc, emoji }, i) => (
              <Reveal key={step} delay={i*0.12} direction='scale'>
                <motion.div whileHover={{ y:-6, scale:1.02 }} transition={{ type:'spring', stiffness:250 }}
                  className="glass rounded-2xl p-7 relative overflow-hidden">
                  <div className="font-mono text-7xl font-bold absolute -top-2 -right-2 select-none"
                    style={{ color:'rgba(255,255,255,0.025)' }}>{step}</div>
                  <div className="text-3xl mb-4">{emoji}</div>
                  <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  <div className="absolute bottom-0 left-0 h-0.5 w-full"
                    style={{ background:`linear-gradient(90deg, #4ade80${['60','40','20'][i]}, transparent)` }}/>
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
            <p className="text-xs font-mono text-green-400 tracking-widest uppercase mb-3">Training Evidence</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">Model Samples & Results</h2>
            <p className="text-slate-400 text-sm">Real training images and performance charts from both models</p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src:'/images/sample_vessel.PNG',                      label:'Vessel Samples',       color:'#38bdf8' },
              { src:'/images/vessel_training_result.png',             label:'Vessel Training',      color:'#38bdf8' },
              { src:'/images/sample_deforestation.PNG',               label:'Deforestation Samples',color:'#4ade80' },
              { src:'/images/training_result_deforestation_model.PNG',label:'Forest Training',      color:'#4ade80' },
            ].map(({ src, label, color }, i) => (
              <Reveal key={src} delay={i*0.08} direction='up'>
                <motion.div whileHover={{ scale:1.04, y:-4, boxShadow:`0 16px 40px ${color}20` }}
                  transition={{ type:'spring', stiffness:280 }}
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ border:`1px solid ${color}25` }}>
                  <img src={src} alt={label} className="w-full object-cover" style={{ height:140 }}/>
                  <div className="px-3 py-2" style={{ background:`${color}0d` }}>
                    <p className="text-xs font-mono" style={{ color }}>{label}</p>
                  </div>
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
            <p className="text-xs font-mono text-green-400 tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white">Common Questions</h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {faqs.map((item, i) => <FAQItem key={i} q={item.q} a={item.a} index={i}/>)}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <motion.div whileHover={{ boxShadow:'0 0 100px rgba(34,197,94,0.15)' }}
              className="relative rounded-3xl overflow-hidden p-12 text-center"
              style={{ background:'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(14,165,233,0.08))', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.1) 0%, transparent 70%)' }}/>
              {/* Animated corner rings */}
              {[0,1].map(i => (
                <motion.div key={i}
                  animate={{ rotate: i===0?360:-360, scale:[1,1.05,1] }}
                  transition={{ duration:12+i*4, repeat:Infinity, ease:'linear' }}
                  className="absolute rounded-full pointer-events-none"
                  style={{ width:200+i*100, height:200+i*100,
                    border:`1px solid rgba(34,197,94,${0.06-i*0.02})`,
                    top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}/>
              ))}
              <div className="relative z-10">
                <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">Start Analysing Today</h2>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Upload your first satellite image and see AI-powered environmental intelligence in action — no account required.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button onClick={() => go('/deforestation')}
                    whileHover={{ scale:1.06, boxShadow:'0 0 40px rgba(34,197,94,0.5)' }}
                    whileTap={{ scale:0.97 }}
                    className="px-8 py-3.5 rounded-xl font-display font-semibold text-black"
                    style={{ background:'linear-gradient(135deg,#4ade80,#22c55e)' }}>
                    Forest Analysis
                  </motion.button>
                  <motion.button onClick={() => go('/vessel-detection')}
                    whileHover={{ scale:1.06, boxShadow:'0 0 40px rgba(14,165,233,0.4)' }}
                    whileTap={{ scale:0.97 }}
                    className="px-8 py-3.5 rounded-xl font-display font-semibold text-white"
                    style={{ background:'rgba(14,165,233,0.15)', border:'1px solid rgba(14,165,233,0.3)' }}>
                    Maritime Analysis
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
