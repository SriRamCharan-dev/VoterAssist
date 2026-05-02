import { useState } from 'react';
import { motion } from 'framer-motion';

const FLASHCARDS = [
  {
    id: 1,
    icon: '🛂',
    question: 'Lost your Voter ID?',
    answer: 'You can still vote! Bring your Passport, Driving License, PAN Card, or Aadhaar Card instead.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    icon: '⏳',
    question: 'Working on Election Day?',
    answer: 'By law, employers must grant registered voters a paid day off or adequate time to vote.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    icon: '🛑',
    question: 'Name not on the list?',
    answer: 'You cannot vote if your name is missing from the electoral roll, even if you have an ID. Check online early!',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 4,
    icon: '🤫',
    question: 'Pressured to vote?',
    answer: 'Your vote is 100% secret. You have the absolute right to keep your choice private from anyone.',
    color: 'from-violet-500 to-purple-500'
  }
];

function Card({ data }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-48 cursor-pointer" 
      style={{ perspective: 1000 }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d shadow-lg rounded-2xl"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of Card */}
        <div 
          className={`absolute w-full h-full backface-hidden rounded-2xl bg-gradient-to-br ${data.color} p-6 flex flex-col items-center justify-center text-center`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl mb-3 drop-shadow-md">{data.icon}</span>
          <h3 className="text-white font-extrabold text-lg leading-tight text-balance shadow-black/20 text-shadow-sm">
            {data.question}
          </h3>
          <p className="text-white/80 text-xs mt-3 uppercase tracking-widest font-bold">Hover to flip ⤵</p>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-2xl bg-slate-800 border-2 border-slate-600 p-6 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-slate-200 text-sm font-medium leading-relaxed">
            {data.answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RightsFlashcards() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-700">
      <div className="text-center mb-8">
        <span className="inline-block bg-teal-900/50 border border-teal-700 text-teal-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
          Voter Education
        </span>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Know Your Rights
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
          Hover or tap on these cards to reveal crucial election day rules every citizen should know.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FLASHCARDS.map((card) => (
          <Card key={card.id} data={card} />
        ))}
      </div>
    </div>
  );
}
