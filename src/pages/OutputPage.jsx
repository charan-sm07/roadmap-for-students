import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, PlayCircle, FileText, Code2, ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronUp, Book, Briefcase, Award, ListTree, AlignLeft, Bot, ExternalLink, Edit3 } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';
import html2pdf from 'html2pdf.js';
import RoadmapGraph from '../components/RoadmapGraph';
import AiTutorChat from '../components/AiTutorChat';
import TopicNotesModal from '../components/TopicNotesModal';
import CertificateModal from '../components/CertificateModal';
import QuizModal from '../components/QuizModal';

export default function OutputPage() {
  const navigate = useNavigate();
  const { roadmaps, activeRoadmapId, toggleTopicCompletion, updateTopicNote } = useRoadmapStore();
  const activeRoadmap = roadmaps.find(r => r.id === activeRoadmapId);
  const pdfRef = useRef(null);
  
  const [expandedPhases, setExpandedPhases] = useState({});
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTopicForChat, setActiveTopicForChat] = useState("");

  const openChatForTopic = (e, topicName) => {
    e.stopPropagation();
    setActiveTopicForChat(topicName);
    setIsChatOpen(true);
  };

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [activeTopicForQuiz, setActiveTopicForQuiz] = useState("");

  const openQuizForTopic = (e, topicName) => {
    e.stopPropagation();
    setActiveTopicForQuiz(topicName);
    setIsQuizOpen(true);
  };

  // Notes Modal State
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [activeNoteData, setActiveNoteData] = useState({ phaseId: null, topicIndex: null, topicName: "", note: "" });

  const openNoteModal = (e, phaseId, topicIndex, topicName, currentNote) => {
    e.stopPropagation();
    setActiveNoteData({ phaseId, topicIndex, topicName, note: currentNote });
    setIsNotesOpen(true);
  };

  const handleSaveNote = (newNote) => {
    updateTopicNote(activeRoadmap.id, activeNoteData.phaseId, activeNoteData.topicIndex, newNote);
  };

  useEffect(() => {
    if (!activeRoadmap && roadmaps.length === 0) {
      navigate('/generate');
    } else if (!activeRoadmap && roadmaps.length > 0) {
      navigate('/');
    }
  }, [activeRoadmap, roadmaps, navigate]);

  useEffect(() => {
    if (activeRoadmap) {
      // Expand first phase by default
      if (activeRoadmap.phases && activeRoadmap.phases.length > 0) {
        setExpandedPhases({ [activeRoadmap.phases[0].id]: true });
      }
    }
  }, [activeRoadmap]);

  if (!activeRoadmap) return null;

  const togglePhase = (id) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Progress Calculation
  const totalTopics = activeRoadmap.phases.reduce((acc, phase) => acc + (phase.topics?.length || 0), 0);
  const completedTopics = activeRoadmap.phases.reduce((acc, phase) => acc + (phase.topics?.filter(t => t.completed)?.length || 0), 0);
  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

  const handleShare = () => {
    // In a real app, this might generate a backend ID. Here we mock it by copying the URL or a text summary.
    navigator.clipboard.writeText(`Check out my learning roadmap for ${activeRoadmap.goal}! I'm ${progressPercentage}% done. ${window.location.origin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    const element = pdfRef.current;
    
    // Quick expand all phases before print to show everything
    const allExpanded = {};
    activeRoadmap.phases.forEach(p => allExpanded[p.id] = true);
    setExpandedPhases(allExpanded);
    
    setTimeout(() => {
      const opt = {
        margin: 10,
        filename: `${activeRoadmap.goal.replace(/\s+/g, '-')}-Roadmap.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    }, 500); // 500ms allows react to render expanded phases
  };

  const handleExportMarkdown = () => {
    let md = `# Learning Roadmap: ${activeRoadmap.goal}\n\n`;
    md += `* **Target Level:** ${activeRoadmap.skillLevel}\n`;
    md += `* **Dedication:** ${activeRoadmap.timeCommitment} hrs/wk\n\n`;
    
    activeRoadmap.phases.forEach(phase => {
      md += `## ${phase.title} (Est. ${phase.estimatedTime})\n> ${phase.description}\n\n`;
      phase.topics?.forEach(topic => {
         md += `- [${topic.completed ? 'x' : ' '}] **${topic.name}**\n`;
         md += `  - Type: ${topic.type}\n`;
         md += `  - Source: ${topic.source}\n`;
         if(topic.link) md += `  - [Find Resources](${topic.link})\n`;
      });
      md += `\n`;
    });
    
    // Download as .md file
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeRoadmap.goal.replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getIconForType = (type) => {
    switch(type?.toLowerCase()) {
      case 'video': case 'course': return <PlayCircle size={20} />;
      case 'article': case 'documentation': case 'book': return <Book size={20} />;
      case 'project': return <Code2 size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getRankBadge = (percentage) => {
    if (percentage === 0) return { name: "Novice", bg: "bg-slate-200 dark:bg-slate-700", text: "text-slate-700 dark:text-slate-300" };
    if (percentage < 25) return { name: "Explorer", bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400" };
    if (percentage < 50) return { name: "Scholar", bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400" };
    if (percentage < 75) return { name: "Adept", bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400" };
    if (percentage < 100) return { name: "Expert", bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400" };
    return { name: "Master 👑", bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-500" };
  };

  const currentRank = getRankBadge(progressPercentage);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Link to="/generate" className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors w-fit">
        <ArrowLeft size={16} /> Generate New Roadmap
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 pb-1">{activeRoadmap.goal}</span> Roadmap
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Custom-tailored for a <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{activeRoadmap.skillLevel}</span> dedicating <span className="font-semibold text-slate-800 dark:text-slate-200">{activeRoadmap.timeCommitment} hrs/wk</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
             <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg flex items-center font-semibold text-sm transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
               <AlignLeft size={16} className="mr-2 hidden sm:block" /> List
             </button>
             <button onClick={() => setViewMode('graph')} className={`px-4 py-2 rounded-lg flex items-center font-semibold text-sm transition-all ${viewMode === 'graph' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
               <ListTree size={16} className="mr-2 hidden sm:block" /> Graph
             </button>
          </div>
          <button onClick={handleShare} className="btn-secondary whitespace-nowrap !py-3 hidden sm:flex">
            <Share2 size={18} className="mr-2" /> {copied ? "Copied!" : "Share"}
          </button>
          <button onClick={handleExportMarkdown} className="btn-secondary whitespace-nowrap !py-3">
            <FileText size={18} className="mr-2" /> Export .md
          </button>
          <button onClick={handleDownloadPdf} className="btn-primary whitespace-nowrap gap-2 !py-3 shadow-primary-500/30">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-6 mb-16 flex items-center gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-purple-600 p-4 rounded-xl text-white shadow-lg flex-shrink-0">
          <Award size={32} />
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Your Progress</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentRank.bg} ${currentRank.text} border border-current`}>
                Rank: {currentRank.name}
              </span>
            </div>
            <span className="font-bold text-primary-600 dark:text-primary-400">{progressPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {completedTopics} of {totalTopics} tasks completed
            </p>
            {progressPercentage === 100 && (
              <button 
                onClick={() => setIsCertModalOpen(true)}
                className="text-xs font-bold bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                <Award size={14} /> View Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div ref={pdfRef} className="space-y-8 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[25px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary-500 before:via-purple-500 before:to-blue-500 before:rounded-full pb-10">
          {activeRoadmap.phases && activeRoadmap.phases.map((phase, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            key={phase.id} 
            className="relative flex flex-col md:flex-row md:even:flex-row-reverse group items-start md:items-center"
          >
            {/* Timeline dot desktop */}
            <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 bg-gradient-to-br from-primary-500 to-purple-600 shadow-xl transform shrink-0 absolute left-1/2 -translate-x-1/2 z-10">
              <span className="text-white font-bold text-lg">{index + 1}</span>
            </div>
            
            {/* Timeline dot mobile */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-slate-950 bg-gradient-to-br from-primary-500 to-purple-600 shadow-md shrink-0 md:hidden z-10 ml-0 mr-6 absolute">
              <span className="text-white font-bold">{index + 1}</span>
            </div>

            {/* Content Card */}
            <div className="w-full md:w-[calc(50%-4rem)] ml-16 md:ml-0 glass-card rounded-3xl shadow-md border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-400 dark:hover:border-primary-500/50 transition-colors overflow-hidden">
              
              {/* Header (Clickable for expanding) */}
              <div 
                className="p-6 md:p-8 cursor-pointer select-none relative"
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    Expect: {phase.estimatedTime}
                  </div>
                  <button className="text-slate-400 hover:text-primary-500 transition-colors p-1 bg-slate-50 dark:bg-slate-800 rounded-full">
                    {expandedPhases[phase.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight pr-8">{phase.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{phase.description}</p>
              </div>
              
              {/* Expandable Topics List */}
              <AnimatePresence>
                {expandedPhases[phase.id] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <div className="p-4 md:p-6 space-y-3">
                      {phase.topics && phase.topics.map((topic, i) => (
                        <div 
                          key={i} 
                          onClick={() => toggleTopicCompletion(activeRoadmap.id, phase.id, i)}
                          className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                            topic.completed 
                              ? 'bg-primary-50/50 border-primary-200 dark:bg-primary-900/10 dark:border-primary-800' 
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
                          }`}
                        >
                          {/* Checkbox */}
                          <div className={`mt-0.5 transition-colors shrink-0 ${topic.completed ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-primary-300'}`}>
                            {topic.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </div>
                          
                          <div className={`flex-1 transition-opacity ${topic.completed ? 'opacity-70' : 'opacity-100'}`}>
                            <h4 className={`font-bold text-base mb-1 ${topic.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                              {topic.name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md">
                                {getIconForType(topic.type)} {topic.type}
                              </span>
                              
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Source: {topic.source}</span>
                              {topic.link && (
                                <a href={topic.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50" onClick={(e) => e.stopPropagation()}>
                                  <ExternalLink size={12} /> 
                                  {topic.source === 'YouTube' || topic.source === 'Coursera' || topic.source === 'Udemy' ? 'Video Link' : 'Website Link'}
                                </a>
                              )}

                              {topic.cost && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  topic.cost.toLowerCase() === 'free' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}>
                                  {topic.cost}
                                </span>
                              )}

                              <div className="ml-auto flex items-center gap-2">
                                <button 
                                  onClick={(e) => openNoteModal(e, phase.id, i, topic.name, topic.note)}
                                  className="text-xs flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 px-3 py-1.5 rounded-full font-bold transition-colors"
                                >
                                  <Edit3 size={14} /> Notes
                                </button>
                                <button 
                                  onClick={(e) => openQuizForTopic(e, topic.name)}
                                  className="text-xs flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 px-3 py-1.5 rounded-full font-bold transition-colors"
                                >
                                  Take Quiz
                                </button>
                                <button 
                                  onClick={(e) => openChatForTopic(e, topic.name)}
                                  className="text-xs flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-full font-bold transition-colors"
                                >
                                  <Bot size={14} /> Stuck? Ask AI
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        ))}
        </div>
      ) : (
        <div ref={pdfRef}>
          <RoadmapGraph roadmap={activeRoadmap} openChatForTopic={openChatForTopic} openQuizForTopic={openQuizForTopic} />
        </div>
      )}

      {/* Slide-over Ai Tutor Chat */}
      <AiTutorChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        topicName={activeTopicForChat}
      />

      {/* Topic Notes Modal */}
      <TopicNotesModal 
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        topicName={activeNoteData.topicName}
        initialNote={activeNoteData.note}
        onSave={handleSaveNote}
      />

      {/* Certificate Modal */}
      <CertificateModal 
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        roadmap={activeRoadmap}
      />

      {/* Quiz Modal */}
      <QuizModal 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        topicName={activeTopicForQuiz}
        goal={activeRoadmap?.goal}
      />
    </div>
  );
}
