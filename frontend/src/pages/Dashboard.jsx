import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modules = [
    {
      title: "Document Manager",
      desc: "Upload files & build embeddings for semantic RAG search.",
      path: "/documents",
      icon: "📁"
    },
    {
      title: "AI Chat Assistant",
      desc: "Ask inquiries referenced strictly against company documents.",
      path: "/chat",
      icon: "💬"
    },
    {
      title: "Email Draft Generator",
      desc: "Instantly draft professional context-rich customer replies.",
      path: "/email",
      icon: "✉️"
    },
    {
      title: "Lead Qualifier & Scorer",
      desc: "Analyze and prioritize incoming customer lead sheets.",
      path: "/leads",
      icon: "📊"
    },
    {
      title: "Report Summary Engine",
      desc: "Structure notes and audio logs into weekly digests.",
      path: "/reports",
      icon: "📝"
    },
    {
      title: "Workspace Settings",
      desc: "Adjust AI creativity, tone settings, and track workspace limits.",
      path: "/settings",
      icon: "⚙️"
    }
  ];

  return (
    <main className="dashboard-page">
      <p className="eyebrow">Overview</p>
      <h1>Welcome back, {user?.business_name || 'Valued Partner'}! 👋</h1>
      <p className="header-copy">
        Your AI employee is active and managing your business operations. Review stats, access modules, and manage RAG documents below.
      </p>

      {/* Analytics Grid */}
      <section className="dashboard-grid">
        <div className="ui-card stats-card">
          <div className="stats-header">
            <span>Documents Processed</span>
            <div className="stats-icon-wrapper">📁</div>
          </div>
          <div className="stats-value">42</div>
          <div className="stats-desc">Active RAG knowledge sources</div>
        </div>

        <div className="ui-card stats-card">
          <div className="stats-header">
            <span>AI Queries Resolved</span>
            <div className="stats-icon-wrapper">💬</div>
          </div>
          <div className="stats-value">1,280</div>
          <div className="stats-desc">99.4% context relevance accuracy</div>
        </div>

        <div className="ui-card stats-card">
          <div className="stats-header">
            <span>Leads Qualified</span>
            <div className="stats-icon-wrapper">📊</div>
          </div>
          <div className="stats-value">4</div>
          <div className="stats-desc">Captured in the last 24 hours</div>
        </div>
      </section>

      {/* Quick Access Modules Grid */}
      <section className="modules-section">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Operational Core Modules</h2>
        <div className="modules-grid">
          {modules.map((mod, index) => (
            <div
              key={index}
              className="module-card"
              onClick={() => navigate(mod.path)}
            >
              <div>
                <div className="module-icon-wrap">{mod.icon}</div>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
              </div>
              <div style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Open Module ➔
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity Log */}
      <section className="activity-feed-card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Recent AI Operations Activity</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Real-time activity logs processed by your AI Operations assistant.
        </p>

        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-dot" />
            <div className="activity-details">
              <div className="activity-text">
                Qualified high-priority lead: <strong>John Harrison</strong> (E-commerce Automation Pipeline)
              </div>
              <div className="activity-time">Just now</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-dot" />
            <div className="activity-details">
              <div className="activity-text">
                Drafted <strong>Friendly Reply</strong> for inquiry regarding pricing models
              </div>
              <div className="activity-time">15 minutes ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-dot" />
            <div className="activity-details">
              <div className="activity-text">
                Embedded document chunks for <strong>company_faqs.txt</strong> (23 chunks)
              </div>
              <div className="activity-time">1 hour ago</div>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-dot" />
            <div className="activity-details">
              <div className="activity-text">
                Generated Markdown Summary Report for raw transcription log (420 words analyzed)
              </div>
              <div className="activity-time">Yesterday</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
