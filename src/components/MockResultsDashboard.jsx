import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const INITIAL_VOTES = [
  { id: 1, symbol: '🌸', name: 'Candidate A', party: 'National Progress Party', color: '#6366f1', votes: 31200 },
  { id: 2, symbol: '🌾', name: 'Candidate B', party: "People's Alliance", color: '#10b981', votes: 28400 },
  { id: 3, symbol: '⭐', name: 'Candidate C', party: 'United Front Party', color: '#f59e0b', votes: 22100 },
  { id: 4, symbol: '🔥', name: 'Candidate D', party: 'Democratic Reform Party', color: '#ef4444', votes: 18300 },
];

export default function MockResultsDashboard() {
  const [data, setData] = useState(INITIAL_VOTES);
  const [totalCast, setTotalCast] = useState(100000);
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLive) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setData(prev => prev.map(c => ({
        ...c,
        votes: c.votes + Math.floor(Math.random() * 120)
      })));
      setTotalCast(prev => prev + Math.floor(Math.random() * 400));
    }, 1500);
    return () => clearInterval(intervalRef.current);
  }, [isLive]);

  const totalVotes = data.reduce((s, c) => s + c.votes, 0);
  const sorted = [...data].sort((a, b) => b.votes - a.votes);
  const turnout = ((totalCast / 250000) * 100).toFixed(1);

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="text-white font-extrabold text-lg">Live Mock Results</h3>
            <p className="text-slate-400 text-xs">Demo Nagar Constituency — Simulated Data</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: isLive ? [1, 0.3, 1] : 0.3 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <span className="text-xs text-slate-400">{isLive ? 'LIVE' : 'PAUSED'}</span>
          <button
            onClick={() => setIsLive(l => !l)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${isLive ? 'border-red-600 text-red-400 hover:bg-red-900/30' : 'border-green-600 text-green-400 hover:bg-green-900/30'}`}
          >
            {isLive ? '⏸ Pause' : '▶ Resume'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Votes Cast', value: totalCast.toLocaleString(), icon: '🗳️' },
          { label: 'Voter Turnout', value: `${turnout}%`, icon: '📈' },
          { label: 'Counting Rounds', value: sorted[0]?.name.split(' ')[1] || 'A', icon: '👑' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
            <p className="text-xl mb-1">{s.icon}</p>
            <p className="text-white font-bold text-sm">{s.value}</p>
            <p className="text-slate-400 text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Results Bars */}
      <div className="space-y-4">
        {sorted.map((c, idx) => {
          const pct = ((c.votes / totalVotes) * 100).toFixed(1);
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {idx === 0 && <span className="text-xs bg-yellow-500 text-black font-bold px-1.5 py-0.5 rounded">LEADING</span>}
                  <span className="text-lg">{c.symbol}</span>
                  <div>
                    <p className="text-white text-sm font-bold leading-tight">{c.name}</p>
                    <p className="text-slate-400 text-xs">{c.party}</p>
                  </div>
                </div>
                <div className="text-right">
                  <motion.p
                    key={c.votes}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    className="text-white font-bold text-sm"
                  >
                    {c.votes.toLocaleString()}
                  </motion.p>
                  <p className="text-slate-400 text-xs">{pct}%</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-3 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-slate-600 text-xs text-center mt-4">⚠️ This is simulated data for demonstration purposes only.</p>
    </div>
  );
}
