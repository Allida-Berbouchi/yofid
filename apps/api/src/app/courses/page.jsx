"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import CourseCard from "@/components/CourseCard";
import  {fetchCourses} from "@/lib/api";

const SearchLineIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 16 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const coursesPerPage = 12;

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const data = await fetchCourses();
        setCourses(data || []);
        setFilteredCourses(data || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Could not load courses.");
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

  
    if (selectedFilter !== "all") {
      filtered = filtered.filter((course) => course.discipline === selectedFilter);
    }

    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, courses]);

  const handleClearFilters = () => {
    setSelectedFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
  };


  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleCourseClick = (courseId) => {
    window.location.href = `/courses/${courseId}`;
  };

  return (
    <AppLayout>
      <Topbar
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="page-shell">
        <section className="page-head">
          <h1 className="page-title">Course Catalog</h1>
          <p className="page-subtitle">
            Expand your technical depth through curated architecture and engineering tracks,
            from system design to artificial intelligence.
          </p>
        </section>

        {error && (
          <div className="error-banner" style={{
            padding: "16px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "8px",
            color: "#c33",
            marginBottom: "20px"
          }}>
            {error}
          </div>
        )}

        <section className="section-card catalog-panel">
          <div className="chip-row" style={{ marginTop: "22px" }}>
            <button
              className={`chip ${selectedFilter === "all" ? "active" : ""}`}
              onClick={() => setSelectedFilter("all")}
            >
              All Disciplines
            </button>
            <button
              className={`chip ${selectedFilter === "algorithms" ? "active" : ""}`}
              onClick={() => setSelectedFilter("algorithms")}
            >
              Algorithms
            </button>
            <button
              className={`chip ${selectedFilter === "system-design" ? "active" : ""}`}
              onClick={() => setSelectedFilter("system-design")}
            >
              System Design
            </button>
            <button
              className={`chip ${selectedFilter === "ai-ml" ? "active" : ""}`}
              onClick={() => setSelectedFilter("ai-ml")}
            >
              AI and ML
            </button>
            <button
              className={`chip ${selectedFilter === "cloud" ? "active" : ""}`}
              onClick={() => setSelectedFilter("cloud")}
            >
              Cloud Infrastructure
            </button>
            <button
              className={`chip ${selectedFilter === "data-structures" ? "active" : ""}`}
              onClick={() => setSelectedFilter("data-structures")}
            >
              Data Structures
            </button>
          </div>

          <div className="filters-bar">
            <button className="filter-pill">Skill Level <span>⌄</span></button>
            <button className="filter-pill">Duration <span>◔</span></button>
            <button className="filter-pill">Rating <span>☆</span></button>
            {(selectedFilter !== "all" || searchQuery) && (
              <button className="clear-link" onClick={handleClearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </section>

        <div className="section-label">
          {loading ? (
            "Loading courses..."
          ) : (
            `DISPLAYING ${paginatedCourses.length} of ${filteredCourses.length} RESULTS`
          )}
        </div>

        {loading ? (
          <div style={{ 
            padding: "40px", 
            textAlign: "center", 
            color: "#999",
            fontSize: "1.1rem"
          }}>
            Loading courses...
          </div>
        ) : paginatedCourses.length === 0 ? (
          <div style={{
            padding: "40px",
            textAlign: "center",
            color: "#999",
            fontSize: "1.1rem"
          }}>
            No courses found. Try adjusting your filters.
          </div>
        ) : (
          <>
            <section className="course-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
              marginBottom: "40px"
            }}>
              {paginatedCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  {...course}
                  onCardClick={handleCourseClick}
                />
              ))}
            </section>

            {totalPages > 1 && (
              <div className="pagination" style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "40px"
              }}>
                <button
                  className="page-dot"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                  ‹
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`page-dot ${currentPage === pageNum ? "active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        backgroundColor: currentPage === pageNum ? "#667eea" : "transparent",
                        color: currentPage === pageNum ? "white" : "inherit",
                        cursor: "pointer"
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 7 && currentPage < totalPages - 3 && (
                  <span className="page-dot">…</span>
                )}

                <button
                  className="page-dot"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .page-shell {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-head {
          margin-bottom: 32px;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .catalog-panel {
          padding: 24px;
          margin-bottom: 32px;
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .chip {
          padding: 8px 16px;
          background: #f5f5f5;
          border: 2px solid transparent;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #666;
        }

        .chip:hover {
          background: #efefef;
        }

        .chip.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .filters-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }

        .filter-pill {
          padding: 8px 16px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #666;
        }

        .filter-pill:hover {
          background: #f9f9f9;
          border-color: #667eea;
        }

        .clear-link {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
          padding: 0;
        }

        .clear-link:hover {
          color: #764ba2;
        }

        .section-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #999;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .course-grid {
          margin-bottom: 40px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .page-dot {
          min-width: 40px;
          height: 40px;
          padding: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          color: #666;
        }

        .page-dot:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: #667eea;
        }

        .page-dot.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .page-dot:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.8rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .chip-row {
            gap: 8px;
          }

          .chip {
            padding: 6px 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </AppLayout>
  );
}
