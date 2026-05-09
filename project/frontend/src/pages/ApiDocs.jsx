import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const endpoints = [
  {
    method: 'POST',
    path: '/api/v1/predict-vessel',
    color: '#0284c7',
    desc: 'Detect small vessels in satellite imagery using the YOLOv8 model.',
    request:
      'multipart/form-data: file (image), confidence (float, default 0.25), iou (float, default 0.45)',
    response: `{
  "vessel_count": 2,
  "detections": [
    {
      "id": 1,
      "class": "ship",
      "confidence": 0.862
    }
  ],
  "average_confidence_percent": "86.2%",
  "inference_time_str": "342.15 ms",
  "annotated_image": "<base64-jpeg>",
  "model_version": "Vesselmodel-YOLO"
}`,
    curl: `curl -X POST http://localhost:8000/api/v1/predict-vessel \\
  -H "Authorization: Bearer supersecrettoken123" \\
  -F "file=@satellite.jpg" \\
  -F "confidence=0.25"`,
  },

  {
    method: 'POST',
    path: '/api/v1/predict-deforestation',
    color: '#16a34a',
    desc: 'Detect deforestation regions from satellite imagery.',
    request:
      'multipart/form-data: file (image), confidence (float, default 0.25), iou (float, default 0.45)',
    response: `{
  "total_detections": 3,
  "class_counts": {
    "Deforestation": 2,
    "Healthy Forest": 1
  },
  "average_confidence_percent": "78.4%",
  "annotated_image": "<base64-jpeg>",
  "model_version": "Deforestationmodel-YOLO"
}`,
    curl: `curl -X POST http://localhost:8000/api/v1/predict-deforestation \\
  -H "Authorization: Bearer supersecrettoken123" \\
  -F "file=@forest.jpg" \\
  -F "confidence=0.25" \\
  -F "iou=0.45"`,
  },

  {
    method: 'GET',
    path: '/api/v1/health',
    color: '#7c3aed',
    desc: 'Check API gateway and AI microservice health.',
    request: 'No parameters required.',
    response: `{
  "gateway": "healthy",
  "services": {
    "deforestation": "healthy",
    "vessel": "healthy"
  }
}`,
    curl: `curl http://localhost:8000/api/v1/health \\
  -H "Authorization: Bearer supersecrettoken123"`,
  },
];

/* ── Reveal ───────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    margin: '-60px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Floating Particle ───────────────────────────────── */
function Particle({ x, y, size, color, dur, delay }) {
  return (
    <motion.div
      animate={{
        y: [-12, 12, -12],
        x: [-6, 6, -6],
        opacity: [0.4, 0.9, 0.4],
      }}
      transition={{
        duration: dur,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        filter: 'blur(40px)',
        transform: 'translate(-50%,-50%)',
      }}
    />
  );
}

/* ── Code Block ──────────────────────────────────────── */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#0f172a',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-mono transition-all"
        style={{
          background: 'rgba(255,255,255,0.08)',
          color: copied ? '#22c55e' : '#cbd5e1',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>

      <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

export default function ApiDocs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen px-6 pt-28 pb-20"
      style={{
        background:
          'linear-gradient(160deg, #f8fafc 0%, #f3f4f6 45%, #eef2ff 100%)',
      }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 dot-pattern opacity-40" />

        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 20% 15%, rgba(124,58,237,0.10) 0%, transparent 60%)',
          }}
        />

        <Particle
          x="10%"
          y="20%"
          size={240}
          color="rgba(124,58,237,0.10)"
          dur={7}
          delay={0}
        />

        <Particle
          x="88%"
          y="65%"
          size={180}
          color="rgba(59,130,246,0.08)"
          dur={8}
          delay={1}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-mono tracking-widest uppercase"
            style={{
              background: 'rgba(124,58,237,0.08)',
              border: '1px solid rgba(124,58,237,0.2)',
              color: '#7c3aed',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            REST API
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight mb-5">
            <span className="text-slate-800">⚡ API </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-500">
              Documentation
            </span>
          </h1>

          <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
            Complete API reference for SentinelAI microservices including
            Vessel Detection, Deforestation Detection, and Gateway Health APIs.
          </p>

          <div
            className="mt-7 rounded-2xl px-5 py-4 inline-flex flex-col items-start gap-2"
            style={{
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.15)',
            }}
          >
            <p className="text-xs uppercase tracking-widest font-mono text-violet-600">
              Base URL
            </p>

            <code className="font-mono text-slate-700 text-sm">
              http://localhost:8000
            </code>

            <div className="h-px w-full bg-violet-200" />

            <p className="text-xs uppercase tracking-widest font-mono text-violet-600">
              Authorization
            </p>

            <code className="font-mono text-slate-700 text-sm">
              Bearer supersecrettoken123
            </code>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="flex flex-col gap-8">
          {endpoints.map((ep, i) => (
            <Reveal key={ep.path} delay={i * 0.08}>
              <motion.div
                whileHover={{
                  y: -4,
                  boxShadow: `0 18px 40px ${ep.color}15`,
                }}
                className="glass rounded-3xl p-7 flex flex-col gap-5"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-lg font-mono font-bold text-xs"
                    style={{
                      background: `${ep.color}15`,
                      color: ep.color,
                      border: `1px solid ${ep.color}35`,
                    }}
                  >
                    {ep.method}
                  </span>

                  <code className="font-mono text-slate-700 text-sm">
                    {ep.path}
                  </code>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {ep.desc}
                </p>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                    Request
                  </p>

                  <div
                    className="rounded-xl px-4 py-3 text-sm font-mono text-slate-700"
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    {ep.request}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                    Response
                  </p>

                  <CodeBlock code={ep.response} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">
                    Example (curl)
                  </p>

                  <CodeBlock code={ep.curl} />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </motion.div>
  );
}