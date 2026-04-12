import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const content = {
  '/privacy': {
    title: 'Privacy Policy', emoji: '🔒',
    updated: 'April 2025',
    sections: [
      { heading: '1. Information We Collect', body: 'We collect only the images you upload for analysis. These images are processed in real-time and are not stored on our servers. We do not collect personal identification information unless you contact us directly.' },
      { heading: '2. How We Use Your Data', body: 'Uploaded images are sent to our AI inference microservices (Deforestationmodel, Vesselmodel) solely for the purpose of generating detection results. Results are returned to your browser and not retained.' },
      { heading: '3. Data Retention', body: 'No image data is stored after your session ends. All inference happens in-memory and results are discarded immediately after being returned to the client.' },
      { heading: '4. Third-Party Services', body: 'This platform uses no third-party analytics, advertising, or tracking services. All computation happens on our local infrastructure.' },
      { heading: '5. Security', body: 'API endpoints are protected by Bearer token authentication. We recommend deploying behind HTTPS in production environments.' },
      { heading: '6. Contact', body: 'For privacy concerns, contact us at contact@sentinelai.io or visit our GitHub: github.com/abaidurerehman' },
    ],
  },
  '/terms': {
    title: 'Terms of Service', emoji: '📋',
    updated: 'April 2025',
    sections: [
      { heading: '1. Acceptance', body: 'By using SentinelAI, you agree to these Terms of Service. If you do not agree, do not use the platform.' },
      { heading: '2. Permitted Use', body: 'This platform is intended for research, environmental monitoring, and maritime security purposes. You may use it to analyze satellite imagery for deforestation detection and vessel identification.' },
      { heading: '3. Prohibited Use', body: 'You may not use this platform for illegal surveillance, invasion of privacy, military targeting, or any activity that violates applicable laws. Do not upload images containing personally identifiable information.' },
      { heading: '4. Accuracy Disclaimer', body: 'AI predictions are probabilistic and may not be 100% accurate. Do not rely solely on model outputs for critical decisions without human verification.' },
      { heading: '5. Intellectual Property', body: 'The SentinelAI platform, logo, and trained models are the property of the development team at UET Lahore, Narowal Campus. Unauthorized reproduction is prohibited.' },
      { heading: '6. Limitation of Liability', body: 'The platform is provided "as is" without warranty. We are not liable for any damages arising from use or inability to use this service.' },
    ],
  },
  '/cookies': {
    title: 'Cookie Policy', emoji: '🍪',
    updated: 'April 2025',
    sections: [
      { heading: '1. Do We Use Cookies?', body: 'SentinelAI uses minimal cookies. We do not use advertising cookies, tracking cookies, or third-party analytics cookies of any kind.' },
      { heading: '2. Essential Cookies', body: 'We may use session-based cookies to maintain your authentication token during an active session. These expire when you close your browser.' },
      { heading: '3. Local Storage', body: 'Some UI preferences (such as confidence threshold settings) may be stored in your browser\'s local storage for convenience. This data never leaves your device.' },
      { heading: '4. Third-Party Cookies', body: 'We do not use any third-party cookies. No data is shared with advertising networks, social media platforms, or analytics providers.' },
      { heading: '5. Managing Cookies', body: 'You can clear cookies and local storage at any time through your browser settings. This will reset any saved preferences but will not affect platform functionality.' },
      { heading: '6. Updates', body: 'This cookie policy may be updated periodically. Continued use of the platform constitutes acceptance of any changes.' },
    ],
  },
};

export default function Legal() {
  const { pathname } = useLocation();
  const page = content[pathname] || content['/privacy'];

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="relative min-h-screen px-6 pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none" style={{background:'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(34,197,94,0.05) 0%, transparent 60%)'}}/>
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="mb-10">
          <p className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-widest">Legal</p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
            {page.emoji} {page.title}
          </h1>
          <p className="text-slate-500 text-sm font-mono">Last updated: {page.updated} · UET Lahore, Narowal Campus</p>
        </motion.div>
        <div className="flex flex-col gap-6">
          {page.sections.map((s, i) => (
            <motion.div key={i} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.07}} className="glass rounded-2xl p-6">
              <h3 className="font-display font-semibold text-white mb-3">{s.heading}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
