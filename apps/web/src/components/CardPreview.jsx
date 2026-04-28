import Link from "next/link";

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
    <path d="M12 23a9 9 0 0 0 0-18c-1.5 0-3 .4-4.3 1.1 1.3 1.5 2 3.4 2 5.4 0 2-1 3.9-2.5 5.1 1.3.9 2.9 1.4 4.8 1.4Z" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" strokeLinecap="round" />
  </svg>
);

// ========== COVERS ==========
const COVERS = ["cover-1", "cover-2", "cover-3", "cover-4", "cover-5", "cover-6", "cover-7", "cover-8"];

// ========== HELPER FUNCTION ==========
function getCategoryBadge(category = "") {
  if (!category) return "blue";
  const cat = category.toLowerCase();
  if (cat.includes("web")) return "blue";
  if (cat.includes("cloud")) return "green";
  if (cat.includes("ai") || cat.includes("ml")) return "red";
  if (cat.includes("data")) return "purple";
  return "blue";
}

// ========== MAIN COMPONENT ==========
export default function CardPreview({ item, rank }) {
  // Safety check - if no item, return null
  if (!item || !item._id) {
    return null;
  }

  const cover = COVERS[((rank || 1) - 1) % COVERS.length];
  const isVideo = item.type?.toLowerCase() === "video";
  const badgeColor = getCategoryBadge(item.category);

  return (
    <Link 
      href={`/watch?id=${encodeURIComponent(item._id)}`} 
      className="section-card course-card" 
      style={{ display: "block", textDecoration: "none", cursor: "pointer" }}
    >
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
            zIndex: 2,
          }}
        >
          #{rank || "?"}
        </span>

        {/* category badge */}
        <div className="cover-badge" style={{ zIndex: 2 }}>
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
            zIndex: 1,
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
          {item.rating ? Number(item.rating).toFixed(1) : "New"}
          <span style={{ color: "#8090aa", fontWeight: 700, marginLeft: 6, fontSize: 13 }}>
            {item.type || "Resource"}
          </span>
        </div>

        <h3 className="course-title">{item.title || "Untitled"}</h3>

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