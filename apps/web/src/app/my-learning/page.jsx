import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";

const enrolled = [
  {
    icon: "DB",
    title: "Full-Stack Data Engineering",
    current: "Current: Kafka Streaming Fundamentals",
    remaining: "12h remaining",
    percent: "78%",
    fill: "78%",
  },
  {
    icon: "UX",
    title: "UI and UX Architectural Systems",
    current: "Current: Design Token Standardization",
    remaining: "4h remaining",
    percent: "92%",
    fill: "92%",
  },
  {
    icon: "CL",
    title: "Multi-Cloud Strategy and Deployment",
    current: "Current: Introduction to AWS vs GCP Infrastructure",
    remaining: "28h remaining",
    percent: "12%",
    fill: "12%",
  },
];

export default function MyLearningPage() {
  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">Welcome back, Allida.</h1>
          <p className="page-subtitle">
            Pick up exactly where you left off in your learning journey.
          </p>
        </section>

        <section className="featured-grid">
          <article className="section-card feature-card">
            <div className="feature-cover feature-1">
              <span className="soft-badge blue">IN PROGRESS</span>
            </div>
            <div className="feature-body">
              <h3 className="feature-title">Advanced Rust Systems Architecture</h3>
              <p>
                Deep dive into memory safety, ownership patterns, and zero-cost
                abstractions for high-performance systems.
              </p>
              <div className="feature-actions">
                <div style={{ flex: 1 }}>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: "72%" }} />
                  </div>
                </div>
                <button className="primary-action">RESUME</button>
              </div>
            </div>
          </article>

          <article className="section-card feature-card">
            <div className="feature-cover feature-2">
              <span className="soft-badge green">UP NEXT</span>
            </div>
            <div className="feature-body">
              <h3 className="feature-title">Neural Networks and Deep Learning</h3>
              <p>
                Master the fundamentals of backpropagation, CNNs, and RNNs using
                modern PyTorch frameworks.
              </p>
              <div className="feature-actions">
                <div style={{ flex: 1 }}>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: "8%" }} />
                  </div>
                </div>
                <button className="secondary-action">START</button>
              </div>
            </div>
          </article>
        </section>

        <div className="section-label">ALL ENROLLED PATHS</div>

        <section className="learning-list">
          {enrolled.map((item) => (
            <article key={item.title} className="section-card learning-item">
              <div className="learning-icon-box">{item.icon}</div>
              <div className="learning-copy">
                <h3>{item.title}</h3>
                <p>{item.current}</p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: item.fill }} />
                </div>
              </div>
              <div className="learning-stats">
                <strong>{item.percent}</strong>
                <span>{item.remaining}</span>
              </div>
            </article>
          ))}
        </section>

        <div className="section-label">COMPLETED MILESTONES</div>

        <section className="milestone-grid">
          <article className="section-card milestone-card">
            <span className="soft-badge green">CERTIFIED EXPERT</span>
            <div className="big-title">
              Mastering Distributed Systems Architecture
            </div>
            <h3>Completed on Oct 12, 2023</h3>
            <p className="page-subtitle" style={{ fontSize: "16px" }}>
              Verification ID: EDT-992-DIST-SYS
            </p>
          </article>

          <div className="metric-stack">
            <article className="section-card metric-card">
              <h4>Learning Velocity</h4>
              <strong>14.2</strong>
              <span>hrs/wk</span>
            </article>
            <article className="section-card metric-card">
              <h4 style={{ color: "#4b69b1" }}>Skill Streak</h4>
              <strong>128</strong>
              <span>days</span>
            </article>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
