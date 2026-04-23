import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";

const faqs = [
  {
    q: "How do I export course analytics?",
    a: "Navigate to the Dashboard, select the specific course, and open the Analytics tab. Use the export button in the top-right corner of the chart area.",
  },
  {
    q: "Can I offer discounts?",
    a: "Yes. Discounts can be created in billing settings and attached to specific plans, teams, or one-time campaigns.",
  },
  {
    q: "What video formats are supported?",
    a: "MP4, MOV, and WebM are supported by default. Large uploads are automatically optimized for streaming.",
  },
  {
    q: "How do I integrate with Slack?",
    a: "Connect Slack from settings, approve the workspace, then choose which learning events should trigger notifications.",
  },
];

const SearchLineIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 16 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function SupportPage() {
  return (
    <AppLayout>
      <Topbar placeholder="Search help articles, API docs, or tutorials..." />
      <div className="page-shell">
        <section className="section-card help-hero" style={{ marginTop: "22px" }}>
          <h1>How can we help?</h1>
          <div className="hero-search help-search">
            <span className="inline-search-icon">
              <SearchLineIcon />
            </span>
            <span>Search for articles, guides, and tutorials...</span>
          </div>
          <div className="chip-row help-tags">
            <button className="chip">Expert analytics</button>
            <button className="chip">Reset password</button>
            <button className="chip">API docs</button>
          </div>
        </section>

        <section className="support-grid">
          <article className="section-card support-card">
            <span className="soft-badge blue">START</span>
            <h3>Getting Started</h3>
            <p>Everything you need to know to set up your account and first course.</p>
          </article>
          <article className="section-card support-card">
            <span className="soft-badge purple">COURSES</span>
            <h3>Course Management</h3>
            <p>Manage curriculum, student access, and interactive content tools.</p>
          </article>
          <article className="section-card support-card">
            <span className="soft-badge green">BILLING</span>
            <h3>Payment and Billing</h3>
            <p>Update payment methods, view invoices, and handle student refunds.</p>
          </article>
          <article className="section-card support-card">
            <span className="soft-badge red">TECHNICAL</span>
            <h3>Technical Issues</h3>
            <p>Troubleshoot upload errors, API integrations, and plugin setup.</p>
          </article>
        </section>

        <div className="section-label">KNOWLEDGE BASE</div>

        <section className="faq-list">
          {faqs.map((item, index) => (
            <article key={item.q} className="section-card faq-item">
              <h4>{item.q}</h4>
              {index === 0 && <p>{item.a}</p>}
            </article>
          ))}
        </section>

        <section className="center-cta" style={{ marginTop: "22px" }}>
          <h3>Still need help?</h3>
          <p>
            Our dedicated support team is here to help with platform issues,
            onboarding questions, or billing requests.
          </p>
          <div className="dual-actions">
            <button className="primary-action">Start Live Chat</button>
            <button className="ghost-action">Email Support</button>
          </div>
        </section>

        <div className="tip-card">
          <strong>Support Pro-Tip</strong>
          <div style={{ marginTop: "8px" }}>
            Check your technical status page before submitting a ticket to spot
            ongoing platform-wide incidents.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
