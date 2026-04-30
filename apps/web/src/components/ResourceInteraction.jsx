"use client";

import { useEffect, useMemo, useState } from "react";
import "./ResourceInteraction.css";
import {
  fetchResourceFeedback,
  saveResourceComment,
  saveResourceReview,
  trackContentInteraction,
} from "@/lib/api";

function getInitials(name) {
  if (!name) return "G";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getUsername(name) {
  if (!name) return "guest";

  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function readStoredUser() {
  if (typeof window === "undefined") {
    return { name: "Guest", role: "Student" };
  }

  try {
    const rawUser =
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser") ||
      localStorage.getItem("profile");

    if (rawUser) {
      const parsed = JSON.parse(rawUser);

      return {
        name:
          parsed?.name ||
          parsed?.fullName ||
          parsed?.username ||
          parsed?.email?.split("@")[0] ||
          "Guest",
        role: parsed?.role || parsed?.type || "Student",
      };
    }

    const username =
      localStorage.getItem("username") ||
      localStorage.getItem("name") ||
      "Guest";

    return {
      name: username,
      role: "Student",
    };
  } catch {
    return { name: "Guest", role: "Student" };
  }
}

function formatCommentDate(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeComment(comment = {}) {
  const userName = comment.user || comment.userId?.name || "Learner";

  return {
    id: comment.id || comment._id || `${Date.now()}-${Math.random()}`,
    user: userName,
    username: comment.username || getUsername(userName),
    text: comment.text || comment.content || "",
    role: comment.role || comment.userId?.role || "Student",
    createdAt: formatCommentDate(comment.createdAt),
  };
}

export default function ResourceInteraction({ resourceId, currentUser }) {
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSavingReaction, setIsSavingReaction] = useState(false);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(
    currentUser || { name: "Guest", role: "Student" }
  );
  const [comments, setComments] = useState([]);

  const displayName = user?.name || "Guest";
  const username = getUsername(displayName);
  const initials = getInitials(displayName);
  const activeStars = hoverRating || rating;

  const ratingLabel = useMemo(() => {
    if (!reviewCount) return "No reviews yet";
    return `${Number(averageRating || 0).toFixed(1)} from ${reviewCount} review${reviewCount === 1 ? "" : "s"}`;
  }, [averageRating, reviewCount]);

  useEffect(() => {
    if (!currentUser) {
      setUser(readStoredUser());
    }
  }, [currentUser]);

  useEffect(() => {
    let active = true;

    async function loadFeedback() {
      if (!resourceId) return;

      setIsLoadingFeedback(true);
      setError("");

      try {
        const feedback = await fetchResourceFeedback(resourceId);

        if (!active) return;

        setComments(Array.isArray(feedback.comments) ? feedback.comments.map(normalizeComment) : []);
        setAverageRating(Number(feedback.averageRating || 0));
        setReviewCount(Number(feedback.reviewCount || 0));
        setRating(Number(feedback.userReview?.rating || 0));
      } catch (err) {
        if (active) {
          setError(err?.message || "Could not load comments and reviews.");
        }
      } finally {
        if (active) {
          setIsLoadingFeedback(false);
        }
      }
    }

    loadFeedback();

    return () => {
      active = false;
    };
  }, [resourceId]);

  async function handleRating(nextRating) {
    if (!resourceId || isSavingReaction) return;

    const previousRating = rating;
    const previousAverage = averageRating;
    const previousCount = reviewCount;

    setError("");
    setRating(nextRating);
    setIsSavingReaction(true);

    try {
      const result = await saveResourceReview(resourceId, nextRating);
      setAverageRating(Number(result.averageRating || nextRating));
      setReviewCount(Number(result.reviewCount || previousCount || 1));

      if (nextRating >= 4 && previousRating < 4) {
        setLikes((currentLikes) => currentLikes + 1);
        await trackContentInteraction(resourceId, "like").catch(() => null);
      }
    } catch (err) {
      setRating(previousRating);
      setAverageRating(previousAverage);
      setReviewCount(previousCount);
      setError(err?.message || "Could not save your review. Please log in again.");
    } finally {
      setIsSavingReaction(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function handlePostComment(event) {
    event.preventDefault();

    const cleanComment = commentText.trim();
    if (!cleanComment || !resourceId || isSavingComment) return;

    const tempId = `${Date.now()}-${Math.random()}`;
    const optimisticComment = {
      id: tempId,
      user: displayName,
      username,
      text: cleanComment,
      role: user?.role || "Student",
      createdAt: "Just now",
    };

    setError("");
    setCommentText("");
    setIsSavingComment(true);
    setComments((currentComments) => [optimisticComment, ...currentComments]);

    try {
      const result = await saveResourceComment(resourceId, cleanComment);
      const savedComment = normalizeComment(result.comment);

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment.id === tempId ? savedComment : comment
        )
      );
    } catch (err) {
      setComments((currentComments) =>
        currentComments.filter((comment) => comment.id !== tempId)
      );
      setCommentText(cleanComment);
      setError(err?.message || "Could not save your comment. Please log in again.");
    } finally {
      setIsSavingComment(false);
    }
  }

  return (
    <section className="interaction-shell">
      <div className="interaction-card interaction-card-premium">
        <div className="interaction-top-row">
          <div className="review-summary">
            <span className="review-kicker">Learner review</span>
            <strong>{ratingLabel}</strong>
          </div>

          <button type="button" className="copy-button" onClick={copyToClipboard}>
            🔗 {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        {error && <p className="interaction-error">{error}</p>}

        <div className="rating-panel" aria-label="Rate this resource">
          <div>
            <h2>How good was this resource?</h2>
            <p>Your review is saved to the database and updates the resource rating.</p>
          </div>

          <div className="star-rating" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= activeStars ? "is-active" : ""}`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                disabled={isSavingReaction}
                aria-label={`Rate ${star} out of 5`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <form className="comment-form" onSubmit={handlePostComment}>
          <div className="avatar avatar-large">{initials}</div>

          <div className="comment-input-wrap">
            <div className="comment-user-line">
              Commenting as <strong>@{username}</strong>
            </div>

            <input
              className="comment-input"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              disabled={isSavingComment}
            />

            <div className="comment-actions">
              {commentText && (
                <button
                  type="button"
                  className="cancel-comment-button"
                  onClick={() => setCommentText("")}
                  disabled={isSavingComment}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="submit-comment-button"
                disabled={!commentText.trim() || isSavingComment}
              >
                {isSavingComment ? "Saving..." : "Comment"}
              </button>
            </div>
          </div>
        </form>

        <div className="comments-section">
          <h2>{isLoadingFeedback ? "Loading comments..." : `${comments.length} Comments`}</h2>

          <div className="comments-list">
            {!isLoadingFeedback && !comments.length && (
              <p className="empty-comments">No comments yet. Start the discussion.</p>
            )}

            {comments.map((comment) => (
              <article key={comment.id} className="comment-item">
                <div className="avatar">{getInitials(comment.user)}</div>

                <div className="comment-body">
                  <div className="comment-meta">
                    <strong>@{comment.username || getUsername(comment.user)}</strong>

                    {comment.role && (
                      <span className="comment-badge">{comment.role}</span>
                    )}

                    <span>{comment.createdAt}</span>
                  </div>

                  <p>{comment.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
