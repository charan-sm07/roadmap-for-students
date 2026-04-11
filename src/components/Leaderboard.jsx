import { motion } from 'framer-motion';
import { Trophy, Medal, Star } from 'lucide-react';
import useRoadmapStore from '../store/useRoadmapStore';

export default function Leaderboard() {
  const { currentUser, userPoints } = useRoadmapStore();

  const mockUsers = [
    { name: "Alex Chen", points: 1250, streak: 45, avatar: "A" },
    { name: "Maria Garcia", points: 1120, streak: 30, avatar: "M" },
    { name: "David Kim", points: 980, streak: 22, avatar: "D" },
    { name: "Sarah Jones", points: 850, streak: 14, avatar: "S" },
    { name: "Ahmed Hassan", points: 720, streak: 10, avatar: "AH" },
    { name: "Emma Smith", points: 540, streak: 8, avatar: "E" }
  ];

  // Insert current user into leaderboard
  const currentLearner = {
    name: currentUser?.name || "You",
    points: userPoints || 0,
    streak: useRoadmapStore.getState().currentStreak || 0,
    avatar: "U",
    isCurrentUser: true
  };

  const allPerformers = [...mockUsers, currentLearner]
    .sort((a, b) => b.points - a.points);
  
  // Cut down to top 7
  const topList = allPerformers.slice(0, 7);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm col-span-1 md:col-span-1 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 rounded-xl">
           <Trophy size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Global Leaderboard</h3>
          <p className="text-sm font-medium text-slate-500">Top learners this month</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {topList.map((user, idx) => {
          const isTop3 = idx < 3;
          let medalColor = "";
          if (idx === 0) medalColor = "text-yellow-500";
          else if (idx === 1) medalColor = "text-slate-400";
          else if (idx === 2) medalColor = "text-amber-600";

          return (
            <div 
              key={user.name + idx}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${user.isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/40 border border-primary-200 dark:border-primary-800' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'}`}
            >
              <div className="font-bold text-slate-400 w-4 text-center text-sm">
                {idx + 1}
              </div>
              
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.isCurrentUser ? 'bg-primary-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {user.Avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.name.charAt(0)}
                </div>
                {isTop3 && (
                   <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-900 rounded-full">
                     <Medal size={16} className={medalColor} />
                   </div>
                )}
              </div>

              <div className="flex-1">
                <p className={`font-semibold text-sm ${user.isCurrentUser ? 'text-primary-700 dark:text-primary-400' : 'text-slate-900 dark:text-white'}`}>
                  {user.name} {user.isCurrentUser && "(You)"}
                </p>
                <div className="flex items-center text-xs text-slate-500 gap-2 mt-1">
                  <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> {user.points} pts</span>
                  <span className="opacity-50">•</span>
                  <span>{user.streak} day streak</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
