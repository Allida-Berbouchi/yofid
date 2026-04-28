"use client";

import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import CardPreview from "@/components/CardPreview";
import CardProgress from "@/components/CardProgress";
import { useEffect, useState } from "react";
import {
  fetchContentList,
  fetchUserProgress,
  fetchCurrentUser,
} from "@/lib/api";

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

function ProgressSkeletonCard() {
  return (
    <div className="section-card" style={{ padding: "20px" }}>
      <div style={{ height: 20, width: "60%", background: "#edf1f6", borderRadius: 8, marginBottom: 12 }} />
      <div style={{ height: 14, width: "40%", background: "#edf1f6", borderRadius: 8, marginBottom: 12 }} />
      <div style={{ height: 8, background: "#edf1f6", borderRadius: 8, marginBottom: 8 }} />
      <div style={{ height: 14, width: "30%", background: "#edf1f6", borderRadius: 8 }} />
    </div>
  );
}

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const [inProgressContent, setInProgressContent] = useState([]);
  const [topContent, setTopContent] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name") || "");

    async function loadData() {
      try {
        await fetchCurrentUser();

        const allContent = await fetchContentList();

        const userProgress = await fetchUserProgress();

        const progressLookup = {};
        userProgress.forEach((prog) => {
          progressLookup[prog.contentId] = prog;
        });
        setProgressMap(progressLookup);

        const inProgress = allContent
          .filter(
            (item) =>
              progressLookup[item._id]?.status === "in_progress" ||
              (progressLookup[item._id]?.progressPercent > 0 &&
                progressLookup[item._id]?.progressPercent < 100)
          )
          .sort((a, b) => {
            const progressA = progressLookup[a._id]?.progressPercent || 0;
            const progressB = progressLookup[b._id]?.progressPercent || 0;
            return progressB - progressA;
          })
          .slice(0, 3); 

        //get best 10
        const topTen = [...allContent]
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 10);

        setInProgressContent(inProgress);
        setTopContent(topTen);
      } catch (err) {
        console.error("Error loading home data:", err);
        setError(err.message || "Could not load content.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const hasInProgress = inProgressContent.length > 0;

  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">
            {userName ? `Welcome back, ${userName}.` : "Home"}
          </h1>
          <p className="page-subtitle">
            Continue learning or explore top-rated content on Youfid.
          </p>
        </section>

        {error && (
          <div className="section-card" style={{ padding: 28, color: "var(--danger)", marginBottom: 20 }}>
            {error}
          </div>
        )}

        
        {hasInProgress && (
          <>
            <section className="section-card catalog-panel" style={{ marginBottom: 22 }}>
              <div
                className="hero-search"
                style={{ color: "var(--muted-2)", fontSize: 18, fontWeight: 600 }}
              >
                <span className="inline-search-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                </span>
                Continue Learning
              </div>

              <div className="filters-bar">
                <span style={{ color: "#7a8aa4", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em" }}>
                  {loading ? "…" : inProgressContent.length} IN PROGRESS
                </span>
              </div>
            </section>

            <section className="course-grid" style={{ marginBottom: 40 }}>
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <ProgressSkeletonCard key={i} />)
                : inProgressContent.map((item) => {
                    const progress = progressMap[item._id];
                    return (
                      <CardProgress
                        key={item._id}
                        title={item.title || "Untitled"}
                        subtitle={item.category || "Learning"}
                        progress={`${progress?.progressPercent || 0}% complete`}
                        mastery={progress?.progressPercent || 0}
                      />
                    );
                  })}
            </section>
          </>
        )}

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
            Top 10 Picks For You
          </div>

          <div className="filters-bar">
            <span style={{ color: "#7a8aa4", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em" }}>
              DISPLAYING {loading ? "…" : topContent.length} RESULTS
            </span>
            <span className="soft-badge green" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
              <FireIcon /> Best rated
            </span>
          </div>
        </section>

        <section className="course-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : topContent.map((item, i) => (
                <CardPreview key={item._id} item={item} rank={i + 1} />
              ))}
        </section>
      </div>
    </AppLayout>
  );
}
