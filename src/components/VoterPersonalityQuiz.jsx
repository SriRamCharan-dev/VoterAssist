import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    text: 'What issue matters most to you when you vote?',
    options: ['Education', 'Healthcare', 'Infrastructure', 'Jobs & Economy']
  },
  {
    id: 2,
    text: 'How do you prefer to receive election information?',
    options: ['Social Media', 'News Channels', 'Government Websites', 'Friends & Family']
  },
  {
    id: 3,
    text: 'Which of these values best describes you?',
    options: ['Progressive', 'Traditional', 'Balanced', 'Pragmatic']
  },
  {
    id: 4,
    text: 'How often do you discuss politics?',
    options: ['Every day', 'Weekly', 'Occasionally', 'Rarely']
  },
  {
    id: 5,
    text: 'What would make you feel more confident about voting?',
    options: ['Clear candidate info', 'Simplified ballot', 'Local events', 'AI assistance']
  }
];

const PERSONALITIES = [
  { label: 'The Informed Analyst', badge: '🧠', description: 'You love data and research. You’ll dive deep into manifestos before casting your vote.' },
  { label: 'The Community Advocate', badge: '🤝', description: 'You prioritize community welfare and seek candidates who support local initiatives.' },
  { label: 'The Future‑Focused Visionary', badge: '🚀', description: 'You care about long‑term growth, tech, and progressive policies.' },
  { label: 'The Practical Pragmatist', badge: '⚙️', description: 'You want concrete solutions that work today; you value clear, actionable promises.' }
];

export default function VoterPersonalityQuiz() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const handleSelect = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const calculateResult = () => {
    // Simple deterministic pseudo‑logic: count which option group appears most
    // Map each answer index to a personality index (0‑3) for demo purposes.
    const mapping = {
      0: 0, // Education → Analyst
      1: 1, // Healthcare → Advocate
      2: 2, // Infrastructure → Visionary
      3: 3  // Jobs → Pragmatist
    };
    const counts = [0, 0, 0, 0];
    Object.values(answers).forEach(answer => {
      const idx = QUESTIONS[0].options.indexOf(answer);
      if (idx !== -1) counts[mapping[idx]]++;
    });
    const maxIdx = counts.indexOf(Math.max(...counts));
    setResult(PERSONALITIES[maxIdx]);
  };

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
      <h3 className="text-2xl font-extrabold text-slate-900 mb-4 text-center">🧩 Voter Personality Quiz</h3>
      <p className="text-slate-600 text-sm mb-6 text-center">Answer a few quick questions and discover your voting persona.</p>

      <AnimatePresence>
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-3 text-lg font-medium">
              {result.badge} {result.label}
            </div>
            <p className="text-slate-700 text-base">{result.description}</p>
            <button
              onClick={() => setResult(null)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-sm rounded"
            >
              Take Quiz Again
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {QUESTIONS.map(q => (
              <div key={q.id} className="mb-5">
                <p className="font-medium text-slate-800 mb-2">{q.id}. {q.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`px-3 py-1 rounded text-sm border transition-colors ${answers[q.id] === opt ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center mt-4">
              <button
                disabled={!allAnswered}
                onClick={calculateResult}
                className={`px-5 py-2 rounded-md font-semibold ${allAnswered ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-300 text-slate-600 cursor-not-allowed'}`}
              >
                Get My Personality
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
