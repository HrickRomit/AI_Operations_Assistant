import { useState } from 'react';

function Settings() {
  const [businessName, setBusinessName] = useState('Titan Agency');
  const [defaultTone, setDefaultTone] = useState('formal');
  const [temperature, setTemperature] = useState(0.7);
  const [activeTab, setActiveTab] = useState('Business Details');
  const [saved, setSaved] = useState(false);

  const tabs = ['Profile', 'Business Details', 'API & Workflows', 'Billing', 'Security'];

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="header-copy">Configure and manage your AI Operations Assistant account.</p>
      </div>

      <div className="horizontal-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {saved && <div className="notice success">Settings updated successfully! ✓</div>}

      <div className="settings-content-grid">
        <section className="settings-main-col">
          <div className="panel-card">
            <div className="panel-header">
              <h3>Business Profile</h3>
            </div>
            <div className="panel-body">
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="biz-name">Business Name</label>
                  <input
                    id="biz-name"
                    type="text"
                    className="custom-input"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Default Response Tone Selector</label>
                  <div className="segmented-control">
                    {['friendly', 'formal', 'concise'].map(tone => (
                      <button
                        key={tone}
                        type="button"
                        className={`segment-btn ${defaultTone === tone ? 'active' : ''}`}
                        onClick={() => setDefaultTone(tone)}
                      >
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group slider-group">
                  <div className="flex-between">
                    <label>AI Creativity (Temperature)</label>
                  </div>
                  <div className="custom-slider-container">
                    <div className="slider-tooltip" style={{ left: `calc(${temperature * 100}% - 14px)` }}>
                      {temperature.toFixed(1)}
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.1"
                      className="custom-range"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      style={{ '--val': `${temperature * 100}%` }}
                    />
                    <div className="slider-marks">
                      <span>0.0</span>
                      <span>Creative</span>
                      <span>1.0</span>
                    </div>
                  </div>
                </div>

                <div className="form-actions mt-4">
                  <button className="btn-glow" type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="settings-side-col">
          <div className="panel-card plan-usage-card">
            <div className="panel-header flex-between">
              <h3>Plan Usage</h3>
              <div className="plan-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                Current Plan: Pro
              </div>
            </div>
            
            <div className="panel-body">
              <div className="usage-item">
                <div className="flex-between mb-2">
                  <span className="usage-label">Document Analysis</span>
                  <span className="usage-stats">42 / 100 documents</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '42%' }}>
                    <div className="progress-glow"></div>
                  </div>
                </div>
                <div className="usage-percent">42%</div>
              </div>

              <div className="usage-item">
                <div className="flex-between mb-2">
                  <span className="usage-label">Monthly API Queries</span>
                  <span className="usage-stats">1,280 / 2,000 queries</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" style={{ width: '64%' }}>
                    <div className="progress-glow"></div>
                  </div>
                </div>
                <div className="usage-percent">64%</div>
              </div>
            </div>
            <div className="panel-footer">
              <button className="btn-outline-sm w-full">Upgrade Plan</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Settings;
