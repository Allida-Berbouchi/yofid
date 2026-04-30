"use client";

import { useEffect, useState } from "react";
import "./ResourceInteraction.css";
import { trackContentInteraction } from "@/lib/api";

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

function getDefaultComments() {
  return [
    {
      id: "welcome-comment",
      user: "Course Team",
      text: "Discussion is open. Share your thoughts below.",
      role: "Owner",
      createdAt: "Pinned",
    },
  ];
}

export default function ResourceInteraction({ resourceId, currentUser }) {
  const [likes, setLikes] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSavingReaction, setIsSavingReaction] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(
    currentUser || { name: "Guest", role: "Student" }
  );
  const [comments, setComments] = useState(getDefaultComments);

  const storageKey = `resource-interaction:${resourceId || "unknown"}`;

  const displayName = user?.name || "Guest";
  const username = getUsername(displayName);
  const initials = getInitials(displayName);

  useEffect(() => {
    if (!currentUser) {
      setUser(readStoredUser());
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (typeof parsed.likes === "number") setLikes(parsed.likes);
      if (parsed.reaction) setReaction(parsed.reaction);
      if (Array.isArray(parsed.comments)) setComments(parsed.comments);
    } catch {
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        likes,
        reaction,
        comments,
      })
    );
  }, [likes, reaction, comments, storageKey]);

  async function handleReaction(nextReaction) {
    if (!resourceId || isSavingReaction) return;

    setError("");

    const previousReaction = reaction;
    const previousLikes = likes;
    const isRemoving = previousReaction === nextReaction;
    const finalReaction = isRemoving ? null : nextReaction;

    // UI update first, so it feels fast.
    setReaction(finalReaction);

    setLikes((currentLikes) => {
      if (previousReaction === "like" && finalReaction !== "like") {
        return Math.max(0, currentLikes - 1);
      }

      if (previousReaction !== "like" && finalReaction === "like") {
        return currentLikes + 1;
      }

      return currentLikes;
    });

    // Only send score when user adds a like.
    // Your backend supports "like", but not "removeLike" yet.
    if (finalReaction !== "like" || previousReaction === "like") {
      return;
    }

    try {
      setIsSavingReaction(true);
      await trackContentInteraction(resourceId, "like");
    } catch (err) {
      // Roll back if API fails.
      setReaction(previousReaction);
      setLikes(previousLikes);
      setError(err?.message || "Could not update score. Please log in again.");
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
    if (!cleanComment || !resourceId) return;

    const newComment = {
      id: crypto?.randomUUID?.() || String(Date.now()),
      user: displayName,
      username,
      text: cleanComment,
      role: user?.role || "Student",
      createdAt: "Just now",
    };

    setComments((currentComments) => [newComment, ...currentComments]);
    setCommentText("");

    try {
      await trackContentInteraction(resourceId, "comment");
    } catch {
      // Comment stays local, but score update failed.
    }
  }

  return (
    <section className="interaction-shell">
      <div className="interaction-card">
        <div className="interaction-top-row">
          <div className="reaction-group" aria-label="Resource reactions">
            <button
              type="button"
              className={`reaction-button ${
                reaction === "like" ? "is-active" : ""
              }`}
              onClick={() => handleReaction("like")}
              aria-pressed={reaction === "like"}
              disabled={isSavingReaction}
            >
              <span>👍</span>
              <strong>{likes}</strong>
            </button>

            <span className="reaction-divider" />

            <button
              type="button"
              className={`reaction-button ${
                reaction === "dislike" ? "is-active" : ""
              }`}
              onClick={() => handleReaction("dislike")}
              aria-pressed={reaction === "dislike"}
              disabled={isSavingReaction}
            >
              <span>👎</span>
            </button>
          </div>

          <button type="button" className="copy-button" onClick={copyToClipboard}>
            🔗 {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        {error && <p className="interaction-error">{error}</p>}

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
            />

            <div className="comment-actions">
              {commentText && (
                <button
                  type="button"
                  className="cancel-comment-button"
                  onClick={() => setCommentText("")}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="submit-comment-button"
                disabled={!commentText.trim()}
              >
                Comment
              </button>
            </div>
          </div>
        </form>

        <div className="comments-section">
          <h2>{comments.length} Comments</h2>

          <div className="comments-list">
            {comments.map((comment) => (
              <article key={comment.id} className="comment-item">
                <div className="avatar">{getInitials(comment.user)}</div>

                <div className="comment-body">
                  <div className="comment-meta">
                    <strong>
                      @{comment.username || getUsername(comment.user)}
                    </strong>

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