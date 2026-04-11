import { motion } from 'framer-motion';
import useRoadmapStore from '../store/useRoadmapStore';

export default function ActivityGraph() {
  const { dailyActivity } = useRoadmapStore();

  // Generate last 365 days
  const today = new Date();
  const days = [];
  
  // We want approximately 52 weeks * 7 days
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const minutes = (dailyActivity && dailyActivity[dateStr]) || 0;
    
    // Determine level of activity for coloring
    let level = 0;
    if (minutes > 0) level = 1;
    if (minutes >= 30) level = 2;
    if (minutes >= 60) level = 3;
    if (minutes >= 120) level = 4;
    
    days.push({ date: dateStr, level, minutes });
  }

  // Weeks mapping
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (level) => {
    switch (level) {
      case 1: return 'bg-primary-300 dark:bg-primary-900/60';
      case 2: return 'bg-primary-400 dark:bg-primary-700';
      case 3: return 'bg-primary-500 dark:bg-primary-500';
      case 4: return 'bg-primary-600 dark:bg-primary-400';
      default: return 'bg-slate-100 dark:bg-slate-800'; 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Learning Activity</h3>
        <p className="text-sm font-medium text-slate-500">Last 365 Days</p>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1.5 md:gap-2 min-w-max">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5 md:gap-2">
              {week.map((day, dIdx) => (
                <div 
                  key={dIdx}
                  className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm ${getColor(day.level)} cursor-help transition-transform hover:scale-125`}
                  title={`${day.date}: ${day.minutes} mins studied`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm bg-primary-300 dark:bg-primary-900/60"></div>
          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm bg-primary-400 dark:bg-primary-700"></div>
          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm bg-primary-500 dark:bg-primary-500"></div>
          <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm bg-primary-600 dark:bg-primary-400"></div>
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}
