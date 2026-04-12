import React, { useState } from 'react';
import { motion } from 'framer-motion';

const endpoints = [
  {
    method:'POST', path:'/api/v1/predict-vessel', color:'#38bdf8',
    desc:'Detect small vessels in a satellite image using the YOLO model.',
    request:'multipart/form-data: file (image), confidence (float, default 0.25), iou (float, default 0.45)',
    response:`{
  "vessel_count": 2,
  "detections": [
    { "id": 1, "class": "ship", "confidence": 0.862,
      "bbox": { "x": 337.0, "y": 101.2, "width": 67.3, "height": 185.8 } }
  ],
  "results_text": "| # | Class | Confidence | BBox |...",
  "average_confidence_percent": "86.2%",
  "inference_time_str": "342.15 ms",
  "annotated_image": "<base64-jpeg>",
  "model_version": "Vesselmodel-YOLO"
}`,
    curl:`curl -X POST http://localhost:8000/api/v1/predict-vessel \\
  -H "Authorization: Bearer supersecrettoken123" \\
  -F "file=@satellite.jpg" \\
  -F "confidence=0.25"`,
  },
  {
    method:'POST', path:'/api/v1/predict-deforestation', color:'#4ade80',
    desc:'Detect deforestation regions in satellite imagery using the YOLO model.',
    request:'multipart/form-data: file (image), confidence (float, default 0.25), iou (float, default 0.45)',
    response:`{
  "total_detections": 3,
  "class_counts": { "Deforestation": 2, "Healthy Forest": 1 },
  "summary": "**Total Detections: 3**\\n**Detections by Class:**\\n- Deforestation: 2",
  "detections": [...],
  "average_confidence_percent": "78.4%",
  "annotated_image": "<base64-jpeg>",
  "model_version": "Deforestationmodel-YOLO"
}`,
    curl:`curl -X POST http://localhost:8000/api/v1/predict-deforestation \\
  -H "Authorization: Bearer supersecrettoken123" \\
  -F "file=@forest.jpg" \\
  -F "confidence=0.25" \\
  -F "iou=0.45"`,
  },
  {
    method:'GET', path:'/api/v1/health', color:'#a78bfa',
    desc:'Check the health status of all services.',
    request:'No parameters required.',
    response:`{
  "gateway": "healthy",
  "services": {
    "deforestation": "healthy",
    "vessel": "healthy"
  }
}`,
    curl:`curl http://localhost:8000/api/v1/health \\
  -H "Authorization: Bearer supersecrettoken123"`,
  },
];

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl overflow-hidden" style={{background:'#0d1117'}}>
      <button onClick={()=>{ navigator.clipboard.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
        className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-mono transition-colors"
        style={{background:'rgba(255,255,255,0.1)',color:copied?'#4ade80':'#94a3b8'}}>
        {copied?'Copied!':'Copy'}
      </button>
      <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
}

export default function ApiDocs() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(167,139,250,0.06) 0%, transparent 60%)'}}/>
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-mono tracking-widest uppercase"
            style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',color:'#a78bfa'}}>
            REST API
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">API Documentation</h1>
          <p className="text-slate-400 max-w-xl">All endpoints require a Bearer token. Base URL: <code className="font-mono text-purple-400 text-sm bg-purple-400/10 px-2 py-0.5 rounded">http://localhost:8000</code></p>
          <div className="mt-4 px-4 py-3 rounded-xl flex items-center gap-3"
            style={{background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.2)'}}>
            <span className="text-purple-400 font-mono text-sm">Authorization:</span>
            <code className="font-mono text-slate-300 text-sm">Bearer supersecrettoken123</code>
          </div>
        </motion.div>

        <div className="flex flex-col gap-8">
          {endpoints.map((ep, i) => (
            <motion.div key={ep.path} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.1}} className="glass rounded-2xl p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-lg font-mono font-bold text-xs"
                  style={{background:`${ep.color}20`,color:ep.color,border:`1px solid ${ep.color}40`}}>
                  {ep.method}
                </span>
                <code className="font-mono text-white text-sm">{ep.path}</code>
              </div>
              <p className="text-slate-400 text-sm">{ep.desc}</p>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-2">Request</p>
                <p className="text-sm text-slate-300 font-mono bg-white/5 rounded-lg px-3 py-2">{ep.request}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-2">Response</p>
                <CodeBlock code={ep.response}/>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-2">Example (curl)</p>
                <CodeBlock code={ep.curl}/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
