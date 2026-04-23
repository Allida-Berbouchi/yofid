"use client";

import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import { fetchTopContent } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

const fallbackData = {
  summary: {
    totalContent: 1284,
    approvedContent: 1038,
    totalViews: 58290,
    avgScore: 0.74,
    activeCategories: 6,
  },
  categories: [
    "All",
    "Programming",
    "Mathematics",
    "Science",
    "Design",
    "Business",
    "Languages",
  ],
  topContent: [
    {
      _id: "1",
      title: "Node.js Authentication with JWT",
      category: "Programming",
      type: "video",
      totalViews: 4200,
      averageRating: 4.8,
      reviewCount: 128,
      commentCount: 57,
      bookmarkCount: 211,
      completionRate: 86,
      engagementScore: 0.92,
      status: "approved",
      createdAt: "2026-04-16T12:00:00.000Z",
    },
    {
      _id: "2",
      title: "React State Management Explained",
      category: "Programming",
      type: "video",
      totalViews: 3900,
      averageRating: 4.7,
      reviewCount: 103,
      commentCount: 42,
      bookmarkCount: 188,
      completionRate: 81,
      engagementScore: 0.88,
      status: "approved",
      createdAt: "2026-04-15T12:00:00.000Z",
    },
    {
      _id: "3",
      title: "Algebra Basics for Beginners",
      category: "Mathematics",
      type: "pdf",
      totalViews: 3100,
      averageRating: 4.6,
      reviewCount: 80,
      commentCount: 31,
      bookmarkCount: 141,
      completionRate: 77,
      engagementScore: 0.84,
      status: "approved",
      createdAt: "2026-04-12T12:00:00.000Z",
    },
    {
      _id: "4",
      title: "UI Color Theory Crash Course",
      category: "Design",
      type: "video",
      totalViews: 2600,
      averageRating: 4.5,
      reviewCount: 61,
      commentCount: 23,
      bookmarkCount: 109,
      completionRate: 72,
      engagementScore: 0.78,
      status: "approved",
      createdAt: "2026-04-10T12:00:00.000Z",
    },
    {
      _id: "5",
      title: "Intro to Chemistry Reactions",
      category: "Science",
      type: "video",
      totalViews: 2400,
      averageRating: 4.4,
      reviewCount: 55,
      commentCount: 20,
      bookmarkCount: 90,
      completionRate: 69,
      engagementScore: 0.74,
      status: "approved",
      createdAt: "2026-04-11T12:00:00.000Z",
    },
    {
      _id: "6",
      title: "Business Presentation Skills",
      category: "Business",
      type: "video",
      totalViews: 2100,
      averageRating: 4.3,
      reviewCount: 49,
      commentCount: 18,
      bookmarkCount: 85,
      completionRate: 67,
      engagementScore: 0.71,
      status: "approved",
      createdAt: "2026-04-09T12:00:00.000Z",
    },
    {
      _id: "7",
      title: "English Grammar Essentials",
      category: "Languages",
      type: "pdf",
      totalViews: 1900,
      averageRating: 4.3,
      reviewCount: 43,
      commentCount: 17,
      bookmarkCount: 72,
      completionRate: 65,
      engagementScore: 0.68,
      status: "approved",
      createdAt: "2026-04-08T12:00:00.000Z",
    },
    {
      _id: "8",
      title: "Arrays and Objects in JavaScript",
      category: "Programming",
      type: "video",
      totalViews: 1850,
      averageRating: 4.2,
      reviewCount: 38,
      commentCount: 15,
      bookmarkCount: 66,
      completionRate: 63,
      engagementScore: 0.65,
      status: "approved",
      createdAt: "2026-04-07T12:00:00.000Z",
    },
    {
      _id: "9",
      title: "Physics Motion Fundamentals",
      category: "Science",
      type: "video",
      totalViews: 1700,
      averageRating: 4.1,
      reviewCount: 34,
      commentCount: 14,
      bookmarkCount: 58,
      completionRate: 61,
      engagementScore: 0.62,
      status: "approved",
      createdAt: "2026-04-06T12:00:00.000Z",
    },
    {
      _id: "10",
      title: "Figma Layout Systems",
      category: "Design",
      type: "video",
      totalViews: 1600,
      averageRating: 4.1,
      reviewCount: 31,
      commentCount: 12,
      bookmarkCount: 49,
      completionRate: 58,
      engagementScore: 0.59,
      status: "approved",
      createdAt: "2026-04-05T12:00:00.000Z",
    },
    {
      _id: "11",
      title: "Probability Foundations",
      category: "Mathematics",
      type: "pdf",
      totalViews: 1500,
      averageRating: 4.0,
      reviewCount: 29,
      commentCount: 10,
      bookmarkCount: 41,
      completionRate: 56,
      engagementScore: 0.56,
      status: "approved",
      createdAt: "2026-04-04T12:00:00.000Z",
    },
  ],
  recentActivity: [
    {
      id: "a1",
      title: "React State Management Explained",
      message: "jumped 3 positions after new comments and high completion rate",
      time: "12 min ago",
    },
    {
      id: "a2",
      title: "Intro to Chemistry Reactions",
      message: "got a slight penalty from early exits in the first 2 minutes",
      time: "36 min ago",
    },
    {
      id: "a3",
      title: "Node.js Authentication with JWT",
      message: "received 18 new bookmarks and 9 fresh reviews",
      time: "1 hour ago",
    },
  ],
};

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(
    Number(value || 0)
  );
}

function scoreTone(score) {
  if (score >= 0.85) return "excellent";
  if (score >= 0.7) return "good";
  if (score >= 0.55) return "medium";
  return "low";
}

function buildDashboardFromTopContent(payload) {
  const safeTopContent = Array.isArray(payload?.topContent) && payload.topContent.length
    ? payload.topContent
    : Array.isArray(payload) && payload.length
      ? payload
      : fallbackData.topContent;
  const categories = Array.from(
    new Set(
      safeTopContent
        .map((item) => item.category)
        .filter(Boolean)
    )
  );
  const approvedCount = safeTopContent.filter(
    (item) => (item.status || "").toLowerCase() === "approved"
  ).length;
  const totalViews = safeTopContent.reduce(
    (sum, item) => sum + Number(item.totalViews || 0),
    0
  );
  const avgScore = safeTopContent.length
    ? safeTopContent.reduce(
        (sum, item) => sum + Number(item.engagementScore || 0),
        0
      ) / safeTopContent.length
    : fallbackData.summary.avgScore;

  return {
    summary: {
      totalContent: payload?.summary?.totalContent ?? safeTopContent.length,
      approvedContent: payload?.summary?.approvedContent ?? approvedCount,
      totalViews: payload?.summary?.totalViews ?? totalViews,
      avgScore: payload?.summary?.avgScore ?? avgScore,
      activeCategories: payload?.summary?.activeCategories ?? categories.length,
    },
    categories: [
      "All",
      ...(
        Array.isArray(payload?.categories) && payload.categories.length
          ? payload.categories
          : categories.length
            ? categories
            : fallbackData.categories.slice(1)
      ),
    ],
    topContent: safeTopContent,
    recentActivity: fallbackData.recentActivity,
  };
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [dashboard, setDashboard] = useState(fallbackData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserName(window.localStorage.getItem("name") || "there");
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        setLoading(true);
        const topContent = await fetchTopContent();

        if (!ignore) {
          setDashboard(buildDashboardFromTopContent(topContent));
        }
      } catch (error) {
        console.error("Dashboard fallback mode:", error.message);
        if (!ignore) {
          setDashboard(buildDashboardFromTopContent(fallbackData));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredTopContent = useMemo(() => {
    const list = Array.isArray(dashboard.topContent) ? dashboard.topContent : [];

    return list
      .filter((item) =>
        activeCategory === "All" ? true : item.category === activeCategory
      )
      .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0))
      .slice(0, 10);
  }, [dashboard.topContent, activeCategory]);

  const stats = [
    {
      label: "TOTAL CONTENT",
      value: formatCompactNumber(dashboard.summary.totalContent),
      note: "All uploaded resources on the platform.",
    },
    {
      label: "APPROVED CONTENT",
      value: formatCompactNumber(dashboard.summary.approvedContent),
      note: "Ready for learners and ranking.",
    },
    {
      label: "TOTAL VIEWS",
      value: formatCompactNumber(dashboard.summary.totalViews),
      note: "Combined views across scored content.",
    },
    {
      label: "AVERAGE SCORE",
      value: Number(dashboard.summary.avgScore || 0).toFixed(2),
      note: "Live engagement-based content score.",
    },
  ];

  return (
    <AppLayout>
      <Topbar />

      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">Welcome back, {userName}.</h1>
          <p className="page-subtitle">
            Track your highest-performing learning content by category, monitor
            score movement, and quickly spot what needs improvement.
          </p>
        </section>

        <section className="dashboard-hero-grid">
          <article className="section-card hero-card">
            <div className="section-row">
              <div>
                <h3>Top scored content leaderboard</h3>
                <p className="panel-subtext">
                  Ranking updates dynamically from views, ratings, saves,
                  comments, progress, and your custom engagement events.
                </p>
              </div>
              <span className="soft-badge blue">
                {loading ? "SYNCING" : "LIVE"}
              </span>
            </div>

            <div className="mini-stat-grid">
              <div className="mini-stat-card">
                <span>Active categories</span>
                <strong>{dashboard.summary.activeCategories}</strong>
              </div>
              <div className="mini-stat-card">
                <span>Showing</span>
                <strong>Top {filteredTopContent.length}</strong>
              </div>
            </div>
          </article>

          <article className="section-card hero-card">
            <div className="section-row">
              <div>
                <h3>Score rules preview</h3>
                <p className="panel-subtext">
                  Use these as UI hints while your backend computes the final
                  score.
                </p>
              </div>
              <span className="soft-badge green">SMART</span>
            </div>

            <div className="score-guide">
              <div className="score-guide-item">
                <strong>+0.10</strong>
                <span>Liked or strongly positive interaction</span>
              </div>
              <div className="score-guide-item">
                <strong>+0.10</strong>
                <span>Watched well / completed content</span>
              </div>
              <div className="score-guide-item">
                <strong>-0.10</strong>
                <span>Early exit after short watch duration</span>
              </div>
              <div className="score-guide-item">
                <strong>+variable</strong>
                <span>Comments, reviews, bookmarks, helpful votes</span>
              </div>
            </div>
          </article>
        </section>

        <section className="stats-row">
          {stats.map((item) => (
            <article key={item.label} className="section-card stat-card">
              <span>{item.label}</span>
              <h3>{item.value}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-grid dashboard-grid-lg">
          <article className="section-card dashboard-panel">
            <div className="section-row section-row-wrap">
              <div>
                <h3>Top 10 content by category</h3>
                <p className="panel-subtext">
                  Click a category to filter the leaderboard.
                </p>
              </div>
              <span className="soft-badge orange">{activeCategory}</span>
            </div>

            <div className="category-pills">
              {dashboard.categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-pill ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="content-list">
              {filteredTopContent.length === 0 ? (
                <div className="empty-state">
                  No content found for this category.
                </div>
              ) : (
                filteredTopContent.map((item, index) => {
                  const tone = scoreTone(item.engagementScore || 0);
                  const scorePercent = Math.max(
                    0,
                    Math.min(100, Math.round((item.engagementScore || 0) * 100))
                  );

                  return (
                    <article key={item._id || item.title} className="content-row">
                      <div className="content-main">
                        <div className="content-headline">
                          <div className="rank-badge">#{index + 1}</div>
                          <div>
                            <h4>{item.title}</h4>
                            <p>
                              {item.category} • {item.type?.toUpperCase() || "RESOURCE"} •{" "}
                              {item.status || "approved"}
                            </p>
                          </div>
                        </div>

                        <div className="content-meta">
                          <span className="metric-chip">
                            {formatCompactNumber(item.totalViews)} views
                          </span>
                          <span className="metric-chip">
                            {(item.averageRating || 0).toFixed(1)} rating
                          </span>
                          <span className="metric-chip">
                            {item.commentCount || 0} comments
                          </span>
                          <span className="metric-chip">
                            {item.bookmarkCount || 0} saves
                          </span>
                          <span className="metric-chip">
                            {item.completionRate || 0}% completion
                          </span>
                        </div>
                      </div>

                      <div className="score-side">
                        <span className={`score-pill ${tone}`}>
                          {(item.engagementScore || 0).toFixed(2)}
                        </span>

                        <div className="score-bar">
                          <div
                            className={`score-fill ${tone}`}
                            style={{ width: `${scorePercent}%` }}
                          />
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </article>

          <div className="dashboard-side-stack">
            <article className="section-card dashboard-panel">
              <div className="section-row">
                <h3>Recent score movement</h3>
                <span className="soft-badge red">UPDATES</span>
              </div>

              <div className="activity-list">
                {dashboard.recentActivity.map((activity) => (
                  <div key={activity.id || activity.title} className="activity-item">
                    <strong>{activity.title}</strong>
                    <p>{activity.message}</p>
                    <span>{activity.time}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="section-card dashboard-panel">
              <div className="section-row">
                <h3>Ranking notes</h3>
                <span className="soft-badge blue">MODEL</span>
              </div>

              <div className="notes-list">
                <div className="note-item">
                  <strong>Use server-side score calculation</strong>
                  <p>
                    Keep the final ranking formula in the API, not in the page.
                  </p>
                </div>
                <div className="note-item">
                  <strong>Penalize fast exits</strong>
                  <p>
                    Add negative weight for short session duration or low watch
                    percentage.
                  </p>
                </div>
                <div className="note-item">
                  <strong>Reward meaningful engagement</strong>
                  <p>
                    Comments, bookmarks, helpful reviews, and completions should
                    rank higher than raw opens.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
