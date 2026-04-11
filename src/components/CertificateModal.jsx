import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Award } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import useRoadmapStore from '../store/useRoadmapStore';

export default function CertificateModal({ isOpen, onClose, roadmap }) {
  const { currentUser } = useRoadmapStore();
  const certRef = useRef(null);

  if (!isOpen || !roadmap) return null;

  const handleDownload = () => {
    const element = certRef.current;
    const opt = {
      margin: 0,
      filename: `${roadmap.goal.replace(/\s+/g, '-')}-Certificate.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const userName = currentUser?.name || 'Dedicated Learner';
  const dateCompleted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal Wrapper */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 border border-slate-200 dark:border-slate-800"
        >
          {/* Header Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <button 
              onClick={handleDownload}
              className="p-2 text-white bg-primary-600 hover:bg-primary-700 rounded-full transition-colors shadow-lg flex items-center gap-2 px-4"
            >
              <Download size={18} /> <span className="font-semibold text-sm hidden md:block">Download PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 bg-white hover:bg-slate-100 rounded-full shadow-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Certificate Container (Used for PDF Export) */}
          <div className="overflow-auto bg-slate-100 dark:bg-slate-950 p-4 md:p-8 flex justify-center w-full">
            <div 
              ref={certRef}
              className="relative bg-white w-full max-w-[800px] aspect-[1.414/1] shadow-xl overflow-hidden shrink-0"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' viewBox=\'0 0 800 600\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'grad1\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%23f8fafc;stop-opacity:1\' /%3E%3Cstop offset=\'100%25\' style=\'stop-color:%23f1f5f9;stop-opacity:1\' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23grad1)\' /%3E%3Cpath d=\'M0 0 L200 0 L0 200 Z\' fill=\'%23e0e7ff\' opacity=\'0.5\' /%3E%3Cpath d=\'M800 600 L600 600 L800 400 Z\' fill=\'%23f3e8ff\' opacity=\'0.5\' /%3E%3C/svg%3E")',
                backgroundSize: 'cover'
              }}
            >
              {/* Inner Border */}
              <div className="absolute inset-4 border-[12px] border-slate-900 opacity-10"></div>
              <div className="absolute inset-6 border-2 border-slate-900 opacity-20"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-slate-900">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 text-white flex items-center justify-center mb-6 shadow-lg">
                  <Award size={32} />
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight uppercase mb-4 opacity-90">
                  Certificate
                </h1>
                
                <p className="text-lg md:text-xl font-medium tracking-widest text-primary-600 uppercase mb-8">
                  Of Completion
                </p>

                <p className="text-sm md:text-base text-slate-500 mb-2 italic">This is to certify that</p>
                
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-8 pb-4 border-b-2 border-slate-200 inline-block px-12">
                  {userName}
                </h2>

                <p className="text-sm md:text-base text-slate-500 mb-2">has successfully completed the learning roadmap for</p>
                
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-12 max-w-lg mx-auto leading-snug">
                  {roadmap.goal}
                </h3>

                {/* Footer Signatures */}
                <div className="flex justify-between w-full max-w-lg mt-auto pt-8">
                  <div className="flex flex-col items-center">
                    <div className="h-0.5 w-32 bg-slate-300 mb-2"></div>
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Date</span>
                    <span className="text-sm font-serif mt-1">{dateCompleted}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="h-0.5 w-32 bg-slate-300 mb-2"></div>
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Issuer</span>
                    <span className="text-sm font-serif mt-1 italic font-semibold text-primary-700">PathAI Generator</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
