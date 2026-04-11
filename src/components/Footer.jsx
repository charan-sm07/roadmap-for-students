import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={20} className="text-primary-600" />
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
            PathAI
          </span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} PathAI. Build your personalized learning journey.
        </p>
      </div>
    </footer>
  );
}
