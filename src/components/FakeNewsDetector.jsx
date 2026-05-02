import { useState } from 'react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const EXAMPLES = [
  "EVMs are hacked remotely by satellites before elections.",
  "Voters must bring 3 ID proofs on election day or they cannot vote.",
  "India's election commission postponed all elections indefinitely.",
];

const VERDICT_CONFIG = {
  VERIFIED: { color: 'text-green-400', bg: 'bg-green-900/30 border-green-700', icon: '✅', label: 'Verified' },
  MISLEADING: { color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-700', icon: '⚠️', label: 'Misleading' },
  FAKE: { color: 'text-red-400', bg: 'bg-red-900/30 border-red-700', icon: '❌', label: 'Fake / False' },
};

export default function FakeNewsDetector() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (text) => {
    const query = text || input;
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are an Indian election fact-checker. Analyze this claim and respond ONLY with valid JSON in this exact format:
{"verdict": "VERIFIED" | "MISLEADING" | "FAKE", "confidence": 0-100, "explanation": "One sentence explanation.", "source": "Cite ECI, Constitution, or general knowledge."}

Claim: "${query}"`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompt }], temperature: 0.1 })
      });
      const data = await response.json();
      const raw = data.choices[0].message.content;
      const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);
      setResult(parsed);
    } catch {
      setResult({ verdict: 'MISLEADING', confidence: 50, explanation: 'Unable to verify — please check official ECI sources.', source: 'voters.eci.gov.in' });
    } finally {
      setLoading(false);
    }
  };

  const config = result ? VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.MISLEADING : null;

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🔍</span>
        <div>
          <h3 className="text-white font-extrabold text-lg">AI Fake News Detector</h3>
          <p className="text-slate-400 text-xs">Paste any election-related claim or WhatsApp forward to fact-check it instantly.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && analyze()}
          placeholder="e.g. 'EVMs can be hacked remotely...'"
          className="flex-1 bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => analyze()}
          disabled={loading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? '⏳ Analyzing...' : 'Check Claim'}
        </button>
      </div>

      {/* Example Claims */}
      <div className="flex flex-wrap gap-2 mb-4">
        <p className="text-slate-500 text-xs w-full">Try an example:</p>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => { setInput(ex); analyze(ex); }}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-3 py-1.5 rounded-full transition-colors text-left"
          >
            {ex.length > 50 ? ex.slice(0, 50) + '…' : ex}
          </button>
        ))}
      </div>

      {/* Result */}
      {result && config && (
        <div className={`rounded-xl border p-4 ${config.bg}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <span className={`font-extrabold text-lg ${config.color}`}>{config.label}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-xs">Confidence:</span>
              <span className={`font-bold text-sm ${config.color}`}>{result.confidence}%</span>
            </div>
          </div>
          <p className="text-slate-200 text-sm mb-2">{result.explanation}</p>
          <p className="text-slate-400 text-xs">📚 Source: {result.source}</p>
        </div>
      )}
    </div>
  );
}
