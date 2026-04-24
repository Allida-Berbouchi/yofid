import React from "react";

const progressColor = (level) => {
  if (level === "Expert")       return "#185FA5";
  if (level === "Advanced")     return "#1D9E75";
  if (level === "Intermediate") return "#BA7517";
  return "#888780";
};

export default function TechnicalExpertise({ arr = [] }) {
  return (
    <section className="expertise-section">
      <div className="expertise-header">
        <h2 className="section-title">Technical Expertise</h2>
        <button className="skill-metrics-btn">Skill metrics</button>
      </div>
      <div className="expertise-grid">
        {arr.map((skill, i) => (
          <div key={i} className="skill-card">
            <p className="skill-subtitle">{skill.subtitle}</p>
            <p className="skill-title">{skill.title}</p>
            <div className="skill-bar-row">
              <div className="skill-bar-track">
                <div
                  className="skill-bar-fill"
                  style={{ width: `${skill.mastery}%`, background: progressColor(skill.progress) }}
                />
              </div>
              <span className="skill-mastery">{skill.mastery}% Mastery</span>
              <span className="skill-level" style={{ color: progressColor(skill.progress) }}>
                {skill.progress}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
