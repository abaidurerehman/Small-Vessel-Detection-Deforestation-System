import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { label: 'Home',                    path: '/' },
  { label: 'Deforestation Detection', path: '/deforestation' },
  { label: 'Vessel Detection',        path: '/vessel-detection' },
  { label: 'API Docs',                path: '/api-docs' },
  { label: 'Privacy Policy',          path: '/privacy' },
  { label: 'Terms of Service',        path: '/terms' },
  { label: 'Cookie Policy',           path: '/cookies' },
];

const navLinks = [
  { label: 'Home',             path: '/' },
  { label: 'Deforestation',    path: '/deforestation' },
  { label: 'Vessel Detection', path: '/vessel-detection' },
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.94, y: -10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.045, delayChildren: 0.06 },
  },
  exit: { opacity: 0, scale: 0.94, y: -10, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22 } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => { setMenuOpen(false); setDropOpen(false); }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleMenuClick = (path) => {
    setDropOpen(false);
    setMenuOpen(false);
    // Scroll to top then navigate
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(240,253,244,0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(34,197,94,0.15)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(34,197,94,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => handleMenuClick('/')} className="flex items-center gap-2 group">
          <img src="/images/Logo.png" alt="Logo"
            className="w-10 h-10 rounded-xl object-cover transition-transform group-hover:scale-105"
            style={{ background: '#000' }} />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-sm text-slate-800 tracking-tight">Small Vessel Detection</span>
            <span className="font-display text-xs text-green-600 tracking-tight">& Deforestation System</span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <button key={link.path} onClick={() => handleMenuClick(link.path)}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: active ? '#1e293b' : '#64748b', background: active ? 'rgba(34,197,94,0.1)' : 'transparent' }}>
                  {active && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.div>
              </button>
            );
          })}

          {/* Try Free */}
          <motion.button onClick={() => handleMenuClick('/deforestation')}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-black"
            style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}>
            Try Free
          </motion.button>

          {/* Hamburger dropdown */}
          <div className="relative ml-2" ref={dropRef}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setDropOpen(v => !v)}
              className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all"
              style={{
                background: dropOpen ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.07)',
                border: dropOpen ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(34,197,94,0.2)',
              }}
            >
              {[0,1,2].map(i => (
                <motion.span key={i}
                  animate={{
                    rotate:  dropOpen && i===0 ? 45 : dropOpen && i===2 ? -45 : 0,
                    y:       dropOpen && i===0 ? 9  : dropOpen && i===2 ? -9  : 0,
                    opacity: dropOpen && i===1 ? 0 : 1,
                    width:   dropOpen ? '18px' : i===1 ? '11px' : '18px',
                  }}
                  transition={{ duration: 0.25, ease: [0.22,1,0.36,1] }}
                  className="block h-[2px] rounded-full origin-center"
                  style={{ background: dropOpen ? '#16a34a' : '#475569' }}
                />
              ))}
            </motion.button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden" animate="visible" exit="exit"
                  className="absolute right-0 top-[52px] w-60 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: 'rgba(248,254,250,0.98)',
                    border: '1px solid rgba(34,197,94,0.18)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 8px 40px rgba(34,197,94,0.12)',
                  }}
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-[10px] font-mono text-slate-400 uppercase tracking-[0.15em]">Menu</p>
                    {menuItems.map((item) => {
                      const active = location.pathname === item.path;
                      return (
                        <motion.button
                          key={item.path}
                          variants={itemVariants}
                          onClick={() => handleMenuClick(item.path)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left"
                          style={{
                            color: active ? '#16a34a' : '#475569',
                            background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
                          }}
                          onMouseEnter={e => {
                            if (!active) { e.currentTarget.style.background='rgba(34,197,94,0.07)'; e.currentTarget.style.color='#1e293b'; }
                          }}
                          onMouseLeave={e => {
                            if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#475569'; }
                          }}
                        >
                          <span>{item.label}</span>
                          {active && (
                            <motion.span layoutId="drop-dot"
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: '#16a34a' }}
                              transition={{ type:'spring', bounce:0.3 }} />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="px-3 pb-3 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=abaidurerehman1001@gmail.com"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-slate-500 hover:text-green-400 transition-colors font-mono group pt-2"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="group-hover:stroke-green-400 transition-colors shrink-0">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      abaidurerehman1001@gmail.com
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(v => !v)}>
          {[0,1,2].map(i => (
            <motion.span key={i}
              animate={{ rotate: menuOpen&&i===0?45:menuOpen&&i===2?-45:0,
                         y: menuOpen&&i===0?8:menuOpen&&i===2?-8:0,
                         opacity: menuOpen&&i===1?0:1 }}
              className="block h-0.5 w-5 bg-white rounded-full origin-center" />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }} transition={{ duration:0.3 }}
            className="md:hidden mt-4 overflow-hidden">
            <div className="glass rounded-xl p-3 flex flex-col gap-1">
              {menuItems.map((item, i) => (
                <motion.button key={item.path}
                  initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i*0.05 }}
                  onClick={() => handleMenuClick(item.path)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-left w-full"
                  style={{ color: location.pathname===item.path ? '#16a34a' : '#475569',
                           background: location.pathname===item.path ? 'rgba(34,197,94,0.08)' : 'transparent' }}>
                  {item.label}
                </motion.button>
              ))}
              <div className="px-4 py-2 mt-1" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abaidurerehman1001@gmail.com"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-green-400 transition-colors font-mono group">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-green-400 transition-colors">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  abaidurerehman1001@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
