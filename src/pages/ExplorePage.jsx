import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Star, PlusCircle, ArrowRight, Library, Code, PenTool, Palette, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useRoadmapStore from '../store/useRoadmapStore';

// Mock templates
const templates = [
  {
    id: 't1',
    goal: 'Full-Stack Web Developer 2026',
    skillLevel: 'beginner',
    timeCommitment: 15,
    category: 'Engineering',
    users: 1240,
    rating: 4.9,
    author: 'CodeMaster',
    icon: <Code size={24} className="text-blue-500" />,
    color: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800',
    phases: [
      { id: 'p1', title: 'Frontend Basics', description: 'HTML, CSS, JavaScript basics.', estimatedTime: '4 weeks', topics: [{ name: 'HTML5', type: 'Course', source: 'MDN Web Docs', completed: false }] },
      { id: 'p2', title: 'React & Frameworks', description: 'Learn React, Vite, Next.js', estimatedTime: '6 weeks', topics: [{ name: 'React Fundamentals', type: 'Video', source: 'YouTube', completed: false }] },
      { id: 'p3', title: 'Backend & DB', description: 'Node.js, Express, PostgreSQL', estimatedTime: '6 weeks', topics: [{ name: 'Node.js intro', type: 'Course', source: 'FreeCodeCamp', completed: false }] }
    ]
  },
  {
    id: 't2',
    goal: 'Graphic Design Mastery',
    skillLevel: 'intermediate',
    timeCommitment: 10,
    category: 'Design',
    users: 856,
    rating: 4.8,
    author: 'DesignPro',
    icon: <Palette size={24} className="text-pink-500" />,
    color: 'bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-800',
    phases: [
      { id: 'p1', title: 'Color Theory & Typography', description: 'Fundamentals of design', estimatedTime: '3 weeks', topics: [{ name: 'Color harmony', type: 'Article', source: 'Nielsen Group', completed: false }] },
      { id: 'p2', title: 'Adobe Creative Suite', description: 'Photoshop, Illustrator mastery', estimatedTime: '8 weeks', topics: [{ name: 'Vector Art', type: 'Course', source: 'Skillshare', completed: false }] }
    ]
  },
  {
    id: 't3',
    goal: 'Product Management 101',
    skillLevel: 'beginner',
    timeCommitment: 8,
    category: 'Business',
    users: 2150,
    rating: 4.9,
    author: 'StartupGuru',
    icon: <Briefcase size={24} className="text-amber-500" />,
    color: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800',
    phases: [
      { id: 'p1', title: 'Agile & Scrum', description: 'Methodologies for software delivery', estimatedTime: '2 weeks', topics: [{ name: 'Scrum basics', type: 'Article', source: 'Atlassian', completed: false }] },
      { id: 'p2', title: 'User Research', description: 'Interviewing, analytics, surveys', estimatedTime: '4 weeks', topics: [{ name: 'User Interviews', type: 'Video', source: 'Y Combinator', completed: false }] }
    ]
  },
  {
    id: 't4',
    goal: 'Content Writing & SEO',
    skillLevel: 'beginner',
    timeCommitment: 12,
    category: 'Marketing',
    users: 630,
    rating: 4.7,
    author: 'WordSmith',
    icon: <PenTool size={24} className="text-emerald-500" />,
    color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800',
    phases: [
      { id: 'p1', title: 'SEO Basics', description: 'Keywords, on-page optimization', estimatedTime: '3 weeks', topics: [{ name: 'Keyword Research', type: 'Course', source: 'HubSpot', completed: false }] },
      { id: 'p2', title: 'Copywriting', description: 'Writing persuasive content', estimatedTime: '5 weeks', topics: [{ name: 'Direct Response Copy', type: 'Book', source: 'Amazon', completed: false }] }
    ]
  }
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const { addRoadmap, currentUser } = useRoadmapStore();
  const navigate = useNavigate();

  const filteredTemplates = templates.filter(t => 
    t.goal.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUseTemplate = (template) => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    // Create a deep copy and add it to user's roadmaps
    const roadmapData = {
      goal: template.goal,
      skillLevel: template.skillLevel,
      timeCommitment: template.timeCommitment,
      phases: JSON.parse(JSON.stringify(template.phases))
    };
    
    addRoadmap(roadmapData);
    navigate('/roadmap');
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Explore Learning Paths
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Discover pre-made, highly-rated roadmaps created by experts and the community. Jumpstart your learning journey instantly.
        </p>
      </div>

      <div className="relative max-w-md mx-auto mb-12">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search for skills, topics, roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800 dark:text-slate-200 shadow-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={template.id}
            className="glass-card rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className={`p-6 md:p-8 flex items-start gap-4 ${template.color} transition-colors border-b`}>
              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center shrink-0">
                {template.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <span>{template.category}</span>
                  <span>•</span>
                  <span>{template.skillLevel}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{template.goal}</h3>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex-grow bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><Users size={16} /> {template.users.toLocaleString()}</span>
                  <span className="flex items-center gap-1.5 text-amber-500"><Star size={16} className="fill-current" /> {template.rating}</span>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">By {template.author}</span>
              </div>
              
              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Library size={18} className="text-primary-500" /> Syllabus Preview
                </h4>
                <ul className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {template.phases.map((p, i) => (
                    <li key={i} className="relative pl-8 text-sm">
                      <div className="absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 bg-primary-500 shadow-sm z-10" />
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">{p.title}</span>
                      <span className="text-slate-500 dark:text-slate-500">{p.description} • <span className="font-medium text-slate-600 dark:text-slate-400">{p.estimatedTime}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <button 
                onClick={() => handleUseTemplate(template)}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-colors group-hover:shadow-md"
              >
                <PlusCircle size={20} /> Use Template <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
