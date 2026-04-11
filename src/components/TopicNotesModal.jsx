import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FileText } from 'lucide-react';
import FlashcardsStudy from './FlashcardsStudy';

export default function TopicNotesModal({ isOpen, onClose, topicName, initialNote, onSave }) {
  const [note, setNote] = useState('');
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNote(initialNote || '');
    }
  }, [isOpen, initialNote]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Notes</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[200px] md:max-w-xs">{topicName}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-6 flex-grow">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Jot down your learnings, helpful links, or questions here..."
              className="w-full h-[300px] p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
            <button 
              onClick={() => setIsFlashcardsOpen(true)}
              className="px-5 py-2.5 rounded-xl font-semibold bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/80 mr-auto transition-colors"
            >
              Learn with Flashcards
            </button>
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm flex items-center gap-2 transition-colors"
            >
              <Save size={18} />
              Save Note
            </button>
          </div>
        </motion.div>
      </div>

      <FlashcardsStudy 
        isOpen={isFlashcardsOpen} 
        onClose={() => setIsFlashcardsOpen(false)} 
        topicName={topicName} 
        notes={note} 
      />
    </AnimatePresence>
  );
}
