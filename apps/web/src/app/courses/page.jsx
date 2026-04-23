import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";

const courses = [
  {
    badge: "ADVANCED",
    badgeTone: "blue",
    cover: "cover-1",
    title: "Micro-Frontend Architecture",
    rating: "4.9",
    desc: "Scale large web applications with autonomous teams and resilient UI boundaries.",
    status: "ENROLLED",
    duration: "12h 45m",
  },
  {
    badge: "MASTERCLASS",
    badgeTone: "green",
    cover: "cover-2",
    title: "Deep Learning Fundamentals",
    rating: "4.8",
    desc: "Build and train sophisticated models with modern production-oriented practices.",
    status: "AVAILABLE",
    duration: "22h 30m",
  },
  {
    badge: "INTERMEDIATE",
    badgeTone: "purple",
    cover: "cover-3",
    title: "Kubernetes Mastery",
    rating: "4.7",
    desc: "Container orchestration at scale, from deployments to observability and rollbacks.",
    status: "ENROLLED",
    duration: "18h 15m",
  },
  {
    badge: "FOUNDATION",
    badgeTone: "blue",
    cover: "cover-4",
    title: "Distributed Systems 101",
    rating: "5.0",
    desc: "Master CAP tradeoffs, consensus concepts, replication, and failure recovery.",
    status: "AVAILABLE",
    duration: "8h 40m",
  },
  {
    badge: "TRENDING NOW",
    badgeTone: "green",
    cover: "cover-5",
    title: "Advanced LLM Orchestration",
    rating: "4.9",
    desc: "Deploy and refine large language workflows with tool use, memory, and evaluation.",
    status: "AVAILABLE",
    duration: "14h 20m",
  },
  {
    badge: "CRITICAL",
    badgeTone: "red",
    cover: "cover-6",
    title: "Zero Trust Architecture",
    rating: "4.6",
    desc: "Design modern security perimeters for distributed teams and hybrid systems.",
    status: "ENROLLED",
    duration: "9h 10m",
  },
  {
    badge: "FOUNDATION",
    badgeTone: "purple",
    cover: "cover-7",
    title: "Data Engineering Patterns",
    rating: "4.9",
    desc: "Build robust ETL pipelines and dependable data services for real-world products.",
    status: "AVAILABLE",
    duration: "16h 50m",
  },
  {
    badge: "EXPERT",
    badgeTone: "purple",
    cover: "cover-8",
    title: "Low-Level System Design",
    rating: "4.7",
    desc: "Optimization techniques for high-performance runtime systems and services.",
    status: "AVAILABLE",
    duration: "30h 00m",
  },
];

const SearchLineIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 16 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function CoursesPage() {
  return (
    <AppLayout>
      <Topbar />
      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">Course Catalog</h1>
          <p className="page-subtitle">
            Expand your technical depth through curated architecture and
            engineering tracks, from system design to artificial intelligence.
          </p>
        </section>

        <section className="section-card catalog-panel">
          <div className="hero-search">
            <span className="inline-search-icon">
              <SearchLineIcon />
            </span>
            <span>What do you want to master today?</span>
          </div>

          <div className="chip-row" style={{ marginTop: "22px" }}>
            <button className="chip active">All Disciplines</button>
            <button className="chip">Algorithms</button>
            <button className="chip">System Design</button>
            <button className="chip">AI and ML</button>
            <button className="chip">Cloud Infrastructure</button>
            <button className="chip">Data Structures</button>
          </div>

          <div className="filters-bar">
            <button className="filter-pill">Skill Level <span>⌄</span></button>
            <button className="filter-pill">Duration <span>◔</span></button>
            <button className="filter-pill">Rating <span>☆</span></button>
            <button className="clear-link">Clear Filters</button>
          </div>
        </section>

        <div className="section-label">DISPLAYING 24 RESULTS</div>

        <section className="course-grid">
          {courses.map((course) => (
            <article key={course.title} className="section-card course-card">
              <div className={`course-cover ${course.cover}`}>
                <span className={`cover-badge soft-badge ${course.badgeTone}`}>
                  {course.badge}
                </span>
              </div>
              <div className="course-card-body">
                <div className="course-rating">★ {course.rating}</div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.desc}</p>
                <div className="course-footer">
                  <span className="course-status">{course.status}</span>
                  <span className="course-duration">{course.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="pagination">
          <span className="page-dot">‹</span>
          <span className="page-dot active">1</span>
          <span className="page-dot">2</span>
          <span className="page-dot">3</span>
          <span className="page-dot">…</span>
          <span className="page-dot">8</span>
          <span className="page-dot">›</span>
        </div>
      </div>
    </AppLayout>
  );
}
