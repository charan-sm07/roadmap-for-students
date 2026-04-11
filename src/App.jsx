import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import InputPage from './pages/InputPage';
import OutputPage from './pages/OutputPage';
import Dashboard from './pages/Dashboard';
import LoginSignupPage from './pages/LoginSignupPage';
import PomodoroTimer from './components/PomodoroTimer';
import ExplorePage from './pages/ExplorePage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<LoginSignupPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/generate" element={<InputPage />} />
            <Route path="/roadmap" element={<OutputPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </AnimatePresence>
      </main>
      <PomodoroTimer />
      <Footer />
    </div>
  );
}

export default App;
