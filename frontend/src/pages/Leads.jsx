import { useEffect, useState } from 'react';
import { getLeads } from '../services/leads';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState('');

  const loadLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      setError('Could not load qualified leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const getUrgencyClass = (urgency) => {
    if (urgency === 'high') return 'high';
    if (urgency === 'medium') return 'medium';
    return 'low';
  };

  return (
    <main className="leads-page">
      <div className="leads-header-toolbar">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h1>Lead Summarizer & Qualifier</h1>
          <p className="header-copy">
            AI-extracted qualified inquiries from raw web forms and emails. Review estimated budgets, score priority, and inspect recommended follow-up actions.
          </p>
        </div>
        <button className="secondary-button" onClick={loadLeads} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Database'}
        </button>
      </div>

      {error && <div className="notice error">{error}</div>}

      <div className="leads-workspace">
        <section className="document-list">
          <div className="list-heading">
            <h2>Qualified Prospects</h2>
            <span>{leads.length} Active Leads</span>
          </div>

          {loading ? (
            <p className="empty-state">Retrieving leads database...</p>
          ) : leads.length === 0 ? (
            <p className="empty-state">No leads captured yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Prospect Name</th>
                    <th>Interest</th>
                    <th>Est. Budget</th>
                    <th>Urgency</th>
                    <th>Score</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      style={{
                        cursor: 'pointer',
                        background: selectedLead?.id === lead.id ? 'var(--accent-glow)' : 'transparent'
                      }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="filename" style={{ fontWeight: 600 }}>{lead.name}</td>
                      <td>{lead.interest}</td>
                      <td>{lead.budget}</td>
                      <td>
                        <span className={`status ${getUrgencyClass(lead.urgency)}`}>
                          {lead.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge ${getUrgencyClass(lead.urgency)}`}>
                          {lead.priority_score}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="secondary-button"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(selectedLead?.id === lead.id ? null : lead);
                          }}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', minHeight: 'auto' }}
                        >
                          {selectedLead?.id === lead.id ? 'Hide Details' : 'View Summary'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedLead && (
          <section className="lead-drawer">
            <div className="drawer-header">
              <div>
                <h3>Lead Deep-Dive: {selectedLead.name}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Captured on: {new Date(selectedLead.created_at).toLocaleString()}
                </p>
              </div>
              <button
                className="secondary-button"
                onClick={() => setSelectedLead(null)}
                style={{ minHeight: 'auto', padding: '0.4rem 0.8rem' }}
              >
                ✕ Close
              </button>
            </div>

            <div className="drawer-grid">
              <div className="drawer-card" style={{ gridColumn: 'span 2' }}>
                <div className="drawer-card-label">Raw Lead Inquiry</div>
                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                  "{selectedLead.raw_input}"
                </p>
              </div>

              <div className="drawer-card">
                <div className="drawer-card-label">AI Extracted Budget</div>
                <div className="drawer-card-val">{selectedLead.budget || 'Not specified'}</div>
              </div>

              <div className="drawer-card">
                <div className="drawer-card-label">Urgency Score</div>
                <div className="drawer-card-val" style={{ textTransform: 'capitalize' }}>
                  {selectedLead.urgency}
                </div>
              </div>

              <div className="drawer-card" style={{ gridColumn: 'span 2' }}>
                <div className="drawer-card-label">Recommended Next Step</div>
                <div className="drawer-card-val" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {selectedLead.urgency === 'high'
                    ? '⚡ IMMEDIATE: Assign senior consultant to schedule a discovery demo'
                    : '📅 Send calendar booking link for a discovery review'}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Leads;
