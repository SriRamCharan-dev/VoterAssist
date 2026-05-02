import { useState } from 'react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export default function AIPersonalizedPlan({ readiness, activeStep }) {
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const stepNames = ['Eligibility', 'Registration', 'Preparation', 'Voting Day'];
      const currentStepName = stepNames[activeStep];
      
      const systemPrompt = `You are an expert election strategist. Based on the user's progress, generate a highly personalized, 3-point action plan. Keep it extremely brief, encouraging, and formatted in clean HTML (just <ul> and <li> tags, no markdown backticks).
      
      User Context:
      - Readiness: ${readiness}%
      - Current Stage: ${currentStepName}`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "Generate my action plan." }
          ]
        })
      });

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      setPlan(data.choices[0].message.content);
    } catch (err) {
      setPlan("<ul><li>Unable to connect to AI server. Please try again later.</li></ul>");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            AI Personalized Action Plan
          </h3>
          {!plan && !loading && (
            <button 
              onClick={generatePlan}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-sm"
            >
              Generate Plan
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="flex items-center gap-3 text-indigo-100">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Analyzing your progress...
          </div>
        ) : plan ? (
          <div 
            className="prose prose-invert prose-sm max-w-none text-indigo-50"
            dangerouslySetInnerHTML={{ __html: plan }}
          />
        ) : (
          <p className="text-indigo-100 text-sm">
            Click generate to get a custom strategy tailored to your current voter readiness.
          </p>
        )}
      </div>
      
      {/* Decorative background */}
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
    </div>
  );
}
