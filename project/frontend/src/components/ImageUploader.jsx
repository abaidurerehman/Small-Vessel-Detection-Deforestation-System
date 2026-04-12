import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageUploader({ onFileSelected, accentColor = '#4ade80', label = 'Upload Image' }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.tiff'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName(null);
    onFileSelected(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="upload-zone relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group"
        style={{
          minHeight: 280,
          borderColor: isDragActive ? accentColor : undefined,
          background: isDragActive ? `${accentColor}08` : 'rgba(255,255,255,0.02)',
        }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
              style={{ minHeight: 280 }}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-2xl"
                style={{ maxHeight: 400 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm text-white/80 font-mono truncate max-w-xs">{fileName}</span>
                <button
                  onClick={clearImage}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: 'rgba(239,68,68,0.7)' }}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-16 px-8"
            >
              <motion.div
                animate={isDragActive ? { scale: 1.2, rotate: 15 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </motion.div>

              <div className="text-center">
                <p className="font-display font-semibold text-white mb-1">{label}</p>
                <p className="text-sm text-slate-500">
                  {isDragActive ? (
                    <span style={{ color: accentColor }}>Drop it here!</span>
                  ) : (
                    <>Drag & drop or <span style={{ color: accentColor }}>click to browse</span></>
                  )}
                </p>
                <p className="text-xs text-slate-600 mt-2">JPG, PNG, WEBP, TIFF — Max 20MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
