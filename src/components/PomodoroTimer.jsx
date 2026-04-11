import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Maximize2, Minimize2, X } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';

export default function PomodoroTimer() {
  const { addFocusTime } = useRoadmapStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 25 mins by default
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, break
  
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (mode === 'focus') {
        // Just finished a focus session (25 mins = 25 focus mins)
        // Hardcoding to add 25 mins. In a real app we might track exact elapsed time.
        addFocusTime(25);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
        setMode('break');
        setTimeLeft(5 * 60); // 5 min break
      } else {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, addFocusTime]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') {
      setTimeLeft(25 * 60);
    } else {
      setTimeLeft(5 * 60);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <Clock size={24} />
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ${isMinimized ? 'w-64 h-16' : 'w-80'}`}
      >
        {isMinimized ? (
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${mode === 'focus' ? 'bg-primary-500' : 'bg-green-500'} ${isActive ? 'animate-pulse' : ''}`} />
              <span className="font-mono font-bold text-xl dark:text-white">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={toggleTimer} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                {isActive ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={() => setIsMinimized(false)} className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-primary-500" /> Pomodoro
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Minimize2 size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-sm">
              <button 
                onClick={() => switchMode('focus')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${mode === 'focus' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
              >
                Focus
              </button>
              <button 
                onClick={() => switchMode('break')}
                className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${mode === 'break' ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400' : 'text-slate-500'}`}
              >
                Break
              </button>
            </div>

            <div className="text-center mb-8">
              <div className="text-6xl font-mono font-extrabold text-slate-900 dark:text-white tracking-tight">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={resetTimer}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={toggleTimer}
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white transition-all transform hover:scale-105 shadow-lg ${isActive ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' : (mode === 'focus' ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-600/30' : 'bg-green-600 hover:bg-green-700 shadow-green-600/30')}`}
              >
                {isActive ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
