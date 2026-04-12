import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PageLoader from './components/PageLoader.jsx';

const Home           = lazy(() => import('./pages/Home.jsx'));
const Deforestation  = lazy(() => import('./pages/Deforestation.jsx'));
const VesselDetection= lazy(() => import('./pages/VesselDetection.jsx'));
const ApiDocs        = lazy(() => import('./pages/ApiDocs.jsx'));
const Legal          = lazy(() => import('./pages/Legal.jsx'));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{ background: '#050810' }}>
        <Toaster position="top-right" toastOptions={{
          style: { background:'#111827', color:'#e2e8f0',
                   border:'1px solid rgba(255,255,255,0.1)', fontFamily:"'DM Sans', sans-serif" },
        }}/>
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/"                element={<Home />} />
                <Route path="/deforestation"   element={<Deforestation />} />
                <Route path="/vessel-detection"element={<VesselDetection />} />
                <Route path="/api-docs"        element={<ApiDocs />} />
                <Route path="/privacy"         element={<Legal />} />
                <Route path="/terms"           element={<Legal />} />
                <Route path="/cookies"         element={<Legal />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
