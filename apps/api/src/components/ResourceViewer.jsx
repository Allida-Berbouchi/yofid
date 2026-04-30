"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./ResourceInteraction.css";
import {
  API_URL,
  fetchContentById,
  fetchContentProgress,
  saveContentProgress,
} from "@/lib/api";

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

function formatPercent(value) {
  return `${Math.round(Math.max(0, Math.min(100, Number(value || 0))))}%`;
}

export default function ResourceViewer({ resourceId }) {
  const [resource, setResource] = useState(null);
  const [progress, setProgress] = useState({
    status: "not_started",
    progressPercent: 0,
    lastPosition: 0,
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [error, setError] = useState("");
  const [progressError, setProgressError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const lastSyncRef = useRef({ at: 0, percent: 0 });
  const viewTrackedRef = useRef("");

  useEffect(() => {
    let active = true;

    async function loadResource() {
      setIsLoading(true);
      setError("");
      setProgressError("");

      try {
        const [data, savedProgress] = await Promise.all([
          fetchContentById(resourceId),
          fetchContentProgress(resourceId).catch(() => null),
        ]);

        if (!active) return;

        setResource(data);
        if (savedProgress) setProgress(savedProgress);
      } catch (fetchError) {
        if (active) {
          setError(fetchError?.message || "Failed to fetch resource");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadResource();

    return () => {
      active = false;
    };
  }, [resourceId]);

  const fileUrl = useMemo(
    () => toAbsoluteUrl(resource?.sourceUrl),
    [resource?.sourceUrl]
  );
  const resourceType = resource?.type || "link";
  const resourceModule = resource?.moduleId || "General";

  async function syncProgress(payload, { silent = true } = {}) {
    if (!resourceId) return null;

    try {
      const result = await saveContentProgress(resourceId, payload);
      if (result?.progress) setProgress(result.progress);
      if (Array.isArray(result?.unlockedAchievements)) {
        setUnlockedAchievements(result.unlockedAchievements);
      }
      setProgressError("");
      return result;
    } catch (saveError) {
      if (!silent) {
        setProgressError(saveError?.message || "Could not save your progress.");
      }
      return null;
    }
  }

  useEffect(() => {
    if (!resource?._id || viewTrackedRef.current === resource._id) return;

    viewTrackedRef.current = resource._id;

    const startingPercent = resource.type === "video" ? Math.max(1, Number(progress.progressPercent || 0)) : Math.max(25, Number(progress.progressPercent || 0));

    syncProgress({
      interactionType: "view",
      progressPercent: startingPercent,
      lastPosition: Number(progress.lastPosition || 0),
    });
  }, [resource?._id, resource?.type]);

  function handleVideoProgress(playerState = {}) {
    const playedSeconds = Number(playerState.playedSeconds || 0);
    const played = Number(playerState.played || 0);
    const percent = Math.max(
      1,
      Math.min(99, Math.round((Number.isFinite(played) ? played : 0) * 100))
    );
    const now = Date.now();
    const lastSync = lastSyncRef.current;

    if (percent - lastSync.percent < 5 && now - lastSync.at < 15000) {
      return;
    }

    lastSyncRef.current = { at: now, percent };

    syncProgress({
      interactionType: "progress",
      progressPercent: percent,
      lastPosition: playedSeconds,
    });
  }

  function handleVideoDuration(duration) {
    const durationSeconds = Number(duration || 0);
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return;

    syncProgress({
      interactionType: "progress",
      durationSeconds,
      progressPercent: Number(progress.progressPercent || 1),
    });
  }

  function handleVideoEnded() {
    syncProgress(
      {
        interactionType: "complete",
        progressPercent: 100,
        status: "completed",
      },
      { silent: false }
    );
  }

  function handleOpenExternal() {
    syncProgress({
      interactionType: "complete",
      progressPercent: 100,
      status: "completed",
    });
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-6 text-center text-gray-600">Loading resource...</div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-6 text-center text-red-700">
          {error || "Resource not found"}
        </div>
      </div>
    );
  }

  const isPdfOrImage = resourceType === "pdf" || resourceType === "image";
  const progressPercent = Number(progress?.progressPercent || 0);

  return (
    <div className={`resource-viewer ${isPdfOrImage ? "centered-mode" : ""}`}>
      <div className="space-y-6">
        {!isPdfOrImage && (
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{resource.title}</h1>
            <p className="text-gray-500">
              {resourceModule} · {resourceType.toUpperCase()}
            </p>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Your progress
              </p>
              <p className="text-sm font-medium text-slate-900">
                {progress?.status === "completed" ? "Completed" : "Learning in progress"}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {formatPercent(progressPercent)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
            />
          </div>
          {progressError && <p className="mt-2 text-sm text-red-600">{progressError}</p>}
          {unlockedAchievements.length > 0 && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Achievement unlocked: {unlockedAchievements.map((item) => item.achievement?.title || item.achievementKey).join(", ")}
            </div>
          )}
        </section>

        <div className={`card ${resourceType === "pdf" ? "pdf-card" : resourceType === "image" ? "image-card" : ""} p-6 overflow-hidden`}>
          {resourceType === "video" && (
            <div className="bg-black rounded-lg overflow-hidden">
              <ReactPlayer
                src={fileUrl}
                controls
                progressInterval={10000}
                onProgress={handleVideoProgress}
                onDuration={handleVideoDuration}
                onEnded={handleVideoEnded}
                width="100%"
                height="100%"
                style={{ aspectRatio: "16 / 9" }}
              />
            </div>
          )}

          {resourceType === "image" && (
            <img src={fileUrl} alt={resource.title} className="centered-image" />
          )}

          {resourceType === "pdf" && (
            <div className="pdf-container">
              <div className="pdf-wrapper">
                <iframe src={fileUrl} title={resource.title} className="pdf-iframe" />
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block pdf-link"
                onClick={handleOpenExternal}
              >
                Open PDF in new tab
              </a>
            </div>
          )}

          {(resourceType === "text" || resourceType === "article") && (
            <article className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {resource.description || "No content available."}
              </p>
              <button type="button" className="btn-primary mt-5" onClick={handleOpenExternal}>
                Mark as completed
              </button>
            </article>
          )}

          {resource.sourceUrl &&
            resourceType !== "video" &&
            resourceType !== "image" &&
            resourceType !== "pdf" &&
            resourceType !== "text" && (
              <div className="flex flex-col items-center justify-center py-10">
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  onClick={handleOpenExternal}
                >
                  Open External Link
                </a>
              </div>
            )}
        </div>

        {!isPdfOrImage && resource.description && resourceType !== "text" && (
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{resource.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
