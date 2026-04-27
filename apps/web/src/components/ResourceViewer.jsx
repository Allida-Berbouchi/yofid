"use client";

import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import "./ResourceInteraction.css";
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

  // Determine if we're showing PDF or image for conditional rendering
  const isPdfOrImage = resourceType === "pdf" || resourceType === "image";

  return (
    <div className={`resource-viewer ${isPdfOrImage ? 'centered-mode' : ''}`}>
      <div className="space-y-6">
        {/* Hide title section for PDF and image */}
        {!isPdfOrImage && (
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{resource.title}</h1>
            <p className="text-gray-500">
              {resourceModule} · {resourceType.toUpperCase()}
            </p>
          </div>
        )}

        {/* Conditional card class based on resource type */}
        <div className={`card ${resourceType === 'pdf' ? 'pdf-card' : resourceType === 'image' ? 'image-card' : ''} p-6 overflow-hidden`}>
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
              className="centered-image"
            />
          )}

          {resourceType === "pdf" && (
            <div className="pdf-container">
              <div className="pdf-wrapper">
                <iframe
                  src={fileUrl}
                  title={resource.title}
                  className="pdf-iframe"
                />
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-block pdf-link"
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

        {/* Hide description section for PDF and image */}
        {!isPdfOrImage && resource.description && resourceType !== "text" && (
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{resource.description}</p>
          </div>
        )}
        {!isPdfOrImage && resource.description && resourceType !== "text" && (
  <div className="flex flex-col gap-6">
    {/* 1. Existing Description Card */}
    <div className="card p-6">
      <h3 className="text-xl font-semibold mb-3">Description</h3>
      <p className="text-gray-700 leading-relaxed">{resource.description}</p>
    </div>

    {/* 2. Video Case */}
    {resourceType === "video" && resource.videoUrl && (
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-3">Video Preview</h3>
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <video 
            src={resource.videoUrl} 
            controls 
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )}

    {/* 3. Link Case */}
    {resourceType === "link" && resource.externalUrl && (
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-3">External Resource</h3>
        <p className="text-gray-600 mb-4">Click the button below to visit the external link.</p>
        <a 
          href={resource.externalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Visit Link 
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    )}
  </div>
)}
{resourceType === "pdf" && resource.pdfUrl && (
  <div className="card p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold">PDF Document</h3>
      <a 
        href={resource.pdfUrl} 
        download 
        className="pdf-download-btn"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="配M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </a>
    </div>

    {/* PDF Preview Frame */}
    <div className="pdf-preview-container">
      <iframe
        src={`${resource.pdfUrl}#toolbar=0`}
        className="pdf-iframe"
        title="PDF Preview"
      ></iframe>
      <div className="pdf-overlay-footer">
        <p className="text-sm text-gray-500">Previewing document...</p>
        <a href={resource.pdfUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-medium hover:underline">
          Open in New Tab
        </a>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}