import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Stepper from './components/Stepper';
import Chatbot from './components/Chatbot';
import HeroPage from './components/HeroPage';
import ElectionTimeline from './components/ElectionTimeline';
import AIPersonalizedPlan from './components/AIPersonalizedPlan';
import EVMSimulator from './components/EVMSimulator';
import FakeNewsDetector from './components/FakeNewsDetector';
import VoterPersonalityQuiz from './components/VoterPersonalityQuiz';
import MockResultsDashboard from './components/MockResultsDashboard';
import VotedStampOverlay from './components/VotedStampOverlay';
import PledgeCertificate from './components/PledgeCertificate';
import RightsFlashcards from './components/RightsFlashcards';

function App() {
  const [showLandingPage, setShowLandingPage] = useState(() => {
    const saved = localStorage.getItem('voterAssist_showLandingPage');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [readiness, setReadiness] = useState(0);
  const [activeStep, setActiveStep] = useState(() => {
    const saved = localStorage.getItem('voterAssist_activeStep');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [stampShown, setStampShown] = useState(false);

  const handleProgressChange = useCallback((percentage) => {
    setReadiness(percentage);
    if (percentage === 100 && !stampShown) {
      setShowStamp(true);
      setStampShown(true);
    }
  }, [stampShown]);

  const handleGetStarted = (stepIndex = 0) => {
    const index = typeof stepIndex === 'number' ? stepIndex : 0;
    setActiveStep(index);
    setShowLandingPage(false);
  };

  useEffect(() => {
    localStorage.setItem('voterAssist_activeStep', activeStep.toString());
  }, [activeStep]);

  useEffect(() => {
    localStorage.setItem('voterAssist_showLandingPage', JSON.stringify(showLandingPage));
  }, [showLandingPage]);

  const readinessLabel = () => {
    if (readiness === 0) return "Let's get started!";
    if (readiness < 50) return 'Making good progress.';
    if (readiness < 100) return 'Almost there!';
    return "You're fully prepared!";
  };

  return (
    <AnimatePresence mode="wait">
      {showLandingPage ? (
        <HeroPage key="hero" onGetStarted={handleGetStarted} />
      ) : (
        <motion.div
          key="dashboard"
          className="min-h-screen bg-background"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Navigation Bar */}
          <nav className="bg-primary-900 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <button
                  onClick={() => setShowLandingPage(true)}
                  className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 duration-300 focus:outline-none"
                >
                  <div className="bg-white text-primary-900 rounded-full p-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white text-2xl font-bold tracking-tight">VoterAssist</span>
                </button>

                <div className="hidden md:flex items-center space-x-8">
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-primary-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</button>
                  <button onClick={() => alert('Profile feature coming soon!')} className="text-primary-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">My Profile</button>
                  <button onClick={() => { const el = document.getElementById('resources'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }} className="text-primary-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Resources</button>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                    Back to Top
                  </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                  <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary-100 hover:text-white focus:outline-none">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Mobile Menu Panel */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-primary-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <button onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Dashboard</button>
                <button onClick={() => { setIsMobileMenuOpen(false); alert('Profile feature coming soon!'); }} className="text-primary-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">My Profile</button>
                <button onClick={() => { setIsMobileMenuOpen(false); const el = document.getElementById('resources'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }} className="text-primary-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left">Resources</button>
              </div>
            )}
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

            {/* Voter Readiness Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transform transition-all duration-500 hover:shadow-xl">
              <div className="p-8 sm:p-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Welcome to your dashboard</h1>
                <p className="text-slate-500 text-base mb-8 max-w-3xl">Complete each step below to ensure you are fully prepared for the upcoming election.</p>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Voter Readiness</h2>
                      <p className="text-sm text-slate-500 mt-0.5">{readinessLabel()}</p>
                    </div>
                    <span className="text-3xl font-black text-primary-600 tabular-nums">{readiness}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner overflow-hidden">
                    <div
                      className="h-4 rounded-full transition-all duration-700 ease-out relative"
                      style={{
                        width: `${readiness}%`,
                        background: 'linear-gradient(90deg, var(--color-primary-600), var(--color-primary-400))',
                      }}
                    >
                      <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(255,255,255,0))' }} />
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between text-xs font-semibold text-slate-400 px-1">
                    <span>Eligibility</span>
                    <span>Registration</span>
                    <span>Preparation</span>
                    <span>Voting Day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Personalized Action Plan */}
            <AIPersonalizedPlan readiness={readiness} activeStep={activeStep} />

            {/* Election Roadmap Timeline (Shown only in Preparation Step 2) */}
            {activeStep === 2 && (
              <div id="resources" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ElectionTimeline />
              </div>
            )}

            {/* Interactive Stepper */}
            <Stepper 
              activeStep={activeStep} 
              setActiveStep={setActiveStep} 
              onProgressChange={handleProgressChange} 
            />

            {/* Contextual Tools based on Active Step */}
            <div className="mt-8 space-y-12">
              
              {/* STEP 0: ELIGIBILITY */}
              {activeStep === 0 && (
                <div className="animate-in fade-in zoom-in-95 duration-500 space-y-8">
                  <VoterPersonalityQuiz />
                  <div className="pt-4">
                    <RightsFlashcards />
                  </div>
                </div>
              )}

              {/* STEP 2: PREPARATION */}
              {activeStep === 2 && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">AI-Powered Tool</span>
                    <h2 className="text-2xl font-extrabold text-slate-900">Verify Before You Trust</h2>
                    <p className="text-slate-500 text-sm mt-1">Don't let misinformation sway your vote. Fact-check claims instantly.</p>
                  </div>
                  <FakeNewsDetector />
                </div>
              )}

              {/* STEP 3: VOTING DAY */}
              {activeStep === 3 && (
                <div className="animate-in fade-in zoom-in-95 duration-500 space-y-12">
                  {/* EVM Simulator Section */}
                  <div>
                    <div className="text-center mb-6">
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">Interactive Demo</span>
                      <h2 className="text-2xl font-extrabold text-slate-900">Practice on a Real EVM</h2>
                      <p className="text-slate-500 text-sm mt-1">Try casting a vote before Election Day — risk free!</p>
                    </div>
                    <EVMSimulator />
                  </div>

                  {/* Live Results Dashboard */}
                  <div>
                    <div className="text-center mb-6">
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">Live Simulation</span>
                      <h2 className="text-2xl font-extrabold text-slate-900">Mock Election Results</h2>
                      <p className="text-slate-500 text-sm mt-1">Experience how real-time vote counting looks on Election Day.</p>
                    </div>
                    <MockResultsDashboard />
                  </div>

                  {/* Pledge to Vote Certificate */}
                  <div className="pt-8 border-t border-slate-200">
                    <PledgeCertificate />
                  </div>
                </div>
              )}
            </div>

            {/* Reset Progress Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all your progress?')) {
                    localStorage.removeItem('voterAssist_activeStep');
                    localStorage.removeItem('voterAssist_checkedTasks');
                    localStorage.removeItem('voterAssist_showLandingPage');
                    window.location.reload();
                  }
                }}
                className="text-slate-400 hover:text-rose-500 text-sm font-medium transition-colors border border-transparent hover:border-rose-100 hover:bg-rose-50 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset All Progress
              </button>
            </div>

          </main>

          <Chatbot context={{ readiness, activeStep }} />
          <VotedStampOverlay show={showStamp} onDismiss={() => setShowStamp(false)} />

          <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2026 VoterAssist. Your voice matters.</p>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">Verified Information</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
