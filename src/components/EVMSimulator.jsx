import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CANDIDATES = [
  { id: 1, symbol: '🌸', name: 'Candidate A', party: 'National Progress Party', serial: '01' },
  { id: 2, symbol: '🌾', name: 'Candidate B', party: "People's Alliance", serial: '02' },
  { id: 3, symbol: '⭐', name: 'Candidate C', party: 'United Front Party', serial: '03' },
  { id: 4, symbol: '🔥', name: 'Candidate D', party: 'Democratic Reform Party', serial: '04' },
];

const STEPS = { IDLE: 'IDLE', VOTING: 'VOTING', SLIP_PRINTING: 'SLIP_PRINTING', DONE: 'DONE' };

// --- Professional EVM Sound Engine using Web Audio API ---
const playEVMBeep = (type = 'button') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'button') {
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } else if (type === 'confirm') {
      // Two-tone confirmation beep
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.35);
    } else if (type === 'enable') {
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.35);
    } else if (type === 'success') {
      // Celebratory ascending tone
      const freqs = [523, 659, 784, 1047];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
        g.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.2);
        o.start(ctx.currentTime + i * 0.12);
        o.stop(ctx.currentTime + i * 0.12 + 0.2);
      });
    }
  } catch (e) { /* Audio not supported */ }
};

export default function EVMSimulator() {
  const [phase, setPhase] = useState(STEPS.IDLE);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [showSlip, setShowSlip] = useState(false);
  const [showBooth, setShowBooth] = useState(false);

  const handleEnterBooth = () => {
    playEVMBeep('enable');
    setShowBooth(true);
    setTimeout(() => setPhase(STEPS.VOTING), 800);
  };

  const handleCandidatePress = useCallback((candidate) => {
    if (phase !== STEPS.VOTING || confirming) return;
    playEVMBeep('button');
    setConfirming(candidate.id);
    setTimeout(() => {
      playEVMBeep('confirm');
      setSelected(candidate);
      setConfirming(null);
      setPhase(STEPS.SLIP_PRINTING);
      setTimeout(() => {
        setShowSlip(true);
        setTimeout(() => {
          playEVMBeep('success');
          setPhase(STEPS.DONE);
        }, 2500);
      }, 1000);
    }, 700);
  }, [phase, confirming]);

  const handleReset = () => {
    setPhase(STEPS.IDLE);
    setSelected(null);
    setConfirming(null);
    setShowSlip(false);
    setShowBooth(false);
  };

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700">

      {/* === BOOTH ENVIRONMENT === */}
      <AnimatePresence mode="wait">
        {!showBooth ? (
          /* --- Outside View --- */
          <motion.div
            key="outside"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center gap-6 p-10 text-center overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)' }}
          >
            {/* Ambient glow */}
            <div className="absolute w-64 h-64 bg-indigo-900 opacity-30 rounded-full blur-3xl top-10 left-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Polling Station Sign */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-800 border-2 border-blue-500 rounded-xl px-8 py-4 shadow-lg"
            >
              <div className="flex items-center gap-3 justify-center mb-1">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <p className="text-blue-200 text-[10px] uppercase tracking-widest font-bold">Election Commission of India</p>
                  <p className="text-white text-lg font-extrabold tracking-wide">POLLING STATION</p>
                </div>
                <span className="text-2xl">🇮🇳</span>
              </div>
              <p className="text-blue-300 text-xs text-center">Booth No. 42 | Constituency: Demo Nagar</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <p className="text-slate-300 text-sm mb-1">Your finger is inked. You are verified.</p>
              <p className="text-slate-500 text-xs">Enter the voting booth to cast your vote.</p>
            </motion.div>

            <motion.button
              onClick={handleEnterBooth}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2"
            >
              🚪 Enter Voting Booth
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1 }}>→</motion.span>
            </motion.button>
          </motion.div>

        ) : (
          /* --- Inside Booth View --- */
          <motion.div
            key="inside"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center gap-6 p-6 sm:p-10"
            style={{
              background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #1e293b 100%)',
              minHeight: '580px',
            }}
          >
            {/* Booth Curtains — Left & Right */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-1/2 h-full bg-red-900 z-10 origin-left"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, #7f1d1d 0px, #991b1b 20px, #7f1d1d 40px)' }}
            />
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-1/2 h-full bg-red-900 z-10 origin-right"
              style={{ backgroundImage: 'repeating-linear-gradient(to left, #7f1d1d 0px, #991b1b 20px, #7f1d1d 40px)' }}
            />

            {/* Overhead Light Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-yellow-200 opacity-30 blur-2xl rounded-full" />

            {/* Booth Interior Header */}
            <div className="text-center z-20">
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-1">Voting Booth — Private</p>
              <p className="text-slate-400 text-xs">
                {phase === STEPS.VOTING ? '🟢 Select your candidate and press the button' :
                 phase === STEPS.SLIP_PRINTING ? '🟡 Recording your vote...' :
                 phase === STEPS.DONE ? '✅ Vote Cast Successfully' : ''}
              </p>
            </div>

            {/* EVM Table Surface */}
            <div
              className="w-full max-w-2xl z-20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-6"
              style={{ background: 'rgba(30, 27, 75, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              {/* === BALLOT UNIT === */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Ballot Unit</p>
                <div className="w-64 bg-slate-800 rounded-2xl shadow-2xl border-4 border-slate-600 overflow-hidden">
                  <div className="bg-indigo-900 py-2 px-4 text-center border-b border-indigo-700">
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Election Commission of India</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2 bg-slate-900 border-b border-slate-700">
                    <motion.div
                      className={`w-3 h-3 rounded-full ${phase === STEPS.VOTING ? 'bg-green-400' : phase === STEPS.DONE ? 'bg-green-600' : 'bg-red-500'}`}
                      animate={{ opacity: phase === STEPS.VOTING ? [1, 0.3, 1] : 1 }}
                      transition={{ repeat: phase === STEPS.VOTING ? Infinity : 0, duration: 0.8 }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      {phase === STEPS.VOTING ? 'ACTIVE — CAST YOUR VOTE' : phase === STEPS.DONE ? 'VOTE RECORDED' : 'LOCKED'}
                    </span>
                  </div>

                  <div className="p-3 space-y-2">
                    {CANDIDATES.map((c) => (
                      <motion.button
                        key={c.id}
                        disabled={phase !== STEPS.VOTING}
                        onClick={() => handleCandidatePress(c)}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                          confirming === c.id
                            ? 'bg-yellow-400 border-yellow-500 shadow-yellow-400/50 shadow-lg'
                            : selected?.id === c.id && phase !== STEPS.VOTING
                            ? 'bg-green-700 border-green-500'
                            : phase === STEPS.VOTING
                            ? 'bg-slate-700 border-slate-500 hover:bg-indigo-800 hover:border-indigo-500 cursor-pointer'
                            : 'bg-slate-800 border-slate-700 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-slate-400 w-4">{c.serial}</span>
                        <span className="text-xl">{c.symbol}</span>
                        <div className="flex-1 text-left">
                          <p className="text-white font-bold text-xs">{c.name}</p>
                          <p className="text-slate-400 text-[10px]">{c.party}</p>
                        </div>
                        <motion.div
                          animate={{
                            backgroundColor: confirming === c.id ? '#FBBF24' :
                              (selected?.id === c.id && phase !== STEPS.VOTING) ? '#22c55e' : '#374151',
                            boxShadow: confirming === c.id ? '0 0 12px #FBBF24' : 'none',
                          }}
                          className="w-8 h-8 rounded-full border-2 border-slate-500 flex items-center justify-center flex-shrink-0"
                        >
                          {selected?.id === c.id && phase !== STEPS.VOTING && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs font-black">✓</motion.span>
                          )}
                        </motion.div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* === VVPAT UNIT === */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">VVPAT Unit</p>
                <div className="w-44 bg-slate-800 rounded-2xl border-4 border-slate-600 overflow-hidden shadow-2xl">
                  <div className="bg-amber-900 py-2 px-3 text-center border-b border-amber-800">
                    <p className="text-[9px] text-amber-200 font-bold uppercase tracking-wider">Voter Verified Paper Audit Trail</p>
                  </div>
                  <div className="mx-3 my-2 h-36 bg-black rounded-lg border border-slate-600 overflow-hidden relative flex flex-col items-center justify-center">
                    <AnimatePresence>
                      {showSlip && selected && (
                        <motion.div
                          initial={{ y: '-110%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-0 bg-amber-50 flex flex-col items-center justify-center p-2 gap-1"
                        >
                          <p className="text-gray-500 text-[8px] font-mono border-b border-dashed border-gray-300 pb-1 w-full text-center">ECI — VVPAT SLIP</p>
                          <span className="text-4xl my-1">{selected.symbol}</span>
                          <p className="text-gray-800 text-[9px] font-extrabold text-center leading-tight">{selected.name}</p>
                          <p className="text-gray-500 text-[7px] text-center">{selected.party}</p>
                          <div className="w-full border-t border-dashed border-gray-300 mt-1 pt-1">
                            <p className="text-red-500 text-[7px] text-center font-bold">Visible for 7 seconds only</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!showSlip && (
                      <p className="text-slate-600 text-[10px] text-center px-2">Slip appears here after voting</p>
                    )}
                  </div>
                  <div className="relative mx-4 mb-3">
                    <div className="h-3 bg-slate-900 rounded border border-slate-600 flex items-center justify-center overflow-hidden">
                      <AnimatePresence>
                        {showSlip && (
                          <motion.div
                            initial={{ y: '-100%' }}
                            animate={{ y: '0%' }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="w-10 h-2 bg-amber-100 rounded"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-[8px] text-slate-600 text-center mt-0.5">Paper Exit Slot</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SUCCESS SCREEN */}
            <AnimatePresence>
              {phase === STEPS.DONE && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', bounce: 0.45, delay: 0.3 }}
                  className="w-full max-w-md bg-gradient-to-br from-green-700 to-emerald-500 rounded-2xl p-6 text-center shadow-2xl z-20"
                >
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-5xl mb-2"
                  >🎉</motion.div>
                  <h3 className="text-white font-extrabold text-xl">Vote Cast Successfully!</h3>
                  <p className="text-green-100 text-sm mt-1">
                    You voted for <strong>{selected?.name}</strong>
                  </p>
                  <p className="text-green-200 text-xs mt-2 px-4">
                    In the real booth, your vote is completely secret. This simulation reveals it only for educational purposes.
                  </p>
                  <div className="mt-4 flex gap-3 justify-center">
                    <button
                      onClick={handleReset}
                      className="bg-white text-green-700 font-bold px-6 py-2 rounded-xl hover:bg-green-50 transition-colors text-sm shadow"
                    >
                      ↺ Vote Again
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Hint */}
            {phase === STEPS.VOTING && (
              <p className="text-indigo-400 text-xs text-center z-20">
                🔒 This is a private booth. Press a candidate button on the EVM to vote.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
