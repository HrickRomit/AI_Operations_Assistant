import { useState, useRef, useEffect } from 'react';
import { generateEmailDraft } from '../services/email';

const ToneSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const options = [
    { id: 'friendly', label: 'Friendly & Casual', icon: '🙂' },
    { id: 'formal', label: 'Formal & Corporate', icon: '📄' },
    { id: 'concise', label: 'Concise & Bulleted', icon: '≣' },
  ];

  const selected = options.find(o => o.id === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={ref}>
      <div className={`select-trigger ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="select-val">
          <span className="select-icon">{selected.icon}</span>
          {selected.label}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {isOpen && (
        <div className="select-dropdown">
          {options.map((opt) => (
            <div
              key={opt.id}
              className={`select-option ${value === opt.id ? 'is-selected' : ''}`}
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
            >
              <span className="select-icon">{opt.icon}</span>
              {opt.label}
              {value === opt.id && (
                <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Email() {
  const [emailText, setEmailText] = useState('');
  const [tone, setTone] = useState('friendly');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!emailText.trim()) return;
    setLoading(true);
    setError('');
    setCopied(false);
    
    try {
      const result = await generateEmailDraft(emailText, tone);
      setDraft(result.draft || '');
    } catch (err) {
      setError('Failed to generate draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <main className="email-page">
      <div className="page-header">
        <h1>Email Draft Generator</h1>
        <p className="header-copy">High-fidelity tools for Email Draft Generator page</p>
      </div>

      {error && <div className="notice error">{error}</div>}

      <div className="email-workspace-grid">
        {/* Left Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>Compose Inquiry</h3>
          </div>
          <div className="panel-body">
            <div className="form-group">
              <label>Paste customer email inquiry</label>
              <textarea
                className="custom-textarea"
                placeholder="Hi team, I need help with..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Select Tone</label>
              <ToneSelect value={tone} onChange={setTone} />
            </div>
          </div>
          <div className="panel-footer">
            <button
              className="btn-glow"
              onClick={handleGenerate}
              disabled={loading || !emailText.trim()}
            >
              {loading ? 'Drafting...' : 'Generate AI Draft'}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="panel-card">
          <div className="panel-header flex-between">
            <h3>Generated Email Response</h3>
            {draft && !loading && (
              <div className="status-badges">
                <span className="badge-draft">Draft Ready</span>
                <span className="badge-time">{timeString}</span>
              </div>
            )}
            <button className="btn-outline-sm" onClick={handleGenerate} disabled={!draft || loading}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              Regenerate
            </button>
          </div>
          <div className="panel-body">
            <div className="output-textarea-container">
              {loading ? (
                <div className="output-placeholder">Drafting response...</div>
              ) : draft ? (
                <textarea className="output-textarea" readOnly value={draft} />
              ) : (
                <div className="output-placeholder">Generated response will appear here...</div>
              )}
            </div>
          </div>
          <div className="panel-footer flex-end">
            <button className="btn-icon" onClick={handleCopy} disabled={!draft || loading} title="Copy to Clipboard">
              {copied ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              )}
            </button>
            <button className="btn-glow" onClick={handleGenerate} disabled={!draft || loading}>
              Regenerate
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Email;
