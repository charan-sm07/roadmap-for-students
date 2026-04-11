import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, GraduationCap, Map, ChevronDown, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useRoadmapStore from '../store/useRoadmapStore';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileModal from './ProfileModal';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { roadmaps, activeRoadmapId, setActiveRoadmap, deleteRoadmap, currentUser, currentStreak, logout } = useRoadmapStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelectRoadmap = (id) => {
    setActiveRoadmap(id);
    setDropdownOpen(false);
    navigate('/roadmap');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav h-16 flex items-center border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
            PathAI
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link to="/explore" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Explore</Link>
              <Link to="/generate" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Generate Path</Link>
              {currentUser && (
                  <Link to="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Dashboard</Link>
              )}
            
            {/* Saved Roadmaps Dropdown */}
            {roadmaps.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Map size={16} /> Saved Paths <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                      <div className="max-h-64 overflow-y-auto">
                        {roadmaps.map(roadmap => (
                          <div key={roadmap.id} className="flex items-center justify-between group/item p-3 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => handleSelectRoadmap(roadmap.id)}>
                            <div className="flex-1 min-w-0 pr-2">
                              <p className={`text-sm truncate font-medium ${activeRoadmapId === roadmap.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {roadmap.goal}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {new Date(roadmap.createdAt).toLocaleDateString()} • {roadmap.skillLevel}
                              </p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteRoadmap(roadmap.id);
                                if (roadmaps.length === 1) {
                                  setDropdownOpen(false);
                                  navigate('/');
                                }
                              }}
                              className="text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity p-1"
                              aria-label="Delete Roadmap"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Remove empty dashboard link here if it was hidden */}
          </div>
          
          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full text-xs font-bold mr-2" title="Current Daily Streak">
                🔥 {currentStreak}
              </div>
            )}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {currentUser ? (
              <div className="relative group/auth">
                 <button className="flex items-center gap-2 font-semibold text-sm max-w-[120px] ml-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                       {currentUser.name?.charAt(0).toUpperCase()}
                    </div>
                 </button>
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 py-1 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible transition-all">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                       <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                       <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button onClick={() => setIsProfileModalOpen(true)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium">
                       Profile Settings
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                       Sign Out
                    </button>
                 </div>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary text-sm px-4 py-2 hidden sm:flex">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </nav>
  );
}
