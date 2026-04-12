import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader.jsx';
import SpinnerOverlay from '../components/SpinnerOverlay.jsx';
import { predictVessel } from '../utils/api';
import DownloadPdfButton from '../components/DownloadPdfButton.jsx';

const ACCENT = '#38bdf8';

function MarkdownTable({ text }) {
  if (!text) return null;
  const lines = text.split('\n').filter(Boolean);
  const header = [], rows = [], other = [];
  let inTable = false;
  lines.forEach(line => {
    if (line.startsWith('|') && line.includes('Class')) { inTable=true; header.push(...line.split('|').filter(c=>c.trim())); }
    else if (line.startsWith('|---')) {}
    else if (line.startsWith('|') && inTable) rows.push(line.split('|').filter(c=>c.trim()));
    else { inTable=false; other.push(line); }
  });
  return (
    <div className="flex flex-col gap-3">
      {other.map((line,i) => {
        const clean = line.replace(/\*\*/g,'').replace(/\*/g,'');
        return line.includes('**')
          ? <p key={i} className="font-semibold text-white text-base">{clean}</p>
          : <p key={i} className="text-slate-400 text-sm italic">{clean}</p>;
      })}
      {rows.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{border:'1px solid rgba(255,255,255,0.08)'}}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{background:'rgba(14,165,233,0.15)'}}>
                {header.map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap">{h.trim()}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((row,i)=>(
                <motion.tr key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  style={{background:i%2===0?'rgba(255,255,255,0.02)':'transparent',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
                  {row.map((cell,j)=>(
                    <td key={j} className="px-4 py-2.5 font-mono text-xs"
                      style={{color:j===0?'#64748b':j===2?ACCENT:j===3?'#94a3b8':'#f1f5f9'}}>
                      {cell.trim()}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function VesselDetection() {
  const [file,setFile]         = useState(null);
  const [loading,setLoading]   = useState(false);
  const [result,setResult]     = useState(null);
  const [progress,setProgress] = useState(0);
  const [conf,setConf]         = useState(0.25);
  const [lightbox,setLightbox] = useState(null);

  const handleFile = useCallback((f)=>{ setFile(f); setResult(null); },[]);

  const handleDetect = async () => {
    if (!file){ toast.error('Please upload an image first.'); return; }
    setLoading(true); setProgress(0);
    try {
      const data = await predictVessel(file, conf, 0.45, setProgress);
      setResult(data);
      toast.success(data.vessel_count>0 ? `${data.vessel_count} vessel${data.vessel_count!==1?'s':''} detected!` : 'No vessels detected — try lower confidence.');
    } catch(err){ toast.error(err.message||'Detection failed.'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.4}}
      className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 70% 50% at 70% 20%, rgba(14,165,233,0.08) 0%, transparent 60%)'}}/>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
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
            style={{background:'rgba(14,165,233,0.1)',border:'1px solid rgba(14,165,233,0.2)',color:ACCENT}}>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"/>
            Vesselmodel — {result?(result.simulation?'Simulation':'Live YOLO'):'Ready'}
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-4">
            🚢 Small Vessel <span className="text-gradient-ocean">Detection</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            YOLOv8-based detection of small vessels in satellite imagery. Upload a dark SAR/optical satellite image for best results.
          </p>
        </motion.div>

        {/* Sample Images Gallery */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className="glass rounded-2xl p-6 mb-8">
          <h3 className="font-display font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-sky-400">📷</span> Sample Training Images
            <span className="text-xs text-slate-500 font-normal ml-2">— click to enlarge</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">The model was trained on dark SAR satellite imagery. Upload similar images for best detection results.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {src:'/images/sample_vessel.PNG', label:'Sample Vessel Annotations'},
              {src:'/images/vessel_training_result.png', label:'Training Results'},
            ].map(({src,label})=>(
              <motion.div key={src} whileHover={{scale:1.02}} className="cursor-pointer rounded-xl overflow-hidden"
                style={{border:'1px solid rgba(14,165,233,0.2)'}} onClick={()=>setLightbox(src)}>
                <img src={src} alt={label} className="w-full object-cover" style={{maxHeight:200}}/>
                <div className="px-3 py-2" style={{background:'rgba(14,165,233,0.08)'}}>
                  <p className="text-xs text-slate-400 font-mono">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload + Controls */}
          <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{delay:0.15}}
            className="glass rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{background:'rgba(14,165,233,0.2)'}}>1</span>
              Upload Satellite Image
            </h2>
            <div className="relative">
              <ImageUploader onFileSelected={handleFile} accentColor={ACCENT} label="Drop dark SAR/satellite image"/>
              <AnimatePresence>{loading && <SpinnerOverlay message="Running YOLO Inference…" accentColor={ACCENT}/>}</AnimatePresence>
            </div>

            {/* Tip box */}
            <div className="rounded-xl px-4 py-3 flex items-start gap-2"
              style={{background:'rgba(14,165,233,0.07)',border:'1px solid rgba(14,165,233,0.15)'}}>
              <span className="text-sky-400 shrink-0">💡</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                This model detects small vessels in <strong className="text-white">dark SAR satellite images</strong>.
                If no detections appear, lower the confidence threshold to <strong className="text-sky-400">0.05–0.10</strong>.
              </p>
            </div>

            {/* Confidence slider */}
            <div className="rounded-xl p-4" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">Confidence Threshold</span>
                <span className="text-xs font-mono text-sky-400 font-semibold">{conf.toFixed(2)}</span>
              </div>
              <input type="range" min="0.01" max="1" step="0.01" value={conf}
                onChange={e=>setConf(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer" style={{accentColor:ACCENT}}/>
              <div className="flex justify-between mt-1 text-xs text-slate-600 font-mono">
                <span>0.01 (detect all)</span><span>1.00 (very strict)</span>
              </div>
            </div>

            {result && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{background:'rgba(14,165,233,0.08)',border:'1px solid rgba(14,165,233,0.2)'}}>
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">Inference Time</p>
                  <p className="font-mono font-bold text-sky-400 text-lg">{result.inference_time_str}</p>
                </div>
              </motion.div>
            )}

            <motion.button onClick={handleDetect} disabled={!file||loading}
              whileHover={file&&!loading?{scale:1.02,boxShadow:'0 0 30px rgba(14,165,233,0.35)'}:{}}
              whileTap={file&&!loading?{scale:0.98}:{}}
              className="w-full py-4 rounded-xl font-display font-semibold text-base transition-all"
              style={{background:file&&!loading?'linear-gradient(135deg,#38bdf8,#0ea5e9)':'rgba(255,255,255,0.05)',
                      color:file&&!loading?'#000':'#475569',cursor:file&&!loading?'pointer':'not-allowed'}}>
              {loading?`Uploading ${progress}%…`:'🚀 Detect Vessels'}
            </motion.button>
          </motion.div>

          {/* Results */}
          <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
            className="glass rounded-2xl p-6 flex flex-col">
            <h2 className="font-display font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{background:'rgba(14,165,233,0.2)'}}>2</span>
              Detection Results
            </h2>
            <AnimatePresence mode="wait">
              {!result&&!loading&&(
                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                    style={{background:'rgba(255,255,255,0.04)'}}>🛥️</div>
                  <p className="text-slate-500 text-sm">Upload a satellite image and click Detect Vessels</p>
                </motion.div>
              )}
              {result&&(
                <motion.div key="result" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                  className="flex flex-col gap-5 overflow-y-auto" style={{maxHeight:'72vh'}}>
                  {result.simulation&&(
                    <div className="px-4 py-3 rounded-xl flex items-start gap-2"
                      style={{background:'rgba(234,179,8,0.1)',border:'1px solid rgba(234,179,8,0.25)'}}>
                      <span className="text-yellow-400 text-lg">⚠️</span>
                      <p className="text-xs text-yellow-300 leading-relaxed">
                        Simulation — place <code className="font-mono bg-yellow-400/10 px-1 rounded">Vesselmodel.pt</code> in <code className="font-mono bg-yellow-400/10 px-1 rounded">./models/</code> and restart.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-4 text-center" style={{background:'rgba(56,189,248,0.1)',border:'1px solid rgba(56,189,248,0.2)'}}>
                      <p className="font-mono font-bold text-3xl text-sky-400">{result.vessel_count}</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Detections Found</p>
                    </div>
                    <div className="rounded-xl p-4 text-center" style={{background:'rgba(56,189,248,0.06)',border:'1px solid rgba(56,189,248,0.15)'}}>
                      <p className="font-mono font-bold text-3xl text-sky-400">{result.average_confidence_percent}</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">⚡ Avg Confidence</p>
                    </div>
                  </div>
                  {result.annotated_image&&(
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-2">Detection Results</p>
                      <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="Annotated"
                        className="w-full object-contain rounded-xl cursor-zoom-in"
                        style={{maxHeight:320,background:'#000'}}
                        onClick={()=>setLightbox(`data:image/jpeg;base64,${result.annotated_image}`)}/>
                    </div>
                  )}
                  {result.results_text&&(
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-mono mb-3">Detection Details</p>
                      <MarkdownTable text={result.results_text}/>
                    </div>
                  )}
                  {/* PDF Download */}
                  <DownloadPdfButton type="vessel" result={result} accentColor={ACCENT}/>

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
