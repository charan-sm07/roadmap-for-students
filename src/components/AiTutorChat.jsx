import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { askAiTutor } from '../lib/roadmapGenerator';

export default function AiTutorChat({ isOpen, onClose, topicName }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: `Hello! I'm your PathAI Tutor. I see you're working on "${topicName || 'your topic'}". What are you stuck on?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // Reset chat when topic changes
    if (topicName && isOpen) {
      setMessages([
        { role: 'system', content: `Hello! I'm your PathAI Tutor. I see you're working on **${topicName}**. What are you stuck on?` }
      ]);
    }
  }, [topicName, isOpen]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !topicName) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const aiRes = await askAiTutor(topicName, userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'system', content: aiRes }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          />
          
          <motion.div
            initial={{ x: '100%', boxShadow: '-20px 0 25px -5px rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-20px 0 25px -5px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '-20px 0 25px -5px rgba(0,0,0,0)' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 z-50 flex flex-col border-l border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">PathAI Tutor</h3>
                  <p className="text-xs font-semibold text-slate-500 line-clamp-1">{topicName}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm flex gap-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.role === 'system' && <Sparkles size={16} className="text-primary-500 mt-0.5 shrink-0" />}
                    <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1 items-center">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="I'm stuck on..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary-500 text-sm text-slate-900 dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1 w-10 h-10 flex items-center justify-center bg-primary-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors shadow-sm"
                >
                  <Send size={16} className="translate-x-[-1px] translate-y-[1px]" />
                </button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">PathAI can make mistakes. Verify important info.</p>
            </form>
          </motion.div>
        </  >
      )}
    </AnimatePresence>
  );
}
