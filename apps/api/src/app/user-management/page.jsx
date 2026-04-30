"use client";

import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function UserManagementPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch("/api/users/me");
        setUser(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const skills = user?.skills || [
    { label: "CLOUD INFRASTRUCTURE", title: "Kubernetes and AWS", percent: "94%", fill: "94%", level: "Advanced" },
    { label: "FRONTEND SYSTEMS", title: "React and WebAssembly", percent: "88%", fill: "88%", level: "Expert" },
    { label: "DATA SCIENCE", title: "Python and PyTorch", percent: "72%", fill: "72%", level: "Intermediate" },
  ];
  const achievements = user?.achievements || ["100 Day Streak", "Code Master", "Top Mentor", "Early Adopter"];
  const heatmap = user?.heatmap || Array.from({ length: 180 }, (_, index) => index % 5);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        <section className="section-card profile-banner" style={{ marginTop: "22px" }}>
          <div className="profile-avatar-lg">{user?.name?.[0] || "U"}</div>
          <div>
            <div className="section-row" style={{ justifyContent: "flex-start", marginBottom: "8px" }}>
              <h2>{user?.name || "User"}</h2>
              <span className="soft-badge blue">{user?.role?.toUpperCase() || "USER"}</span>
            </div>
            <div className="profile-role">{user?.role || "User"}</div>
            <p className="page-subtitle" style={{ maxWidth: "900px" }}>
              {user?.bio || "Specializing in distributed systems and cloud-native architecture. Passionate about mentoring the next generation of engineers and pushing the boundaries of modern web technologies."}
            </p>
            <div className="profile-meta">
              <span>{user?.location || "Unknown"}</span>
              <span>{user?.portfolio || user?.email}</span>
              <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
            </div>
          </div>
        </section>

        <section className="expertise-layout">
          <article className="section-card skill-panel">
            <div className="section-row">
              <h3>Technical Expertise</h3>
              <span className="soft-badge blue">SKILL METRICS</span>
            </div>
            <div className="skill-metric-grid">
              {skills.map((item) => (
                <div key={item.title} className="skill-card">
                  <h4>{item.label}</h4>
                  <strong>{item.title}</strong>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: item.fill }} />
                  </div>
                  <span>{item.percent} Mastery · {item.level}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="section-card achievement-panel">
            <h3>Achievements</h3>
            <div className="achievement-grid">
              {achievements.map((item) => (
                <div key={item} className="achievement-item">
                  <span className="soft-badge green">*</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="section-card heatmap-panel" style={{ marginTop: "18px" }}>
          <h3>Learning Activity</h3>
          <p className="page-subtitle" style={{ fontSize: "16px", marginTop: "6px" }}>
            428 contributions in the last year
          </p>
          <div className="heatmap-grid">
            {heatmap.map((level, index) => (
              <span key={index} className={`heat-cell ${level ? `heat-${level}` : ""}`} />
            ))}
          </div>
        </section>

        <section className="section-card completed-panel">
          <div className="section-row">
            <h3>Completed Learning Paths</h3>
            <span className="soft-badge green">TOP 2%</span>
          </div>
          <div className="completed-grid">
            <article className="section-card completed-card">
              <div className="top" />
              <div className="body">
                <h4>Cloud Native Architecture</h4>
                <p>Advanced patterns for resilient, scalable systems on AWS and GCP.</p>
              </div>
            </article>
            <article className="section-card completed-card">
              <div className="top" style={{ background: "linear-gradient(135deg, #658f46, #1d4739)" }} />
              <div className="body">
                <h4>Advanced TypeScript Systems</h4>
                <p>Mastering generics, type-level programming, and large-scale refactoring.</p>
              </div>
            </article>
            <article className="section-card completed-card">
              <div className="top" style={{ background: "linear-gradient(135deg, #0b1e20, #1d3641)" }} />
              <div className="body">
                <h4>Secure DevOps Pipelines</h4>
                <p>Pipeline hardening, secrets handling, and automated compliance testing.</p>
              </div>
            </article>
          </div>

          <div className="insight-popup">
            <h5>WEEKLY INSIGHT</h5>
            <p>
              You&apos;re in the top 2% of learners this week. Based on your
              activity in Distributed Systems, a secret module has been unlocked.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
