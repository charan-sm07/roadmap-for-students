import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Clock, Target, Code, Play, FileText, Briefcase, Layers, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { generateRoadmap } from '../lib/roadmapGenerator';
import useRoadmapStore from '../store/useRoadmapStore';

const loadingSteps = [
  "Analyzing your goal requirements...",
  "Evaluating skill level progression...",
  "Curating high-quality resources...",
  "Structuring phase milestones...",
  "Finalizing your masterplan..."
];

const popularGoals = ["Learn React", "Master Python", "Build a REST API", "Data Analytics Basics", "UI/UX Design", "Fullstack Web Development"];

export default function InputPage() {
  const navigate = useNavigate();
  const { addRoadmap } = useRoadmapStore();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    goal: '',
    skillLevel: '',
    timeCommitment: 10,
    learningStyle: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  // Loading sequence effect
  useEffect(() => {
    if (isGenerating && loadingStepIdx < loadingSteps.length - 1) {
      const timer = setTimeout(() => {
        setLoadingStepIdx(prev => prev + 1);
      }, 2500); // cycle text every 2.5s while waiting
      return () => clearTimeout(timer);
    }
  }, [isGenerating, loadingStepIdx]);

  const handleNext = () => {
    setError('');
    if (step === 1 && !formData.goal.trim()) {
      setError('Please enter a learning goal to continue.');
      return;
    }
    if (step === 2 && (!formData.skillLevel || !formData.learningStyle)) {
      setError('Please select both your skill level and preferred learning style.');
      return;
    }
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setError('');
    if (step > 1) setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.timeCommitment) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      // Use local mock generator since no API key is provided
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API processing delay
      const phases = generateRoadmap(formData.goal, formData.skillLevel, formData.timeCommitment, formData.learningStyle);
      
      const newRoadmap = {
        ...formData,
        phases
      };
      
      // Save to persistence store
      addRoadmap(newRoadmap);
      
      // Navigate to output
      navigate('/roadmap');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
      setIsGenerating(false);
      setLoadingStepIdx(0);
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (isGenerating) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-10 rounded-3xl text-center"
        >
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mx-auto w-16 h-16 mb-6 text-primary-500">
            <Sparkles size={64} />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Building Roadmap</h2>
          
          <div className="relative w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-primary-500"
              initial={{ width: "0%" }}
              animate={{ width: "95%" }}
              transition={{ duration: 15, ease: "circOut" }}
            />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingStepIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-slate-600 dark:text-slate-400 font-medium"
            >
              {loadingSteps[loadingStepIdx]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-xl w-full">
        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-8 px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative z-10 w-1/3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step === i ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : step > i ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                {step > i ? <CheckCircle2 size={20} /> : i}
              </div>
              <span className={`text-xs font-semibold ${step >= i ? 'text-primary-600' : 'text-slate-400'}`}>
                Step {i}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-1/6 right-1/6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0">
            <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${(step - 1) * 50}%` }} />
          </div>
        </div>

        <div className="glass-card p-8 md:p-10 rounded-3xl shadow-xl border-t-4 border-t-primary-500">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              <AlertCircle size={18} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">What is your Goal?</h2>
                  <p className="text-slate-600 dark:text-slate-400">Define the exact skill or technology you want to conquer.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Target size={18} className="text-primary-500" />
                    Learning Target
                  </label>
                  <input
                    type="text"
                    className="input-field py-4 text-lg border-2"
                    placeholder="e.g., Master React.js, Complete AWS Cert..."
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    autoFocus
                  />
                  
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Popular Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {popularGoals.map(sg => (
                        <button
                          key={sg}
                          onClick={() => setFormData({ ...formData, goal: sg })}
                          className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 hover:bg-primary-50 dark:bg-slate-800 dark:hover:bg-primary-900/30 text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400 transition-colors border border-transparent hover:border-primary-200 dark:hover:border-primary-700"
                        >
                          {sg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Personalize Your Path</h2>
                  <p className="text-slate-600 dark:text-slate-400">Tell us where you stand and how you like to learn.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Code size={18} className="text-purple-500" /> Current Skill Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'beginner', label: 'Beginner', desc: 'No prior knowledge', icon: <BookOpen size={20}/> },
                      { id: 'intermediate', label: 'Intermediate', desc: 'Some experience', icon: <Layers size={20}/> },
                      { id: 'advanced', label: 'Advanced', desc: 'Looking to master', icon: <Briefcase size={20}/> }
                    ].map(lvl => (
                      <div
                        key={lvl.id}
                        onClick={() => setFormData({ ...formData, skillLevel: lvl.id })}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center text-center transition-all ${
                          formData.skillLevel === lvl.id 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="mb-2">{lvl.icon}</div>
                        <div className="font-bold mb-1">{lvl.label}</div>
                        <div className="text-xs opacity-80">{lvl.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Target size={18} className="text-amber-500" /> Preferred Learning Style
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'video', label: 'Video Tutorials', icon: <Play size={18}/> },
                      { id: 'text', label: 'Reading/Docs', icon: <FileText size={18}/> },
                      { id: 'projects', label: 'Project-Based', icon: <Briefcase size={18}/> },
                      { id: 'mixed', label: 'Mixed Approach', icon: <Layers size={18}/> }
                    ].map(style => (
                      <div
                        key={style.id}
                        onClick={() => setFormData({ ...formData, learningStyle: style.id })}
                        className={`cursor-pointer rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${
                          formData.learningStyle === style.id 
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {style.icon}
                        <span className="font-semibold text-sm">{style.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Time Commitment</h2>
                  <p className="text-slate-600 dark:text-slate-400">How many hours can you dedicate per week?</p>
                </div>
                <div className="pt-8 pb-4 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-6">
                    <span>2 hrs/wk (Casual)</span>
                    <span>20 hrs/wk (Part-time)</span>
                    <span>40+ hrs/wk (Intense)</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="2"
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    value={formData.timeCommitment}
                    onChange={(e) => setFormData({ ...formData, timeCommitment: Number(e.target.value) })}
                  />
                  <div className="text-center mt-8">
                    <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                      {formData.timeCommitment}
                    </span>
                    <span className="text-xl font-bold text-slate-500 dark:text-slate-400 ml-2">hours / week</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button onClick={handlePrev} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold px-4 py-2 transition-colors">
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary rounded-xl px-6 py-3 ml-auto flex items-center gap-2 font-bold group">
                Next Step <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-primary rounded-xl px-8 py-3 ml-auto flex items-center gap-2 font-bold shadow-primary-500/30">
                <Sparkles size={20} /> Generate Roadmap
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
