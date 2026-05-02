import { useState, useEffect } from 'react';
import DocumentVault from './DocumentVault';

const MOCK_MAP_DATA = {
  "110001": {
    name: "Parliament House Polling Booth, Delhi",
    distance: "0.8 km away",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.232386762394!2d77.20084055!3d28.6272522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd34c11438f7%3A0x6b86fbffc06df18a!2sParliament%20House!5e0!3m2!1sen!2sin!4v1689254848525!5m2!1sen!2sin"
  },
  "400001": {
    name: "Fort Convent High School, Mumbai",
    distance: "1.2 km away",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.80517594916!2d72.828551!3d18.932225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce24fae48e0d%3A0xc665796a5a22bbbc!2sFort%20Convent%20School!5e0!3m2!1sen!2sin!4v1689254921614!5m2!1sen!2sin"
  },
  "560001": {
    name: "Cubbon Park Pavilion, Bangalore",
    distance: "2.5 km away",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9739496033486!2d77.59013211536417!3d12.97350751834914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1676b7e0892f%3A0x46320a1eb9da58f3!2sCubbon%20Park!5e0!3m2!1sen!2sin!4v1689255104443!5m2!1sen!2sin"
  }
};

function BoothLocator() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setError('Please enter a valid 6-digit Pincode.');
      setResult(null);
      setSearched(false);
      return;
    }
    
    setError('');
    setIsLoading(true);
    setResult(null);
    setSearched(false);

    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      setSearched(true);
      if (MOCK_MAP_DATA[pincode]) {
        setResult(MOCK_MAP_DATA[pincode]);
      } else {
        setResult(null);
      }
    }, 1500);
  };

  return (
    <div className="relative mt-6 w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Locate Your Polling Booth
      </h3>
      
      <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">Try Pincodes: 110001, 400001, 560001</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter 6-digit Pincode"
          maxLength={6}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow text-lg"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : 'Search'}
        </button>
      </form>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Loading Animation */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 animate-pulse">
          <div className="relative mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-slate-200 rounded-full blur-[2px]"></div>
          </div>
          <p className="text-slate-500 font-medium">Searching for nearest booth...</p>
        </div>
      )}

      {/* Result Card */}
      {searched && !isLoading && (
        <div className="mt-6 animate-fade-in">
          {result ? (
            <div className="overflow-hidden rounded-xl border border-primary-100 shadow-md">
              <div className="p-4 bg-primary-50 border-b border-primary-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-full shadow-sm border border-primary-100 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1">Designated Booth</p>
                    <h4 className="text-lg font-bold text-slate-900">{result.name}</h4>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {result.distance}
                    </p>
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result.name)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="whitespace-nowrap px-4 py-2 bg-white text-primary-600 text-sm font-bold border border-primary-200 rounded-lg shadow-sm hover:bg-primary-50 transition-colors"
                >
                  Get Directions
                </a>
              </div>
              <div className="w-full h-64 bg-slate-100 relative">
                {/* Embed Google Map */}
                <iframe 
                  src={result.embedUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-amber-50 rounded-xl border border-amber-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-lg font-bold text-slate-800 mb-1">Zone Not Found</h4>
              <p className="text-slate-500 text-center text-sm max-w-sm">No local data available for this zone yet. The system is ready to integrate with live electoral APIs soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STEPS = [
  {
    id: 1,
    label: 'Eligibility',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    heading: 'Check Your Eligibility',
    description: 'Before anything else, confirm you meet the basic criteria to vote in your jurisdiction.',
    isChecklist: true,
    tasks: [
      { id: 'eligibility_age', label: 'Verify age is 18+ by Election Day' },
      { id: 'eligibility_citizen', label: 'Confirm valid citizenship status' },
      { id: 'eligibility_residence', label: 'Verify residence in the voting district' },
      { id: 'eligibility_disqualified', label: 'Ensure no disqualifying legal restrictions' }
    ]
  },
  {
    id: 2,
    label: 'Registration',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    heading: 'Register to Vote',
    description: 'Ensure you are on the official electoral roll so your vote counts on Election Day.',
    isChecklist: true,
    tasks: [
      { id: 'reg_gather_id', label: 'Gather Aadhaar Card or valid ID' },
      { id: 'reg_fill_form', label: 'Fill out Form 6 for registration' },
      { id: 'reg_submit', label: 'Submit Form 6 online or offline' },
      { id: 'reg_verify', label: 'Verify name is on the electoral roll' }
    ]
  },
  {
    id: 3,
    label: 'Preparation',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    heading: 'Prepare for the Election',
    description: 'Find your designated polling booth by entering your 6-digit Pincode.',
    isChecklist: false,
    isLocator: true,
    details: [
      'Research the candidates running in your district and their platforms.',
      'Read up on any ballot measures, propositions, or referendums.',
      'Find your polling location and its operating hours in advance.',
      'Plan your travel and confirm you have the required ID documents ready.',
    ],
  },
  {
    id: 4,
    label: 'Voting Day',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    heading: 'Cast Your Vote',
    description: 'Everything is ready. Here\'s what to expect and how to make your voice heard.',
    isChecklist: false,
    details: [
      'Bring a valid government-issued photo ID to the polling station.',
      'Follow the queue and wait for a polling booth to be available.',
      'Mark your ballot clearly as per the instructions provided.',
      'Submit your ballot to the official and collect your "I Voted" sticker!',
    ],
  },
];

export default function Stepper({ activeStep, setActiveStep, onProgressChange }) {
  const [checkedTasks, setCheckedTasks] = useState(() => {
    const saved = localStorage.getItem('voterAssist_checkedTasks');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('voterAssist_checkedTasks', JSON.stringify(Array.from(checkedTasks)));
  }, [checkedTasks]);

  // Calculate total tasks from all checklist steps
  const totalTasks = STEPS.reduce((total, step) => {
    return total + (step.isChecklist ? step.tasks.length : 0);
  }, 0);

  // Notify parent component when progress changes
  useEffect(() => {
    if (totalTasks > 0) {
      const percentage = Math.round((checkedTasks.size / totalTasks) * 100);
      onProgressChange(percentage);
    }
  }, [checkedTasks, totalTasks, onProgressChange]);

  const toggleTask = (taskId) => {
    setCheckedTasks((prev) => {
      const newChecked = new Set(prev);
      if (newChecked.has(taskId)) {
        newChecked.delete(taskId);
      } else {
        newChecked.add(taskId);
      }
      return newChecked;
    });
  };

  const goNext = () => {
    if (activeStep < STEPS.length - 1) setActiveStep(activeStep + 1);
  };

  const goPrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const goToStep = (index) => {
    setActiveStep(index);
  };

  const current = STEPS[activeStep];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100">
      {/* Horizontal Step Indicators */}
      <div className="px-6 pt-8 pb-6 bg-gradient-to-br from-primary-900 to-primary-700 rounded-t-2xl">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-primary-600 z-0 mx-10 pointer-events-none" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-white z-0 mx-10 transition-all duration-700 ease-out pointer-events-none"
            style={{ width: `calc(${(activeStep / (STEPS.length - 1)) * 100}% - 5rem)` }}
          />

          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className="relative z-10 flex flex-col items-center gap-2 group focus:outline-none"
                aria-label={`Go to step ${step.label}`}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    transition-all duration-300 ring-2 ring-offset-2 ring-offset-transparent
                    ${isCompleted
                      ? 'bg-white text-primary-700 ring-white shadow-md'
                      : isActive
                        ? 'bg-primary-500 text-white ring-primary-300 shadow-lg scale-110'
                        : 'bg-primary-800 text-primary-300 ring-primary-700 group-hover:ring-primary-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-white' : isCompleted ? 'text-primary-200' : 'text-primary-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div className="p-8 sm:p-10 min-h-72">
        <div key={activeStep} className="animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
              {current.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-500">
              Step {activeStep + 1} of {STEPS.length}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mt-3 mb-2">{current.heading}</h2>
          <p className="text-slate-500 mb-6 max-w-2xl">{current.description}</p>

          {current.isChecklist ? (
            <div className="space-y-8">
              <div className="space-y-3">
                {current.tasks.map((task) => {
                  const isChecked = checkedTasks.has(task.id);
                  return (
                    <label 
                      key={task.id} 
                      className={`
                        flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none
                        ${isChecked 
                          ? 'bg-primary-50 border-primary-200 shadow-sm' 
                          : 'bg-white border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
                      `}
                    >
                      <div className="flex items-center h-6">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTask(task.id)}
                          className="w-5 h-5 text-primary-600 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 focus:ring-2 transition-all duration-200 cursor-pointer"
                        />
                      </div>
                      <span className={`text-base font-medium transition-colors ${isChecked ? 'text-primary-900 line-through opacity-70' : 'text-slate-700'}`}>
                        {task.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              {current.id === 2 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    Portal Hub
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">How to fill Form 6:</h4>
                    <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1.5 ml-1">
                      <li>Go to the NVSP portal and click "New Registration".</li>
                      <li>Enter your mobile number to verify via OTP.</li>
                      <li>Fill out your personal details, address, and family information.</li>
                      <li>Upload a passport size photo and your address/age proof documents.</li>
                      <li>Submit the form and save the Reference ID for tracking.</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <a 
                      href="https://voters.eci.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex justify-center items-center gap-2 px-5 py-3 rounded-lg text-white text-sm font-bold shadow hover:shadow-md transition-all focus:ring-2 focus:ring-offset-2" 
                      style={{ backgroundColor: '#E23744', outlineColor: '#E23744' }}
                    >
                      Official Registration Portal (NVSP)
                    </a>
                    <a 
                      href="https://electoralsearch.eci.gov.in/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex justify-center items-center gap-2 px-5 py-3 rounded-lg text-white text-sm font-bold shadow hover:shadow-md transition-all focus:ring-2 focus:ring-offset-2" 
                      style={{ backgroundColor: '#E23744', outlineColor: '#E23744' }}
                    >
                      Find My Name in Voter List
                    </a>
                  </div>
                  
                  <p className="text-xs text-slate-400 italic text-center">
                    You are being redirected to official government portals for secure data entry.
                  </p>
                </div>
              )}
            </div>
          ) : current.isLocator ? (
            <>
              <BoothLocator />
              <DocumentVault />
            </>
          ) : (
            <ul className="space-y-3">
              {current.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                  </div>
                  <span className="text-slate-700">{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={activeStep === 0}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
            ${activeStep === 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-600 hover:bg-slate-200 active:bg-slate-300'
            }
          `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeStep ? 'w-6 bg-primary-600' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={activeStep === STEPS.length - 1}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
            ${activeStep === STEPS.length - 1
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm hover:shadow-md'
            }
          `}
        >
          {activeStep === STEPS.length - 1 ? 'All Done!' : 'Next Step'}
          {activeStep < STEPS.length - 1 && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
