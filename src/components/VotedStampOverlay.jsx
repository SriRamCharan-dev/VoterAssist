import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const playStampSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Thud/stamp sound
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(1.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();

    // Victory ascending chord after thud
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f;
      g.gain.setValueAtTime(0.18, ctx.currentTime + 0.3 + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3 + i * 0.1 + 0.25);
      o.start(ctx.currentTime + 0.3 + i * 0.1);
      o.stop(ctx.currentTime + 0.3 + i * 0.1 + 0.25);
    });
  } catch (e) {}
};

export default function VotedStampOverlay({ show, onDismiss }) {
  useEffect(() => {
    if (show) {
      playStampSound();
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          {/* Ink Splash Background */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 0.3, 0.15] }}
            transition={{ duration: 0.5, times: [0, 0.4, 1] }}
            className="absolute w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, #1d4ed8, transparent)' }}
          />

          {/* Main Stamp */}
          <motion.div
            initial={{ scale: 3, rotate: -15, opacity: 0 }}
            animate={{ scale: [3, 0.9, 1.05, 1], rotate: [-15, 2, -1, 0], opacity: [0, 1, 1, 1] }}
            transition={{ duration: 0.5, times: [0, 0.4, 0.7, 1], ease: 'easeOut' }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Stamp Border */}
            <div
              className="flex flex-col items-center justify-center gap-1 px-14 py-8 rounded-sm"
              style={{
                border: '8px solid #1d4ed8',
                borderRadius: '4px',
                boxShadow: '0 0 0 3px rgba(29,78,216,0.3), 0 0 60px rgba(29,78,216,0.5)',
                background: 'rgba(29,78,216,0.15)',
                transform: 'rotate(-4deg)',
              }}
            >
              {/* Ink texture lines */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #1d4ed8 0px, transparent 1px, transparent 4px, #1d4ed8 5px)'
              }} />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-blue-200 text-xs font-bold uppercase tracking-[0.4em] z-10"
              >
                Election Commission of India
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: 'spring', bounce: 0.4 }}
                className="text-blue-100 text-6xl sm:text-7xl font-black tracking-tight z-10"
                style={{ textShadow: '0 0 20px rgba(147,197,253,0.8)' }}
              >
                VOTED
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="w-full h-1 bg-blue-400 my-1 z-10"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-blue-200 text-4xl font-black z-10"
              >✓</motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-blue-300 text-xs font-bold uppercase tracking-widest z-10"
              >
                Your Voice Matters
              </motion.p>
            </div>

            {/* Ink splatter dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 0.7, 0] }}
                transition={{ delay: 0.1, duration: 0.6, times: [0, 0.3, 1] }}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 120}%`,
                  left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 120}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </motion.div>

          {/* Click to dismiss hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 text-white text-sm opacity-60 pointer-events-auto cursor-pointer"
            onClick={onDismiss}
          >
            Click anywhere to continue →
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
