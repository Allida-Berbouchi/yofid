import Image from "next/image";
import Link from "next/link";

export default function CourseCard({ 
  _id,
  title, 
  description, 
  avgTime, 
  icon,
  createdBy,
  onCardClick
}) {
  const formatTime = (seconds) => {
    if (!seconds || seconds === 0) return null;
    
    if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.round((seconds % 3600) / 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      const days = Math.floor(seconds / 86400);
      const hours = Math.round((seconds % 86400) / 3600);
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
  };

  const timeDisplay = formatTime(avgTime);

  return (
    <article 
      className="section-card course-card"
      onClick={() => onCardClick?.(_id)}
      style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="course-cover">
        <div className="course-image-wrapper">
          {icon ? (
            <img
              src={icon}
              alt={title}
              className="course-image"
              onError={(e) => {
                e.target.src = "/default-course-icon.svg";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px 8px 0 0"
              }}
            />
          ) : (
            <img
              src="/default-course-icon.svg"
              alt="Default course icon"
              className="course-image"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px 8px 0 0"
              }}
            />
          )}
        </div>
        
        {timeDisplay && (
          <span className="cover-badge soft-badge">
            ⏱ {timeDisplay}
          </span>
        )}
      </div>

      <div className="course-card-body">
        <h3 className="course-title">{title}</h3>
        <p className="course-desc">{description}</p>
        
        {createdBy && (
          <p className="course-creator">
            by {createdBy.name || "Unknown"}
          </p>
        )}

        <div className="course-footer">
          <Link href={`/courses/${_id}`}>
            <button className="btn-explore">
              View Course
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .course-image-wrapper {
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .course-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }

        .course-desc {
          font-size: 0.9rem;
          color: #666;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .course-creator {
          font-size: 0.85rem;
          color: #999;
          margin: 0 0 10px 0;
        }

        .btn-explore {
          width: 100%;
          padding: 10px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-explore:hover {
          opacity: 0.9;
        }

        .cover-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(102, 126, 234, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>
    </article>
  );
}
