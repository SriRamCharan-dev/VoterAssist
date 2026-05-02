import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// ── Palette ────────────────────────────────────────────────────────────────────
const INDIGO = '#6366f1';
const INDIGO_DARK = '#4338ca';
const INDIGO_LIGHT = '#a5b4fc';
const RED_CTA = '#E23744';

// ── Reusable scroll-reveal wrapper ────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Floating blob ─────────────────────────────────────────────────────────────
function Blob({ style, duration = 6, delay = 0, color = INDIGO }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ background: color, filter: 'blur(70px)', opacity: 0.13, ...style }}
      animate={{ scale: [1, 1.15, 1], x: [0, 14, 0], y: [0, -14, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ── Floating icon (Indigo-tinted) ─────────────────────────────────────────────
function FloatIcon({ children, style, duration = 5.5, delay = 0 }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ color: INDIGO_LIGHT, opacity: 0.55, ...style }}
      animate={{ y: [0, -16, 0], rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const Icons = {
  ballot: (
    <svg viewBox="0 0 64 64" fill="currentColor" width="100%" height="100%">
      <rect x="10" y="6" width="44" height="52" rx="5" />
      <rect x="18" y="20" width="28" height="5" rx="2.5" fill="white" opacity="0.7" />
      <rect x="18" y="31" width="20" height="5" rx="2.5" fill="white" opacity="0.5" />
      <rect x="18" y="42" width="24" height="5" rx="2.5" fill="white" opacity="0.5" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 64 64" fill="currentColor" width="100%" height="100%">
      <path d="M32 4C21 4 12 13 12 24c0 16 20 36 20 36s20-20 20-36C52 13 43 4 32 4zm0 28a8 8 0 110-16 8 8 0 010 16z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 64 64" fill="currentColor" width="100%" height="100%">
      <circle cx="32" cy="32" r="28" opacity="0.6" />
      <path d="M20 32l10 10 16-18" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 64 64" fill="currentColor" width="100%" height="100%">
      <path d="M32 4l7 14 16 2-11 11 3 16-15-8-15 8 3-16L8 20l16-2z" />
    </svg>
  ),
};

// ── How it works steps ────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Check Eligibility', desc: 'Quickly verify your age, citizenship, and residency status to confirm you are ready to vote.', icon: '✅' },
  { num: '02', title: 'Register to Vote', desc: 'Complete Form 6 online or in-person. We walk you through every field and document required.', icon: '📝' },
  { num: '03', title: 'Find Your Booth', desc: 'Enter your Pincode to instantly locate your designated polling station, address, and distance.', icon: '📍' },
  { num: '04', title: 'Vote with Confidence', desc: 'Show up with the right ID, follow our day-of checklist, and make your voice heard.', icon: '🗳️' },
];

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Guide', desc: 'An intelligent chatbot answers your voting questions instantly — no more hunting government websites.' },
  { icon: '💾', title: 'Progress Saved', desc: 'Your checklist progress is saved in your browser. Pick up exactly where you left off.' },
  { icon: '🔒', title: 'Fully Private', desc: 'No account needed. No data stored on servers. Everything stays on your device.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Designed to be beautiful and functional on mobile, tablet, and desktop.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Find your polling booth in seconds. No waiting, no confusion.' },
  { icon: '🏛️', title: 'Verified Info', desc: 'All information is sourced from official government election portals.' },
];

// stagger container
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function HeroPage({ onGetStarted }) {
  return (
    <motion.div
      key="hero"
      className="relative overflow-x-hidden"
      style={{ fontFamily: 'Poppins, sans-serif' }}
      exit={{ opacity: 0, y: -40, transition: { duration: 0.45 } }}
    >

      {/* ══════════════ HERO SECTION ══════════════ */}
      <section
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 60%, #f0f9ff 100%)' }}
      >
        {/* Blobs */}
        <Blob style={{ width: 500, height: 500, top: '-100px', left: '-100px' }} duration={8} color={INDIGO} />
        <Blob style={{ width: 400, height: 400, bottom: '-80px', right: '-80px' }} duration={7} delay={1} color="#6366f1" />
        <Blob style={{ width: 300, height: 300, top: '40%', left: '60%' }} duration={9} delay={2} color="#818cf8" />

        {/* Floating icons */}
        <FloatIcon style={{ top: '10%', left: '5%', width: 80 }} duration={6} delay={0}>{Icons.pin}</FloatIcon>
        <FloatIcon style={{ top: '8%', right: '7%', width: 96 }} duration={7} delay={1.2}>{Icons.ballot}</FloatIcon>
        <FloatIcon style={{ bottom: '20%', left: '8%', width: 70 }} duration={5.5} delay={0.6}>{Icons.star}</FloatIcon>
        <FloatIcon style={{ bottom: '18%', right: '5%', width: 88 }} duration={6.5} delay={1.8}>{Icons.check}</FloatIcon>

        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex justify-between items-center px-8 py-5 max-w-7xl mx-auto w-full"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_DARK})` }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">VoterAssist</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#how" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border"
                style={{ background: `rgba(99,102,241,0.09)`, borderColor: `rgba(99,102,241,0.25)`, color: INDIGO }}>
                🗳 Election 2026 — Be Ready
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-6xl sm:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
              Your Voice,{' '}
              <span className="relative inline-block" style={{ color: INDIGO }}>
                Simplified.
                <motion.div
                  className="absolute -bottom-2 left-0 h-1.5 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${INDIGO}, ${INDIGO_LIGHT})` }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.9, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p variants={fadeUp} className="text-xl sm:text-2xl text-slate-500 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
              From <span className="text-slate-700 font-medium">eligible citizen</span> to{' '}
              <span className="text-slate-700 font-medium">confident voter</span> — guided in four steps.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={onGetStarted}
                style={{ background: `linear-gradient(135deg, ${RED_CTA}, #c92c37)`, boxShadow: `0 8px 24px rgba(226,55,68,0.35)` }}
                className="px-10 py-4 rounded-2xl text-white text-lg font-bold tracking-wide focus:outline-none"
                animate={{ boxShadow: ['0 8px 24px rgba(226,55,68,0.3)', '0 8px 38px rgba(226,55,68,0.55)', '0 8px 24px rgba(226,55,68,0.3)'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.06, boxShadow: '0 16px 44px rgba(226,55,68,0.6)' }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started →
              </motion.button>
              <a href="#how" className="text-slate-500 hover:text-indigo-600 font-medium text-base transition-colors flex items-center gap-1.5">
                ↓ See how it works
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="mt-20 flex flex-wrap items-center justify-center gap-12 text-center"
          >
            {[['4 Steps', 'Simple Process'], ['100%', 'Free to Use'], ['24/7', 'AI Guidance']].map(([val, lbl]) => (
              <div key={val}>
                <div className="text-3xl font-black" style={{ color: INDIGO }}>{val}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">{lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="relative z-10 flex justify-center pb-8">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ color: INDIGO_LIGHT }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how" className="py-28 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
              style={{ background: `rgba(99,102,241,0.08)`, borderColor: `rgba(99,102,241,0.2)`, color: INDIGO }}>
              The Process
            </span>
            <h2 className="text-5xl font-black text-slate-900 mb-4">How it works</h2>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">Four guided stages. Each one builds on the last — designed so no voter gets left behind.</p>
          </Reveal>

          {/* Step cards with alternating layout */}
          <div className="space-y-16">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={0.1}>
                <div className={`flex flex-col md:flex-row items-center gap-10 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Number & icon block */}
                  <motion.div
                    className="flex-shrink-0 w-48 h-48 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${INDIGO}, ${INDIGO_DARK})` }}
                    whileHover={{ scale: 1.04, rotate: i % 2 === 0 ? 3 : -3 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="text-5xl">{step.icon}</div>
                    <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Step {step.num}</span>
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="text-8xl font-black opacity-5 text-slate-900 leading-none mb-2 select-none">{step.num}</div>
                    <h3 className="text-3xl font-black text-slate-900 -mt-6 mb-3">{step.title}</h3>
                    <p className="text-lg text-slate-500 leading-relaxed max-w-lg">{step.desc}</p>
                    <motion.button
                      onClick={() => onGetStarted(i)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl border transition-all"
                      style={{ color: INDIGO, borderColor: `rgba(99,102,241,0.3)`, background: `rgba(99,102,241,0.05)` }}
                      whileHover={{ scale: 1.03, background: `rgba(99,102,241,0.12)` }}
                    >
                      Start this step →
                    </motion.button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES GRID ══════════════ */}
      <section id="features" className="py-28 px-6" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border"
              style={{ background: `rgba(99,102,241,0.08)`, borderColor: `rgba(99,102,241,0.2)`, color: INDIGO }}>
              Why VoterAssist
            </span>
            <h2 className="text-5xl font-black text-slate-900 mb-4">Built for every voter</h2>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">Simple, private, and always available. Here is what sets us apart.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <motion.div
                  className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm h-full"
                  whileHover={{ y: -6, shadow: '0 20px 40px rgba(99,102,241,0.12)', borderColor: `rgba(99,102,241,0.3)` }}
                  transition={{ type: 'spring', stiffness: 250 }}
                >
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA BANNER ══════════════ */}
      <section className="py-24 px-6" style={{ background: `linear-gradient(135deg, ${INDIGO_DARK} 0%, ${INDIGO} 100%)` }}>
        <Reveal className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-5 leading-tight">Ready to make your vote count?</h2>
          <p className="text-indigo-200 text-xl mb-10">Join thousands of citizens who used VoterAssist to navigate the election process with confidence.</p>
          <motion.button
            onClick={onGetStarted}
            style={{ background: RED_CTA, boxShadow: `0 10px 30px rgba(226,55,68,0.45)` }}
            className="px-12 py-5 rounded-2xl text-white text-xl font-bold tracking-wide"
            animate={{ boxShadow: ['0 10px 30px rgba(226,55,68,0.4)', '0 10px 45px rgba(226,55,68,0.65)', '0 10px 30px rgba(226,55,68,0.4)'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06, boxShadow: '0 16px 50px rgba(226,55,68,0.7)' }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started — It's Free →
          </motion.button>
        </Reveal>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="py-8 px-6 text-center bg-white border-t border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-4">
          <span className="text-slate-400 text-sm">© 2026 VoterAssist. Your voice matters.</span>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-700 text-[10px] font-bold uppercase tracking-widest">Verified Information</span>
          </div>
        </div>
      </footer>

    </motion.div>
  );
}
