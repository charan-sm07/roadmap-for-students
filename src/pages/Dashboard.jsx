import { motion } from 'framer-motion';
import { Flame, Book, Trophy, Clock, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import useRoadmapStore from '../store/useRoadmapStore';
import ActivityGraph from '../components/ActivityGraph';
import Leaderboard from '../components/Leaderboard';

export default function Dashboard() {
  const { roadmaps, currentUser, currentStreak, setActiveRoadmap, totalFocusMinutes } = useRoadmapStore();

  // Calculate points and hours from completed tasks
  let totalPoints = 0;
  let totalHoursLearned = 0;

  const savedRoadmaps = roadmaps.map(rm => {
    const totalTopics = rm.phases.reduce((acc, phase) => acc + (phase.topics?.length || 0), 0);
    const completedTopics = rm.phases.reduce((acc, phase) => acc + (phase.topics?.filter(t => t.completed)?.length || 0), 0);
    const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
    
    totalPoints += completedTopics * 25; // 25 points per completed topic
    totalHoursLearned += completedTopics * 1.5; // Roughly 1.5 hours per topic
    
    // Find next uncompleted topic
    let nextTopic = "All tasks complete! 👑";
    for (const phase of rm.phases) {
      const topic = phase.topics?.find(t => !t.completed);
      if (topic) {
        nextTopic = topic.name;
        break;
      }
    }

    return {
      id: rm.id,
      goal: rm.goal,
      progress,
      lastActive: new Date(rm.createdAt).toLocaleDateString(),
      nextTopic
    };
  });

  const actualHours = (totalFocusMinutes || 0) / 60;

  const user = {
    name: currentUser?.name || 'Guest',
    streak: currentStreak || 0,
    points: totalPoints,
    hoursLearned: totalFocusMinutes > 0 ? Math.round(actualHours * 10) / 10 : Math.round(totalHoursLearned)
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Ready to continue your learning journey?
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        <StatCard icon={<Flame className="text-orange-500" size={24} />} title="Day Streak" value={user.streak} bg="bg-orange-50 dark:bg-orange-500/10" text="text-orange-700 dark:text-orange-400 mt-2" />
        <StatCard icon={<Book className="text-primary-500" size={24} />} title="Paths Active" value={savedRoadmaps.length} bg="bg-primary-50 dark:bg-primary-500/10" text="text-primary-700 dark:text-primary-400 mt-2" />
        <StatCard icon={<Trophy className="text-yellow-500" size={24} />} title="Points Earned" value={user.points} bg="bg-yellow-50 dark:bg-yellow-500/10" text="text-yellow-700 dark:text-yellow-400 mt-2" />
        <StatCard icon={<Clock className="text-blue-500" size={24} />} title="Hours Learned" value={user.hoursLearned} bg="bg-blue-50 dark:bg-blue-500/10" text="text-blue-700 dark:text-blue-400 mt-2" />
      </div>

      <div className="mb-14">
        <ActivityGraph />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Learning Paths</h2>
        <Link to="/generate" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center bg-primary-50 dark:bg-primary-900/30 px-4 py-2 rounded-full transition-colors">
          Create New <ArrowRight size={16} className="ml-1.5" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
        {savedRoadmaps.map((map, idx) => (
          <Link 
            to="/roadmap"
            onClick={() => setActiveRoadmap(map.id)}
            key={map.id} 
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 flex flex-col h-full relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-400/10 to-purple-500/10 rounded-full blur-3xl -mt-10 -mr-10 transition-transform group-hover:scale-150"></div>
            
            <div className="flex justify-between items-start mb-8 z-10">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight pr-4">{map.goal}</h3>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm backdrop-blur-sm">
                {map.progress}% Complete
              </span>
            </div>
            
            <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-3 mb-3 overflow-hidden z-10 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${map.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full" 
              ></motion.div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-10 z-10 font-medium">Last active {map.lastActive}</p>
            
            <div className="mt-auto bg-white/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 z-10 backdrop-blur-md shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-widest font-bold">Up Next</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm md:text-base line-clamp-1">{map.nextTopic}</span>
                <button className="bg-primary-50 dark:bg-slate-800 shadow-sm border border-primary-100 dark:border-slate-700 rounded-full p-2.5 text-primary-600 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-all group-hover:shadow-md ml-3 shrink-0">
                  <Play size={16} className="ml-0.5" fill="currentColor" />
                </button>
              </div>
            </div>
            </motion.div>
          </Link>
        ))}
        </div>
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bg, text }) {
  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${bg}`}>
        {icon}
      </div>
      <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">{value}</p>
      <p className={`text-sm font-bold uppercase tracking-wider ${text}`}>{title}</p>
    </div>
  );
}
