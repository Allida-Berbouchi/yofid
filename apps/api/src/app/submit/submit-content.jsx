"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import { apiFetch } from "@/lib/api";

export default function SubmitResourceContent() {
  const [form, setForm] = useState({
    title: "",
    type: "video",
    moduleId: "",
    sourceUrl: "",
    description: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      if (uploadedFile) {
        throw new Error("The current backend accepts resource URLs only. Please provide a public URL instead of a direct file upload.");
      }

      await apiFetch("/api/content", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          type: form.type,
          category: form.moduleId,
          subject: form.moduleId,
          url: form.sourceUrl,
        }),
      });

      setStatus("success");
      setForm({
        title: "",
        type: "video",
        moduleId: "",
        sourceUrl: "",
        description: "",
      });
      setUploadedFile(null);
      setVideoPreview(null);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Submission failed");
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-2">Add a Learning Resource</h1>
          <p className="text-gray-600 mb-8">
            Submit a learning resource directly to the platform.
          </p>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              Thanks! Your resource was submitted for review.
            </div>
          )}

          {status === "error" && error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., React Hooks Tutorial"
                className="input-field"
                required
                disabled={status === "submitting"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => {
                  setForm({ ...form, type: e.target.value });
                  setUploadedFile(null);
                  setVideoPreview(null);
                }}
                className="input-field"
                disabled={status === "submitting"}
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="article">Article</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module *
              </label>
              <input
                type="text"
                value={form.moduleId}
                onChange={(e) => setForm({ ...form, moduleId: e.target.value })}
                placeholder="e.g., frontend-basics"
                className="input-field"
                required
                disabled={status === "submitting"}
              />
            </div>

            {form.type === "video" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video File
                  </label>
                  <VideoUpload
                    onFileSelect={(file, preview) => {
                      setUploadedFile(file);
                      setVideoPreview(preview);
                    }}
                    disabled={status === "submitting"}
                    videoPreview={videoPreview || undefined}
                    selectedFileName={uploadedFile?.name}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={form.sourceUrl}
                    onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="input-field"
                    disabled={status === "submitting" || !!uploadedFile}
                  />
                </div>
              </div>
            )}

            {form.type !== "video" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource URL
                </label>
                <input
                  type="url"
                  value={form.sourceUrl}
                  onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="input-field"
                  disabled={status === "submitting"}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the resource..."
                className="input-field"
                rows={4}
                disabled={status === "submitting"}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Submitting..." : "Submit Resource"}
              </button>
              <Link href="/" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
