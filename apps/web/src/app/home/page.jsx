"use client";

import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchContentList } from "@/lib/api";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <polygon points="6,4 20,12 6,20" />
  </svg>
);

const DocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
    <rect x="4" y="3" width="16" height="18" rx="3" />
    <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.5 8.9l6.6-.9Z" />
  </svg>
);

const FireIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-2-1-3-1-3s-1 2-2 2c-1 0-2-1.5-1-3.5C13 6 12 2 12 2Z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" />
  </svg>
);

// ── cover styles cycling through globals.css cover classes ─────────
const COVERS = ["cover-1","cover-2","cover-3","cover-4","cover-5","cover-6","cover-7","cover-8"];

// ── category badge colour ──────────────────────────────────────────
function getCategoryBadge(category = "") {
  const cat = category.toLowerCase();
  if (cat.includes("web"))    return "blue";
  if (cat.includes("cloud"))  return "green";
  if (cat.includes("ai") || cat.includes("ml")) return "red";
  if (cat.includes("data"))   return "purple";
  return "blue";
}

// ── single content card ────────────────────────────────────────────
function ContentCard({ item, rank }) {
  const cover = COVERS[(rank - 1) % COVERS.length];
  const isVideo = item.type?.toLowerCase() === "video";
  const badgeColor = getCategoryBadge(item.category);

  return (
    <Link href={`/resources/${item._id}`} className="section-card course-card" style={{ display: "block", textDecoration: "none", cursor: "pointer" }}>
      {/* cover thumbnail */}
      <div className={`course-cover ${cover}`}>
        {/* rank */}
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 13,
            padding: "3px 10px",
            borderRadius: 999,
            letterSpacing: "0.06em",
          }}
        >
          #{rank}
        </span>

        {/* category badge */}
        <div className="cover-badge">
          <span className={`soft-badge ${badgeColor}`}>
            {item.category || "Course"}
          </span>
        </div>

        {/* type icon centred */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
            }}
          >
            {isVideo ? <PlayIcon /> : <DocIcon />}
          </span>
        </div>
      </div>

      {/* card body */}
      <div className="course-card-body">
        {/* rating */}
        <div className="course-rating" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <StarIcon />
          {item.rating ? item.rating.toFixed(1) : "New"}
          <span style={{ color: "#8090aa", fontWeight: 700, marginLeft: 6, fontSize: 13 }}>
            {item.type || "Resource"}
          </span>
        </div>

        <h3 className="course-title">{item.title}</h3>

        <p className="course-desc">
          {item.description
            ? item.description.length > 88
              ? item.description.slice(0, 88) + "…"
              : item.description
            : "Explore this learning resource on Youfid."}
        </p>

        <div className="course-footer">
          <span className="course-status" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <FireIcon /> Top pick
          </span>
          <span className="course-duration" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ClockIcon />
            {item.duration || "Self-paced"}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── skeleton card ──────────────────────────────────────────────────
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

// ── main page ──────────────────────────────────────────────────────
export default function HomePage() {
  const [top10, setTop10]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
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

        {/* ── page header ── */}
        <section className="page-head">
          <h1 className="page-title">
            {userName ? `Welcome back, ${userName}.` : "Home"}
          </h1>
          <p className="page-subtitle">
            Your hand-picked top 10 — the highest-rated content on Youfid right now.
          </p>
        </section>

        {/* ── filter panel (static, matches course catalog style) ── */}
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
            <button className="chip ">All Content</button>
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

        {/* ── grid ── */}
        {error ? (
          <div className="section-card" style={{ padding: 28, color: "var(--danger)" }}>{error}</div>
        ) : (
          <section className="course-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : top10.map((item, i) => (
                  <ContentCard key={item._id} item={item} rank={i + 1} />
                ))}
          </section>
        )}

      </div>
    </AppLayout>
  );
}
