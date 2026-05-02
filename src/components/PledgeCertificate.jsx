import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

export default function PledgeCertificate() {
  const [name, setName] = useState('');
  const [hasPledged, setHasPledged] = useState(false);
  const [date] = useState(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [globalPledges, setGlobalPledges] = useState(12845); // Fallback mock starting number

  useEffect(() => {
    const fetchPledges = async () => {
      try {
        const docRef = doc(db, "stats", "global");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().pledgeCount) {
          setGlobalPledges(docSnap.data().pledgeCount);
        }
      } catch (e) {
        // Fallback to local mock data if Firebase keys aren't set
        console.log("Firebase using local mock data for hackathon presentation.");
      }
    };
    fetchPledges();
  }, []);

  const handlePledge = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      setHasPledged(true);
      setGlobalPledges(prev => prev + 1);
      try {
        const docRef = doc(db, "stats", "global");
        await setDoc(docRef, { pledgeCount: increment(1) }, { merge: true });
      } catch (e) {
        // Ignore firebase errors on mock usage
      }
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-700 shadow-xl overflow-hidden relative">
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
          <span className="text-4xl">📜</span> Pledge to Vote
        </h2>
        <p className="text-slate-400 text-sm mt-2">Commit to democracy. Generate your official digital pledge certificate.</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-yellow-900/30 border border-yellow-700/50 text-yellow-500 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          Join {globalPledges.toLocaleString()} Voters Who Have Pledged
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!hasPledged ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handlePledge}
            className="max-w-md mx-auto flex flex-col gap-4 relative z-10"
          >
            <div>
              <label htmlFor="pledgeName" className="block text-sm font-medium text-slate-300 mb-1">
                Enter your full name to sign the pledge:
              </label>
              <input
                type="text"
                id="pledgeName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-center text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-yellow-950 font-extrabold px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
            >
              Take the Pledge
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="certificate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl mx-auto"
          >
            {/* The Certificate Paper */}
            <div className="bg-[#fdfbf7] p-2 rounded shadow-2xl relative overflow-hidden">
              {/* Decorative Border */}
              <div className="border-[8px] border-double border-yellow-800/80 p-8 sm:p-12 relative flex flex-col items-center text-center h-full">
                
                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-800/60 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-800/60 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-800/60 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-800/60 rounded-br-lg"></div>

                <p className="text-yellow-800/70 text-xs font-bold uppercase tracking-[0.3em] mb-2">VoterAssist Official Document</p>
                
                <h3 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 font-serif" style={{ letterSpacing: '-0.02em' }}>
                  Certificate of Commitment
                </h3>

                <p className="text-slate-600 italic mb-4">This certifies that</p>
                
                {/* The Name */}
                <h4 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-4 border-b-2 border-slate-300 pb-2 px-8 inline-block" style={{ fontFamily: 'Georgia, serif' }}>
                  {name}
                </h4>

                <p className="text-slate-700 max-w-md mx-auto mb-10 leading-relaxed font-serif">
                  Has solemnly pledged to uphold the democratic values of the nation by actively participating in the electoral process and casting their vote responsibly.
                </p>

                <div className="w-full flex justify-between items-end px-4 sm:px-10 mt-auto">
                  {/* Date */}
                  <div className="text-left flex flex-col items-center">
                    <span className="text-slate-800 font-medium font-serif border-b border-slate-400 pb-1 px-4">{date}</span>
                    <span className="text-slate-500 text-xs uppercase mt-1 tracking-widest">Date of Pledge</span>
                  </div>

                  {/* Mock Gold Seal */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 rounded-full flex items-center justify-center shadow-lg border border-yellow-200">
                      <div className="w-16 h-16 rounded-full border border-yellow-700/30 flex items-center justify-center">
                        <span className="text-yellow-950 font-black text-xs text-center leading-none">DEMOCRACY<br/>VERIFIED</span>
                      </div>
                    </div>
                    {/* Ribbon tails */}
                    <div className="absolute -bottom-4 w-4 h-8 bg-red-700 -rotate-12 translate-x-4 -z-10 shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                    <div className="absolute -bottom-4 w-4 h-8 bg-red-800 rotate-12 -translate-x-4 -z-10 shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>
                  </div>

                  {/* Signature */}
                  <div className="text-right flex flex-col items-center">
                    <span className="text-slate-800 font-medium font-serif border-b border-slate-400 pb-1 px-4" style={{ fontFamily: "'Brush Script MT', cursive", fontSize: '1.5rem' }}>VoterAssist</span>
                    <span className="text-slate-500 text-xs uppercase mt-1 tracking-widest">Official Platform</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setHasPledged(false)}
                className="text-slate-400 hover:text-white text-sm underline transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
