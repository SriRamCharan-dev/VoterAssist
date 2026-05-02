import { useState, useMemo } from 'react';

const ECI_DOCUMENTS = [
  {
    id: 'doc_aadhaar',
    name: 'Aadhaar Card',
    issuer: 'UIDAI, Government of India',
    icon: '🪪',
    desc: 'Unique 12-digit identification number issued by UIDAI.',
  },
  {
    id: 'doc_mgnrega',
    name: 'MGNREGA Job Card',
    issuer: 'Ministry of Rural Development',
    icon: '📋',
    desc: 'Job card issued under Mahatma Gandhi National Rural Employment Guarantee Act.',
  },
  {
    id: 'doc_passbook',
    name: 'Passbook with Photo',
    issuer: 'Bank / Post Office',
    icon: '📖',
    desc: 'Passbook issued by Bank or Post Office bearing the applicant\'s photograph.',
  },
  {
    id: 'doc_health_card',
    name: 'Health Insurance Smart Card',
    issuer: 'Ministry of Labour',
    icon: '💳',
    desc: 'Smart Card issued under the scheme of Ministry of Labour.',
  },
  {
    id: 'doc_driving',
    name: 'Driving License',
    issuer: 'Regional Transport Authority',
    icon: '🚗',
    desc: 'Valid Driving License issued by the Regional Transport Authority.',
  },
  {
    id: 'doc_pan',
    name: 'PAN Card',
    issuer: 'Income Tax Department',
    icon: '🏦',
    desc: 'Permanent Account Number card issued by the Income Tax Department.',
  },
  {
    id: 'doc_npr_smart',
    name: 'Smart Card (NPR)',
    issuer: 'Registrar General of India',
    icon: '🔖',
    desc: 'Smart Card issued by the Registrar General of India under the National Population Register.',
  },
  {
    id: 'doc_passport',
    name: 'Indian Passport',
    issuer: 'Ministry of External Affairs',
    icon: '✈️',
    desc: 'Valid Indian Passport issued by the Ministry of External Affairs.',
  },
  {
    id: 'doc_pension',
    name: 'Pension Document with Photo',
    issuer: 'Government / PSU',
    icon: '📄',
    desc: 'Pension document with photograph issued by Government or Public Sector Undertaking.',
  },
  {
    id: 'doc_service_id',
    name: 'Service Identity Card',
    issuer: 'Central / State Government',
    icon: '🏛️',
    desc: 'Identity cards issued to employees of Central or State Government, PSUs, and Public Limited Companies.',
  },
  {
    id: 'doc_mp_mla',
    name: 'Official ID Card (MPs / MLAs)',
    issuer: 'Parliament / State Legislature',
    icon: '🎖️',
    desc: 'Official identity cards issued to Members of Parliament and Members of Legislative Assembly.',
  },
  {
    id: 'doc_disability',
    name: 'Unique Disability ID (UDID)',
    issuer: 'Dept. of Empowerment of Persons with Disabilities',
    icon: '♿',
    desc: 'Unique Disability Identity Card issued under the UDID project by the Dept. of Empowerment of Persons with Disabilities.',
  },
];

export default function DocumentVault() {
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState(new Set());

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ECI_DOCUMENTS;
    return ECI_DOCUMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.issuer.toLowerCase().includes(q) ||
        d.desc.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div
      className="mt-6 w-full max-w-2xl rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-xl">🗂️</span>
              Accepted Identity Documents
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              12 documents recognised by the Election Commission of India
            </p>
          </div>

          {/* Verified Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap self-start shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified Info
          </span>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 transition-shadow"
            style={{ '--tw-ring-color': 'rgba(226,55,68,0.35)' }}
          />
        </div>

        {/* Counter */}
        <p className="text-xs text-slate-400 mt-2 font-medium">
          {checked.size} of {ECI_DOCUMENTS.length} documents identified
        </p>
      </div>

      {/* Document List */}
      <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <span className="text-3xl mb-2">🔍</span>
            <p className="text-sm font-medium">No documents match your search</p>
          </div>
        ) : (
          filtered.map((doc) => {
            const isChecked = checked.has(doc.id);
            return (
              <button
                key={doc.id}
                onClick={() => toggle(doc.id)}
                className="w-full text-left flex items-start gap-4 px-5 py-4 transition-all duration-200 focus:outline-none group"
                style={{
                  background: isChecked ? 'rgba(226,55,68,0.04)' : 'white',
                  borderLeft: isChecked ? '3px solid #E23744' : '3px solid transparent',
                }}
              >
                {/* Emoji Icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border transition-all duration-200"
                  style={{
                    background: isChecked ? 'rgba(226,55,68,0.08)' : '#f8fafc',
                    borderColor: isChecked ? 'rgba(226,55,68,0.25)' : '#e2e8f0',
                  }}
                >
                  {doc.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-sm font-semibold leading-tight transition-colors"
                      style={{ color: isChecked ? '#E23744' : '#1e293b' }}
                    >
                      {doc.name}
                    </p>
                    {/* Checkmark */}
                    <div
                      className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                      style={{
                        borderColor: isChecked ? '#E23744' : '#cbd5e1',
                        background: isChecked ? '#E23744' : 'transparent',
                      }}
                    >
                      {isChecked && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: isChecked ? 'rgba(226,55,68,0.65)' : '#94a3b8' }}>
                    {doc.issuer}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{doc.desc}</p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      {checked.size > 0 && (
        <div
          className="px-5 py-3 text-xs font-semibold flex items-center gap-2 border-t"
          style={{ background: 'rgba(226,55,68,0.05)', borderColor: 'rgba(226,55,68,0.15)', color: '#E23744' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          You have identified {checked.size} document{checked.size > 1 ? 's' : ''} to bring on Voting Day.
        </div>
      )}
    </div>
  );
}
