import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Bot, Map, Target, Clock, Star, PlayCircle, CheckCircle2 } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 md:px-6 relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-3xl -z-10 opacity-50 dark:opacity-20 pointer-events-none"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex-1 text-center lg:text-left z-10">
              <motion.h1 
                variants={fadeIn}
                className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
              >
                Build Your Personalized <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  Learning Journey
                </span>
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                Let our AI construct a customized, step-by-step masterplan based on your precise goal, schedule, and learning style within seconds.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/generate" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-primary-500/30">
                  Generate Roadmap Free
                </Link>
                <Link to="/auth" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                  Sign In to Save
                </Link>
              </motion.div>
              
              <motion.div variants={fadeIn} className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700"></div>
                  ))}
                </div>
                Trusted by 10,000+ self-learners
              </motion.div>
            </motion.div>
            
            {/* Floating Visual Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-md lg:max-w-none relative perspective-1000 hidden md:block"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="glass-card rounded-2xl p-6 shadow-2xl border-t-4 border-t-primary-500 rotate-2 hover:rotate-0 transition-transform duration-500"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-primary-100 dark:bg-primary-900/30 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm relative overflow-hidden">
                      {i === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>}
                      <div className={`mt-1 ${i === 0 ? 'text-primary-500' : 'text-slate-300 dark:text-slate-600'}`}>
                        {i === 0 ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current"></div>}
                      </div>
                      <div className="flex-1">
                        <div className={`h-4 w-3/4 rounded mb-2 ${i === 0 ? 'bg-slate-300 dark:bg-slate-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        <div className="flex gap-2">
                           <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800 rounded"></div>
                           <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Floating decorative elements */}
                <motion.div 
                  animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute -right-12 -top-10 glass-card p-4 rounded-xl shadow-lg border border-white/20 bg-gradient-to-br from-purple-500 to-primary-600 text-white"
                >
                  <Target size={24} />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute -left-8 -bottom-8 glass-card p-4 rounded-xl shadow-lg border border-white/20 bg-white dark:bg-slate-800 text-amber-500 hidden lg:block"
                >
                  <PlayCircle size={28} />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Why Choose PathAI?</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Our AI-driven platform adapts to your unique learning style.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Bot size={32} className="text-primary-500" />}
              title="Anthropic Claude AI"
              description="Powered by cutting-edge AI models to instantly create a highly structured curriculum tailored specifically to your goals."
            />
            <FeatureCard 
              icon={<Target size={32} className="text-purple-500" />}
              title="Interactive Tracking"
              description="Monitor your progress through fundamentals, intermediate topics, and visually check off milestones."
            />
            <FeatureCard 
              icon={<Clock size={32} className="text-blue-500" />}
              title="Time-Optimized"
              description="Roadmaps are perfectly paced based on how many hours you can commit each week."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Loved by Learners</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Sarah J."
              role="Aspiring Developer"
              content="The roadmap generated for my web development journey was spot on. It saved me weeks of figuring out what to learn first."
            />
            <TestimonialCard 
              name="Michael T."
              role="Data Science Student"
              content="I love how it adjusts to my 10-hour a week schedule. The recommended resources were incredibly high quality."
            />
            <TestimonialCard 
              name="Elena R."
              role="Self-Taught Designer"
              content="The UI is gorgeous and the structured timeline keeps me motivated every single day to maintain my streak!"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8 rounded-2xl flex flex-col items-start border-t-4 border-t-primary-500/50"
    >
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </motion.div>
  );
}

FeatureCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

function TestimonialCard({ name, role, content }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-8 rounded-2xl relative"
    >
      <div className="flex text-amber-400 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
      </div>
      <p className="text-slate-600 dark:text-slate-300 italic mb-6">"{content}"</p>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-white">{name}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
      </div>
    </motion.div>
  );
}

TestimonialCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};
