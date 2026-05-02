import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Determine status relative to today (May 2026)
const today = new Date();
const getStatus = (endMonth /* 0-indexed */, year = 2026) => {
  const end = new Date(year, endMonth + 1, 0); // last day of endMonth
  const start = new Date(year, endMonth, 1);
  if (today > end) return 'done';
  if (today >= start && today <= end) return 'active';
  return 'upcoming';
};

const MILESTONES = [
  {
    id: 'voter-list',
    period: 'Jan – Feb 2026',
    title: 'Voter List Revision',
    description:
      'Check the draft electoral rolls and submit corrections or additions using Form 6/7/8 at your local BLO office.',
    icon: '📋',
    status: getStatus(1), // ends Feb → done by May
  },
  {
    id: 'notification',
    period: 'March 2026',
    title: 'Notification Release',
    description:
      'Watch for the official ECI election notification and confirm your name appears on the final voter list.',
    icon: '📢',
    status: getStatus(2), // ends March → done by May
  },
  {
    id: 'polling',
    period: 'April – May 2026',
    title: 'Polling Window',
    description:
      'Carry a valid photo ID to your designated booth, cast your vote, and collect your indelible ink mark.',
    icon: '🗳️',
    status: getStatus(4), // ends May → active in May
  },
  {
    id: 'results',
    period: 'June 2026',
    title: 'Results Day',
    description:
      'Follow the live count on the ECI results portal and verify that your constituency winner has been declared.',
    icon: '🏆',
    status: getStatus(5), // ends June → upcoming in May
  },
];

const STATUS_STYLES = {
  done: {
    dot: 'bg-emerald-500 border-emerald-300',
    glow: '',
    label: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    labelText: 'Completed',
    ring: '',
  },
  active: {
    dot: 'border-red-300',
    dotBg: '#E23744',
    glow: true,
    label: 'bg-red-50 text-[#E23744] border-red-200',
    labelText: 'In Progress',
    ring: true,
  },
  upcoming: {
    dot: 'bg-slate-300 border-slate-200',
    glow: '',
    label: 'bg-slate-50 text-slate-500 border-slate-200',
    labelText: 'Upcoming',
    ring: '',
  },
};

function TimelineDot({ status, index, inView }) {
  const s = STATUS_STYLES[status];
  return (
    <motion.div
      className="relative flex-shrink-0 flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.45, delay: 0.25 + index * 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer glow ring for active */}
      {status === 'active' && (
        <motion.div
          className="absolute w-10 h-10 rounded-full"
          style={{ background: '#E23744', opacity: 0.18 }}
          animate={{ scale: [1, 1.55, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      {/* Second pulse ring */}
      {status === 'active' && (
        <motion.div
          className="absolute w-7 h-7 rounded-full"
          style={{ background: '#E23744', opacity: 0.28 }}
          animate={{ scale: [1, 1.45, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
      )}

      {/* Core dot */}
      <div
        className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${status !== 'active' ? s.dot : 'border-red-300'}`}
        style={status === 'active' ? { background: '#E23744' } : {}}
      >
        {status === 'done' && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </motion.div>
  );
}

export default function ElectionTimeline() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-60px' });

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Card Header */}
      <div className="px-8 pt-8 pb-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Election Roadmap{' '}
            <span style={{ color: '#E23744' }}>2026</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Key phases of the electoral cycle — know where you stand.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
          style={{ background: 'rgba(226,55,68,0.07)', borderColor: 'rgba(226,55,68,0.2)', color: '#E23744' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Live Cycle
        </span>
      </div>

      {/* Timeline body */}
      <div className="px-8 py-8">
        <div className="relative">

          {/* Vertical track (background) */}
          <div
            className="absolute left-[9px] top-2.5 bottom-2.5 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #e2e8f0 0%, #f1f5f9 100%)' }}
          />

          {/* Animated fill line growing top → bottom */}
          <motion.div
            className="absolute left-[9px] top-2.5 w-0.5 rounded-full origin-top"
            style={{ background: 'linear-gradient(to bottom, #E23744, #94a3b8)' }}
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* We need an explicit height; we'll use a large value and the parent clips it */}
            <div style={{ height: `${(MILESTONES.length - 1) * 120}px` }} />
          </motion.div>

          {/* Milestones */}
          <div className="space-y-0">
            {MILESTONES.map((m, i) => {
              const s = STATUS_STYLES[m.status];
              const isLast = i === MILESTONES.length - 1;

              return (
                <motion.div
                  key={m.id}
                  className={`flex gap-6 ${!isLast ? 'pb-10' : ''}`}
                  initial={{ opacity: 0, x: -18 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Dot column */}
                  <div className="flex flex-col items-center" style={{ width: 20 }}>
                    <TimelineDot status={m.status} index={i} inView={inView} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-1">
                    {/* Period + badge */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold text-slate-400 tracking-wide">
                        {m.period}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.label}`}
                      >
                        {m.status === 'active' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        )}
                        {s.labelText}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-base font-bold mb-1 flex items-center gap-2"
                      style={{ color: m.status === 'active' ? '#E23744' : m.status === 'done' ? '#1e293b' : '#94a3b8' }}
                    >
                      <span>{m.icon}</span>
                      {m.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: m.status === 'upcoming' ? '#cbd5e1' : '#64748b' }}
                    >
                      {m.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="px-8 pb-6">
        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Dates are indicative and based on the Election Commission of India 2026 schedule.
        </p>
      </div>
    </div>
  );
}
