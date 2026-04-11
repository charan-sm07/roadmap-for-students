import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Layers } from 'lucide-react';
import { generateFlashcards } from '../services/api';
import useRoadmapStore from '../store/useRoadmapStore';

export default function FlashcardsStudy({ isOpen, onClose, topicName, notes }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { saveFlashcards, flashcards } = useRoadmapStore();

  useEffect(() => {
    if (isOpen && topicName) {
      loadInitialCards();
    } else {
      reset();
    }
  }, [isOpen, topicName]);

  const loadInitialCards = async () => {
    // Check if we already generated flashcards for this topic
    const existing = flashcards?.find(f => f.topicName === topicName);
    if (existing && existing.cards.length > 0) {
      setCards(existing.cards);
    } else if (notes && notes.length > 10) {
      // Must generate new ones
      generateNewCards();
    } else {
      setError("Not enough notes to generate flashcards. Please add more notes first.");
    }
  };

  const generateNewCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateFlashcards(topicName, notes);
      if (generated && generated.length > 0) {
        setCards(generated);
        saveFlashcards(topicName, generated);
      } else {
        throw new Error("No flashcards were generated.");
      }
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setCards([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setError(null);
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        setCurrentIndex(0); // loop back
      }
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex > 0) {
        setCurrentIndex(c => c - 1);
      } else {
         setCurrentIndex(cards.length - 1);
      }
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm perspective-1000">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-xl"
      >
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold text-white flex items-center">
             <Layers className="mr-2 text-primary-400" />
             Study: {topicName}
           </h2>
           <button onClick={onClose} className="text-white hover:text-red-400 transition-colors p-2 bg-slate-800 rounded-full">
             <X size={20} />
           </button>
        </div>

        {isLoading ? (
           <div className="glass-card rounded-2xl h-80 flex flex-col items-center justify-center text-white">
             <RefreshCw className="animate-spin mb-4 text-primary-400" size={32} />
             <p className="font-medium text-lg text-slate-300">Extracting key concepts...</p>
           </div>
        ) : error ? (
           <div className="glass-card rounded-2xl p-8 text-center bg-white dark:bg-slate-800">
             <p className="text-red-500 mb-6">{error}</p>
             <button className="btn-secondary" onClick={onClose}>Close</button>
           </div>
        ) : cards.length > 0 ? (
           <>
            <p className="text-slate-300 text-center mb-6 font-medium">Card {currentIndex + 1} of {cards.length}</p>
            
            <div 
              className="relative h-80 w-full cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <AnimatePresence mode="wait">
                 <motion.div
                   key={currentIndex + (isFlipped ? '-back' : '-front')}
                   initial={{ rotateX: isFlipped ? -90 : 90, opacity: 0 }}
                   animate={{ rotateX: 0, opacity: 1 }}
                   exit={{ rotateX: isFlipped ? 90 : -90, opacity: 0 }}
                   transition={{ duration: 0.3 }}
                   className="absolute inset-0 w-full h-full"
                 >
                   <div className="w-full h-full glass-card rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center p-8 shadow-2xl hover:shadow-primary-500/10 transition-shadow text-center relative overflow-hidden">
                      <div className="absolute top-4 right-6 text-sm font-bold tracking-widest uppercase text-slate-400">
                        {isFlipped ? 'Answer' : 'Question'}
                      </div>
                      <h3 className="text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                        {isFlipped ? cards[currentIndex].back : cards[currentIndex].front}
                      </h3>
                      {!isFlipped && (
                        <div className="absolute bottom-4 left-0 w-full text-center text-sm text-slate-400">
                           Click to flip
                        </div>
                      )}
                   </div>
                 </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-8 gap-4">
              <button onClick={prevCard} className="btn-secondary flex-1 py-3 border border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
                Previous
              </button>
              <button onClick={nextCard} className="btn-primary flex-1 py-3 bg-primary-600 hover:bg-primary-500 border-none shadow-lg shadow-primary-500/20">
                {currentIndex === cards.length - 1 ? 'Start Over' : 'Next Card'}
              </button>
            </div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
