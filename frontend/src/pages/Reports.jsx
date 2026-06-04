import { useState } from 'react';
import { summarizeReport } from '../services/reports';

function Reports() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError('');
    setCopied(false);
    
    try {
      const result = await summarizeReport(inputText);
      setSummary(result.summary || '');
    } catch (err) {
      setError('Could not generate meeting report. Please check back.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="reports-page">
      <p className="eyebrow">Reports</p>
      <h1>Admin Report & Summary Generator</h1>
      <p className="header-copy">
        Paste raw transcripts, voice recordings, or unstructured meeting notes. AI immediately structures them into professional executive summaries and actionable checkboxes.
      </p>

      {error && <div className="notice error">{error}</div>}

      <div className="reports-workspace">
        <div className="report-input-panel">
          <div className="textarea-wrap">
            <label htmlFor="raw-transcripts">Meeting Notes & Raw Transcripts</label>
            <textarea
              id="raw-transcripts"
              className="report-textarea"
              placeholder="Paste raw conversation logs or transcription text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={handleSummarize}
            disabled={loading || !inputText.trim()}
          >
            {loading ? 'Summarizing...' : 'Summarize & Structure'}
          </button>
        </div>

        <div className="report-output-panel">
          <div className="email-output-header">
            <h3>AI Summary & Highlights</h3>
            {summary && (
              <button className="secondary-button" onClick={handleCopy}>
                {copied ? 'Copied Markdown! ✓' : 'Copy Markdown'}
              </button>
            )}
          </div>

          <div className="report-viewer">
            {loading ? (
              <div className="email-output-empty">
                <span>AI is compiling and structuring notes...</span>
              </div>
            ) : summary ? (
              /* A simple pre-wrap display to mimic a rich markdown reader beautifully */
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {summary}
              </div>
            ) : (
              <div className="email-output-empty">
                <span>Your structured administrative report will display here.</span>
              </div>
            )}
          </div>

          {summary && !loading && (
            <div className="email-actions-toolbar">
              <button className="primary-button" onClick={handleSummarize}>
                Re-Summarize
              </button>
              <button className="secondary-button" onClick={() => {
                setSummary('');
                setInputText('');
              }}>
                Clear Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Reports;
