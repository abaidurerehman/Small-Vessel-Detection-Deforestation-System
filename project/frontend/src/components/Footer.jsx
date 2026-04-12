import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const articles = [
  {
    title: 'Satellite Imagery Is Helping Governments To Combat Deforestation',
    date: 'Mar 2025',
    url: 'https://www.weforum.org/stories/2018/07/satellite-tech-offers-near-real-time-view-of-deforestation-researchers/',
  },
  {
    title: 'Deep Learning for Ship Detection in SAR Images',
    date: 'Feb 2025',
    url: 'https://www.mdpi.com/2072-4292/11/21/2547',
  },
  {
    title: 'YOLOv8 for Object Detection in Satellite Imagery',
    date: 'Jan 2025',
    url: 'https://docs.ultralytics.com/models/yolov8/',
  },
  {
    title: 'Remote Sensing for Environmental Monitoring',
    date: 'Dec 2024',
    url: 'https://www.sciencedirect.com/topics/earth-and-planetary-sciences/remote-sensing',
  },
];

const socials = [
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/abaidur-e-rehman-03748a272',
    icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/abaidurerehman',
    icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
  },
  { 
    label: 'Gmail',
    url: 'https://mail.google.com/mail/?view=cm&fs=1&to=abaidurerehman1001@gmail.com',
    icon: 'M4 4h16v16H4V4zm2 2v.511l6 4.5 6-4.5V6H6zm12 3.489l-6 4.5-6-4.5V18h12V9.489z',

  },
];

const platformLinks = [
  { label: 'Home',                    path: '/' },
  { label: 'Deforestation Detection', path: '/deforestation' },
  { label: 'Vessel Detection',        path: '/vessel-detection' },
  { label: 'API Docs',                path: '/api-docs' },
];

const legalLinks = [
  { label: 'Privacy Policy',   path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Cookie Policy',    path: '/cookies' },
];

function NavBtn({ label, path, navigate }) {
  return (
    <li>
      <button
        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate(path); }}
        className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1.5 group text-left"
      >
        <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-green-400 transition-colors shrink-0"/>
        {label}
      </button>
    </li>
  );
}

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{ background: '#030508', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <button onClick={() => { window.scrollTo({top:0,behavior:'smooth'}); navigate('/'); }}
              className="flex items-center gap-2 mb-5 group">
              <img src="/images/Logo.png" alt="Logo"
                className="w-10 h-10 rounded-xl object-cover transition-transform group-hover:scale-105"
                style={{ background: '#000' }} />
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-sm text-white">Small Vessel Detection</span>
                <span className="font-display text-xs text-green-400">& Deforestation System</span>
              </div>
            </button>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              AI-powered satellite intelligence for environmental monitoring and maritime security.
              Built at UET Lahore, Narowal Campus.
            </p>
            <div className="flex gap-3 mb-4">
              {socials.map(({ label, url, icon }) => (
                <motion.a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, color: '#4ade80' }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                </motion.a>
              ))}
            </div>

          </div>

          {/* Latest Articles */}
          <div className="md:col-span-1">
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Latest Articles</h4>
            <ul className="space-y-4">
              {articles.map(({ title, date, url }) => (
                <li key={title}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
                    <span className="text-sm text-slate-400 group-hover:text-green-400 transition-colors leading-snug block mb-1">{title}</span>
                    <span className="text-xs text-slate-600 font-mono">{date}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map(l => <NavBtn key={l.path} {...l} navigate={navigate}/>)}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3 mb-8">
              {legalLinks.map(l => <NavBtn key={l.path} {...l} navigate={navigate}/>)}
            </ul>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=abaidurerehman1001@gmail.com"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-green-400 transition-colors group">
                  <svg className="mt-0.5 shrink-0 group-hover:stroke-green-400 transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  abaidurerehman1001@gmail.com
                </a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=UET+Lahore+Narowal+Campus"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-green-400 transition-colors">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  UET Lahore, Narowal Campus
                </a>
              </li>
              <li>
                <a href="https://github.com/abaidurerehman" target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-green-400 transition-colors">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                  </svg>
                  github.com/abaidurerehman
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-slate-600">
            © 2025 Small Vessel Detection & Deforestation System — UET Lahore, Narowal Campus
          </p>
          <div className="flex gap-6 text-xs text-slate-600">
            {legalLinks.map(({ label, path }) => (
              <button key={label}
                onClick={() => { window.scrollTo({top:0,behavior:'smooth'}); navigate(path); }}
                className="hover:text-slate-400 transition-colors">
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
