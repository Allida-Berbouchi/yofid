"use client";
import React, { useMemo } from "react";

const WEEKS = 52;
const DAYS = 7;

function randomLevel() {
  const r = Math.random();
  if (r < 0.3) return 0;
  if (r < 0.55) return 1;
  if (r < 0.75) return 2;
  if (r < 0.9)  return 3;
  return 4;
}

const COLORS = ["#E6F1FB", "#85B7EB", "#378ADD", "#185FA5", "#0C447C"];

export default function LearningActivity() {
  const grid = useMemo(() =>
    Array.from({ length: WEEKS }, () =>
      Array.from({ length: DAYS }, () => randomLevel())
    ), []);

  const total = useMemo(() =>
    grid.flat().filter(v => v > 0).length * 8, [grid]);

  return (
    <section className="activity-section">
      <div className="activity-header">
        <div>
          <h2 className="section-title" style={{ marginBottom: 2 }}>Learning Activity</h2>
          <p className="activity-sub">{total} contributions in the last year</p>
        </div>
        <div className="activity-legend">
          <span className="legend-label">Less</span>
          {COLORS.map((c, i) => (
            <span key={i} className="legend-dot" style={{ background: c }} />
          ))}
          <span className="legend-label">More</span>
        </div>
      </div>
      <div className="heatmap">
        {grid.map((week, wi) => (
          <div key={wi} className="heatmap-col">
            {week.map((level, di) => (
              <div
                key={di}
                className="heatmap-cell"
                style={{ background: COLORS[level] }}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
