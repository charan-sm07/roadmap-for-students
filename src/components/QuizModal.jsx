import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Trophy, Loader2 } from 'lucide-react';
import { generateTopicQuiz } from '../services/api';
import useRoadmapStore from '../store/useRoadmapStore';

export default function QuizModal({ isOpen, onClose, topicName, goal }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addPoints } = useRoadmapStore();

  useEffect(() => {
    if (isOpen && topicName) {
      loadQuiz();
    } else {
      reset();
    }
  }, [isOpen, topicName]);

  const loadQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = await generateTopicQuiz(topicName, goal);
      setQuestions(q);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsEvaluating(false);
    setScore(0);
    setIsFinished(false);
  };

  const handleSelect = (index) => {
    if (isEvaluating) return;
    setSelectedAnswer(index);
    setIsEvaluating(true);

    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setIsEvaluating(false);
    } else {
      setIsFinished(true);
      // Reward points
      const pointsEarned = score * 10 + (score === questions.length ? 50 : 0); // 10 per correct, 50 bonus for perfect
      addPoints(pointsEarned);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-card rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-200/50 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <Trophy className="mr-2 text-yellow-500" size={20} />
            Knowledge Check: {topicName}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/50">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
               <Loader2 className="animate-spin mb-4" size={32} />
               <p>AI is generating custom questions...</p>
             </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button className="btn-primary" onClick={loadQuiz}>Try Again</button>
            </div>
          ) : isFinished ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
              <div className="w-24 h-24 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center mb-6">
                <Trophy size={48} className="text-yellow-500" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quiz Complete!</h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                You scored <span className="font-bold text-primary-600">{score}</span> out of {questions.length}
              </p>
              
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto mb-8 shadow-sm">
                <p className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-2">Rewards Earned</p>
                <div className="flex justify-between items-center text-lg font-semibold">
                   <span className="text-slate-700 dark:text-slate-200">Points</span>
                   <span className="text-yellow-500">+{score * 10 + (score === questions.length ? 50 : 0)} XP</span>
                </div>
                {score === questions.length && (
                   <div className="mt-2 text-xs text-green-500 bg-green-50 dark:bg-green-500/10 p-2 rounded">
                     Perfect Score Bonus! (+50)
                   </div>
                )}
              </div>

              <button className="btn-primary" onClick={onClose}>Continue Learning</button>
            </motion.div>
          ) : questions.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-6">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>

                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
                  {questions[currentIndex].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentIndex].options.map((opt, i) => {
                    const isCorrect = i === questions[currentIndex].correctAnswerIndex;
                    const isSelected = selectedAnswer === i;
                    
                    let bgClass = "bg-white dark:bg-slate-800 hover:border-primary-400";
                    let borderClass = "border-slate-200 dark:border-slate-700";
                    let icon = null;

                    if (isEvaluating) {
                      if (isCorrect) {
                        bgClass = "bg-green-50 dark:bg-green-900/20";
                        borderClass = "border-green-500";
                        icon = <CheckCircle className="text-green-500" size={20} />;
                      } else if (isSelected && !isCorrect) {
                        bgClass = "bg-red-50 dark:bg-red-900/20";
                        borderClass = "border-red-500";
                        icon = <XCircle className="text-red-500" size={20} />;
                      }
                    } else if (isSelected) {
                       borderClass = "border-primary-500";
                    }

                    return (
                      <button 
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={isEvaluating}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${bgClass} ${borderClass}`}
                      >
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{opt}</span>
                        {icon}
                      </button>
                    )
                  })}
                </div>

                {isEvaluating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Explanation</p>
                    <p className="text-slate-700 dark:text-slate-300">
                      {questions[currentIndex].explanation}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {isEvaluating && !isFinished && (
           <div className="p-4 border-t border-slate-200/50 dark:border-slate-800 flex justify-end bg-white dark:bg-slate-900">
             <button className="btn-primary px-8" onClick={nextQuestion}>
               {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
             </button>
           </div>
        )}
      </motion.div>
    </div>
  );
}
