"use client";

import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import CardPreview from "@/components/CardPreview";
import { useEffect, useState } from "react";
import { fetchContentList } from "@/lib/api";

const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-2-1-3-1-3s-1 2-2 2c-1 0-2-1.5-1-3.5C13 6 12 2 12 2Z" />
  </svg>
);

function SkeletonCard() {
  return (
    <div className="section-card course-card">
      <div
        className="course-cover"
        style={{ background: "#e8edf4", animation: "pulse 1.6s ease-in-out infinite" }}
      />
      <div className="course-card-body">
        <div style={{ height: 14, width: "40%", background: "#edf1f6", borderRadius: 8, marginBottom: 12 }} />
        <div style={{ height: 20, width: "85%", background: "#edf1f6", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 14, width: "65%", background: "#edf1f6", borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 14, width: "50%", background: "#edf1f6", borderRadius: 8 }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}

export default function HomePage() {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");

    async function load() {
      try {
        const all = await fetchContentList();
        const sorted = [...all]
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 10);
        setTop10(sorted);
      } catch (err) {
        setError(err.message || "Could not load content.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        {/* page header */}
        <section className="page-head">
          <h1 className="page-title">
            {userName ? `Welcome back, ${userName}.` : "Home"}
          </h1>
          <p className="page-subtitle">
            Your hand-picked top 10 — the highest-rated content on Youfid right now.
          </p>
        </section>

        {/* filter panel */}
        <section className="section-card catalog-panel" style={{ marginBottom: 22 }}>
          <div
            className="hero-search"
            style={{ color: "var(--muted-2)", fontSize: 18, fontWeight: 600 }}
          >
            <span className="inline-search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m17 17 4 4" strokeLinecap="round" />
              </svg>
            </span>
            Top 10 picks for you
          </div>

          <div className="chip-row" style={{ marginTop: 20 }}>
            <button className="chip">All Content</button>
            <button className="chip">Videos</button>
            <button className="chip">Articles</button>
            <button className="chip">Projects</button>
          </div>

          <div className="filters-bar">
            <span style={{ color: "#7a8aa4", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em" }}>
              DISPLAYING {loading ? "…" : top10.length} RESULTS
            </span>
            <span className="soft-badge green" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
              <FireIcon /> Best rated
            </span>
          </div>
        </section>

        {/* grid */}
        {error ? (
          <div className="section-card" style={{ padding: 28, color: "var(--danger)" }}>{error}</div>
        ) : (
          <section className="course-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : top10.map((item, i) => (
                  <CardPreview key={item._id} item={item} rank={i + 1} />
                ))}
          </section>
        )}
      </div>
    </AppLayout>
  );
}