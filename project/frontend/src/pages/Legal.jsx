import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const content = {
  '/privacy': {
    title: 'Privacy Policy',
    emoji: '🔒',
    updated: 'May 2026',
    color: '#16a34a',
    sections: [
      {
        heading: '1. Information We Collect',
        body:
          'We only process the satellite images uploaded for AI analysis. Images are analyzed in real-time and are not permanently stored on our servers.',
      },
      {
        heading: '2. AI Processing',
        body:
          'Uploaded images are securely processed by Vessel Detection and Deforestation Detection microservices solely for generating inference results.',
      },
      {
        heading: '3. Data Retention',
        body:
          'No uploaded image data is retained after inference is completed. All processing happens temporarily in memory.',
      },
      {
        heading: '4. Third-Party Services',
        body:
          'This platform does not use advertising trackers, analytics services, or third-party data-sharing systems.',
      },
      {
        heading: '5. Security',
        body:
          'API endpoints are protected with Bearer authentication and should be deployed behind HTTPS in production environments.',
      },
      {
        heading: '6. Contact',
        body:
          'For privacy concerns or data requests, contact the SentinelAI development team.',
      },
    ],
  },

  '/terms': {
    title: 'Terms of Service',
    emoji: '📋',
    updated: 'May 2026',
    color: '#0284c7',
    sections: [
      {
        heading: '1. Acceptance',
        body:
          'By using SentinelAI, you agree to comply with these Terms of Service.',
      },
      {
        heading: '2. Permitted Use',
        body:
          'This platform is intended for environmental monitoring, maritime analysis, and educational or research purposes.',
      },
      {
        heading: '3. Prohibited Use',
        body:
          'You may not use this platform for illegal surveillance, privacy invasion, or unlawful activities.',
      },
      {
        heading: '4. Accuracy Disclaimer',
        body:
          'AI detections are probabilistic and may not always be fully accurate. Human verification is recommended.',
      },
      {
        heading: '5. Intellectual Property',
        body:
          'All SentinelAI branding, UI components, and trained AI models remain the intellectual property of the development team.',
      },
      {
        heading: '6. Limitation of Liability',
        body:
          'SentinelAI is provided "as is" without warranties. The development team is not liable for damages arising from platform usage.',
      },
    ],
  },

  '/cookies': {
    title: 'Cookie Policy',
    emoji: '🍪',
    updated: 'May 2026',
    color: '#7c3aed',
    sections: [
      {
        heading: '1. Essential Cookies',
        body:
          'Minimal session cookies may be used for authentication and secure session handling.',
      },
      {
        heading: '2. No Advertising Cookies',
        body:
          'SentinelAI does not use advertising, tracking, or marketing cookies.',
      },
      {
        heading: '3. Local Storage',
        body:
          'UI preferences such as confidence threshold values may be saved locally inside your browser.',
      },
      {
        heading: '4. Third-Party Services',
        body:
          'No third-party analytics providers or advertising systems are integrated into the platform.',
      },
      {
        heading: '5. Managing Cookies',
        body:
          'You may clear cookies or browser local storage at any time through browser settings.',
      },
      {
        heading: '6. Updates',
        body:
          'This Cookie Policy may be updated periodically as platform functionality evolves.',
      },
    ],
  },
};

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

export default function Legal() {
  const { pathname } = useLocation();

  const page = content[pathname] || content['/privacy'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen px-6 pt-28 pb-20"
      style={{
        background:
          'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 45%, #eef2ff 100%)',
      }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-pattern opacity-40" />

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 20% 15%, ${page.color}12 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-mono tracking-widest uppercase"
            style={{
              background: `${page.color}12`,
              border: `1px solid ${page.color}25`,
              color: page.color,
            }}
          >
            Legal Documents
          </div>

          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight mb-5">
            <span>{page.emoji} </span>

            <span className="text-slate-800">{page.title}</span>
          </h1>

          <p className="text-slate-500 text-sm font-mono">
            Last updated: {page.updated} · SentinelAI Platform
          </p>
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {page.sections.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <motion.div
                whileHover={{
                  y: -4,
                  boxShadow: `0 16px 36px ${page.color}12`,
                }}
                className="glass rounded-3xl p-7 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{
                    background: `linear-gradient(90deg, ${page.color}, transparent)`,
                  }}
                />

                <h3 className="font-display font-semibold text-slate-800 mb-3 text-lg">
                  {s.heading}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </motion.div>
  );
}