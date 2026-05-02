import { useState, useRef, useEffect } from 'react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const QUICK_REPLIES = [
  { id: 'eligible', text: 'Am I eligible to vote?' },
  { id: 'register', text: 'How do I register?' },
  { id: 'id_needed', text: 'What ID is needed?' }
];

export default function Chatbot({ context }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hi there! I am your AI VoterAssist Guide. How can I help you prepare for the election today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('English');
  const messagesEndRef = useRef(null);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a voice that matches the language
      if (language === 'Hindi') utterance.lang = 'hi-IN';
      else if (language === 'Telugu') utterance.lang = 'te-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const askAI = async (userText) => {
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);
    setInputValue('');

    try {
      const systemPrompt = `You are the VoterAssist AI Guide. Your job is to help Indian citizens navigate the voting process. 
      Be concise, friendly, and non-partisan. Format your responses using plain text (no markdown if possible to keep it clean, or just simple paragraphs). 
      Key facts:
      - Voting age is 18+.
      - Forms: Form 6 is for new voters.
      - Official site: voters.eci.gov.in.
      Keep answers short and directly to the point.
      
      User Context:
      - Overall Voter Readiness: ${context?.readiness || 0}%
      - Current Step: ${['Eligibility', 'Registration', 'Preparation', 'Voting Day'][context?.activeStep || 0]}
      
      CRITICAL INSTRUCTION: You MUST respond exclusively in ${language}. If the language is not English, translate your response naturally. Use this context to personalize your responses.`;

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
            { role: 'user', content: userText }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const text = data.choices[0].message.content;

      setMessages(prev => [...prev, { sender: 'assistant', text: text }]);
      speakText(text); // Auto-read the response
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { sender: 'assistant', text: 'Sorry, I am having trouble connecting to my servers. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (replyText) => {
    askAI(replyText);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    askAI(inputValue.trim());
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start pointer-events-none">
      
      {/* Expanded Chat Window */}
      <div 
        className={`mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 origin-bottom-left pointer-events-auto flex flex-col ${
          isOpen ? 'scale-100 opacity-100 h-[450px]' : 'scale-0 opacity-0 h-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-primary-900 px-4 py-3 flex justify-between items-center text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary-900 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">VoterAssist AI</h3>
              <p className="text-primary-200 text-xs">Powered by Groq</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="language-select" className="sr-only">Select Language</label>
            <select 
              id="language-select"
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-primary-800 text-xs text-white border border-primary-700 rounded px-1 py-0.5 focus:outline-none"
              aria-label="Language selection for Voice Assistant"
            >
              <option value="English">ENG</option>
              <option value="Hindi">HIN</option>
              <option value="Telugu">TEL</option>
            </select>
            <button 
              onClick={toggleChat} 
              className="text-primary-200 hover:text-white transition-colors focus:outline-none"
              aria-label="Close Chatbot"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-sm shadow-sm' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm'
                }`}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-500 border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 py-2 bg-slate-50 flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply.id}
                onClick={() => handleQuickReply(reply.text)}
                className="px-3 py-1.5 bg-white hover:bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium rounded-full transition-colors shadow-sm"
              >
                {reply.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="chatbot-input" className="sr-only">Ask your question</label>
            <input
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all disabled:opacity-50"
              aria-label="Chatbot input field"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:bg-slate-300"
              aria-label="Send message"
            >
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button 
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 pointer-events-auto ${
          isOpen ? 'bg-slate-800 hover:bg-slate-900' : 'bg-primary-600 hover:bg-primary-700 hover:scale-105'
        }`}
        aria-label={isOpen ? "Close chat window" : "Open VoterAssist chat window"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
