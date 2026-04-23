"use client";

import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";

import { API_URL, fetchContentById } from "@/lib/api";

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export default function ResourceViewer({ resourceId }) {
  const [resource, setResource] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadResource() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchContentById(resourceId);
        if (active) {
          setResource(data);
        }
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{resource.title}</h1>
        <p className="text-gray-500">
          {resourceModule} · {resourceType.toUpperCase()}
        </p>
      </div>

      <div className="card p-6 overflow-hidden">
        {resourceType === "video" && (
          <div className="bg-black rounded-lg overflow-hidden">
            <ReactPlayer
              src={fileUrl}
              controls
              width="100%"
              height="100%"
              style={{ aspectRatio: "16 / 9" }}
            />
          </div>
        )}

        {resourceType === "image" && (
          <img
            src={fileUrl}
            alt={resource.title}
            className="w-full rounded-lg max-h-[70vh] object-contain"
          />
        )}

        {resourceType === "pdf" && (
          <div className="space-y-3">
            <div className="rounded border border-gray-200 overflow-hidden">
              <iframe
                src={fileUrl}
                title={resource.title}
                className="w-full h-[80vh]"
              />
            </div>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-block"
            >
              Open PDF in new tab
            </a>
          </div>
        )}

        {(resourceType === "text" ||
          resourceType === "article" ||
          resourceType === "quiz") && (
          <article className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {resource.description || "No content available."}
            </p>
          </article>
        )}

        {resource.sourceUrl &&
          resourceType !== "video" &&
          resourceType !== "image" &&
          resourceType !== "pdf" && (
            <div className="flex flex-col items-center justify-center py-10">
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Open External Link
              </a>
            </div>
          )}
      </div>

      {resource.description && resourceType !== "text" && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{resource.description}</p>
        </div>
      )}
    </div>
  );
}
