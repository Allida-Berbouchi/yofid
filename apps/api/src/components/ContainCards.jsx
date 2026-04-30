import React from "react";

export default function ContainCards({ arr }) {
  return (
    <div className="contain-cards">
      {arr.map((item, i) => (
        <div key={i} className="path-card">
          <div className="path-thumb">
            <span className="path-completed-badge">Completed</span>
          </div>
          <div className="path-body">
            <h3 className="path-title">{item.title}</h3>
            <p className="path-subtitle">{item.subtitle}</p>
            <div className="path-footer">
              <span className="path-mastery">{item.mastery} XP</span>
              <a href="#" className="path-cert">View certificate →</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
