import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader.jsx';
import SpinnerOverlay from '../components/SpinnerOverlay.jsx';
import { predictDeforestation } from '../utils/api';
import DownloadPdfButton from '../components/DownloadPdfButton.jsx';

const ACCENT = '#4ade80';

function Slider({ label, value, onChange, min=0.01, max=1, step=0.01, leftLabel, rightLabel }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">{label}</span>
        <span className="text-xs font-mono text-green-400 font-semibold">{value.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{accentColor:ACCENT}}/>
      {leftLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-600 font-mono">
          <span>{leftLabel}</span><span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}

function SummaryBlock({ text }) {
  if (!text) return null;
  return (
    <div className="rounded-xl p-4 text-sm leading-relaxed"
      style={{background:'rgba(34,197,94,0.07)',border:'1px solid rgba(34,197,94,0.18)'}}>
      {text.split('\n').map((line,i) => {
        if (line.startsWith('**')&&line.endsWith('**'))
          return <p key={i} className="font-semibold text-white mb-1">{line.replace(/\*\*/g,'')}</p>;
        if (line.startsWith('- '))
          return <p key={i} className="text-slate-300 ml-3">• {line.slice(2)}</p>;
        if (line.trim()==='') return <div key={i} className="h-1"/>;
        return <p key={i} className="text-slate-300">{line.replace(/\*\*/g,'')}</p>;
      })}
    </div>
  );
}

export default function Deforestation() {
  const [file,setFile]         = useState(null);
  const [loading,setLoading]   = useState(false);
  const [result,setResult]     = useState(null);
  const [progress,setProgress] = useState(0);
  const [conf,setConf]         = useState(0.25);
  const [iou,setIou]           = useState(0.45);
  const [lightbox,setLightbox] = useState(null);

  const handleFile = useCallback((f)=>{ setFile(f); setResult(null); },[]);

  const handleDetect = async () => {
    if (!file){ toast.error('Please upload an image first.'); return; }
    setLoading(true); setProgress(0);
    try {
      const data = await predictDeforestation(file, conf, iou, setProgress);
      setResult(data);
      toast.success(`Analysis complete — ${data.total_detections} detection${data.total_detections!==1?'s':''}`);
    } catch(err){ toast.error(err.message||'Analysis failed.'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.4}}
      className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(34,197,94,0.08) 0%, transparent 60%)'}}/>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background:'rgba(0,0,0,0.9)'}} onClick={()=>setLightbox(null)}>
            <motion.img initial={{scale:0.8}} animate={{scale:1}} exit={{scale:0.8}}
              src={lightbox} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain"
              onClick={e=>e.stopPropagation()}/>
            <button onClick={()=>setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
              style={{background:'rgba(255,255,255,0.1)'}}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-mono tracking-widest uppercase"
            style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',color:ACCENT}}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
            Deforestationmodel — {result?(result.simulation?'Simulation':'Live YOLO'):'Ready'}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-4">
            🌳 Deforestation <span className="text-gradient-forest">Detection</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            YOLOv8-based Satellite Imagery Analysis — detect and classify deforestation indicators.
          </p>
        </motion.div>

        {/* Sample Images Gallery */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className="glass rounded-2xl p-6 mb-8">
          <h3 className="font-display font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-green-400">📷</span> Model Training Overview
            <span className="text-xs text-slate-500 font-normal ml-2">— click to enlarge</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">Sample images, dataset split, and training results from the Deforestationmodel.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {src:'/images/sample_deforestation.PNG',label:'Sample Detections'},
              {src:'/images/training_result_deforestation_model.PNG',label:'Training Results'},
              {src:'/images/confusion_metrix_deforestation_model.PNG',label:'Confusion Matrix'},
              {src:'/images/deforestation_dataset_split.PNG',label:'Dataset Split'},
            ].map(({src,label})=>(
              <motion.div key={src} whileHover={{scale:1.03}} className="cursor-pointer rounded-xl overflow-hidden"
                style={{border:'1px solid rgba(34,197,94,0.2)'}} onClick={()=>setLightbox(src)}>
                <img src={src} alt={label} className="w-full object-cover" style={{height:100}}/>
                <div className="px-2 py-1.5" style={{background:'rgba(34,197,94,0.08)'}}>
                  <p className="text-xs text-slate-400 font-mono truncate">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload */}
          <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{delay:0.15}}
            className="glass rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{background:'rgba(34,197,94,0.2)'}}>1</span>
              Upload Satellite Image
            </h2>
            <div className="relative">
              <ImageUploader onFileSelected={handleFile} accentColor={ACCENT} label="Drop satellite / aerial image"/>
              <AnimatePresence>{loading&&<SpinnerOverlay message="Running YOLO Inference…" accentColor={ACCENT}/>}</AnimatePresence>
            </div>
            <div className="rounded-xl p-4 flex flex-col gap-4"
              style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-mono">⚡ Inference Settings</p>
              <Slider label="Confidence Threshold" value={conf} onChange={setConf} leftLabel="0.01 (detect all)" rightLabel="1.00 (strict)"/>
              <Slider label="IoU Threshold" value={iou} onChange={setIou} leftLabel="0.01" rightLabel="1.00"/>
            </div>
            <motion.button onClick={handleDetect} disabled={!file||loading}
              whileHover={file&&!loading?{scale:1.02,boxShadow:'0 0 30px rgba(34,197,94,0.35)'}:{}}
              whileTap={file&&!loading?{scale:0.98}:{}}
              className="w-full py-4 rounded-xl font-display font-semibold text-base transition-all"
              style={{background:file&&!loading?'linear-gradient(135deg,#4ade80,#22c55e)':'rgba(255,255,255,0.05)',
                      color:file&&!loading?'#000':'#475569',cursor:file&&!loading?'pointer':'not-allowed'}}>
              {loading?`Uploading ${progress}%…`:'🔍 Detect Deforestation'}
            </motion.button>
          </motion.div>

          {/* Results */}
          <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
            className="glass rounded-2xl p-6 flex flex-col">
            <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{background:'rgba(34,197,94,0.2)'}}>2</span>
              Detection Results
            </h2>
            <AnimatePresence mode="wait">
              {!result&&!loading&&(
                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{background:'rgba(255,255,255,0.04)'}}>🌿</div>
                  <p className="text-slate-500 text-sm">Upload an image and click Detect</p>
                </motion.div>
              )}
              {result&&(
                <motion.div key="result" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                  className="flex flex-col gap-5 overflow-y-auto" style={{maxHeight:'72vh'}}>
                  {result.simulation&&(
                    <div className="px-4 py-3 rounded-xl flex items-start gap-2"
                      style={{background:'rgba(234,179,8,0.1)',border:'1px solid rgba(234,179,8,0.25)'}}>
                      <span className="text-yellow-400">⚠️</span>
                      <p className="text-xs text-yellow-300">Simulation — place <code className="font-mono bg-yellow-400/10 px-1 rounded">Deforestationmodel.pt</code> in <code className="font-mono bg-yellow-400/10 px-1 rounded">./models/</code> and restart.</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-4 text-center" style={{background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)'}}>
                      <p className="font-mono font-bold text-3xl text-green-400">{result.total_detections}</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Total Detections</p>
                    </div>
                    <div className="rounded-xl p-4 text-center" style={{background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.15)'}}>
                      <p className="font-mono font-bold text-3xl text-green-400">{result.average_confidence_percent}</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">⚡ Avg Confidence</p>
                    </div>
                  </div>
                  {result.annotated_image&&(
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-2">Detection Results</p>
                      <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="Annotated"
                        className="w-full object-contain rounded-xl cursor-zoom-in"
                        style={{maxHeight:300,background:'#000'}}
                        onClick={()=>setLightbox(`data:image/jpeg;base64,${result.annotated_image}`)}/>
                    </div>
                  )}
                  {result.summary&&(
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-2">Detection Summary</p>
                      <SummaryBlock text={result.summary}/>
                    </div>
                  )}
                  {/* PDF Download */}
                  <DownloadPdfButton type="deforestation" result={result} accentColor={ACCENT}/>

                  <div className="flex justify-between text-xs font-mono text-slate-600 pt-2"
                    style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                    <span>{result.model_version}</span>
                    <span>{result.image_size?.width}×{result.image_size?.height}px</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
