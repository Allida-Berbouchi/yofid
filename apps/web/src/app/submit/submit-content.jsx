"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import { apiFetch } from "@/lib/api";
export default function SubmitResourceContent() {
    const params = useSearchParams();
    const inviteToken = useMemo(() => params.get("token") || "", [params]);
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
            if ((form.type === "video" || form.type === "image" || form.type === "pdf") && uploadedFile) {
                // Upload image/video/pdf file
                const formData = new FormData();
                formData.append("file", uploadedFile);
                formData.append("title", form.title);
                formData.append("description", form.description);
                formData.append("moduleId", form.moduleId);
                formData.append("inviteToken", inviteToken);
                const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/resources/upload-file`, {
                    method: "POST",
                    body: formData,
                });
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || "File upload failed");
                }
                await uploadResponse.json();
                setStatus("success");
                setUploadedFile(null);
                setVideoPreview(null);
            }
            else {
                // Submit with URL or text
                if (form.type === "image") {
                    throw new Error("Please upload an image file");
                }
                if (form.type === "pdf" && !form.sourceUrl) {
                    throw new Error("Please upload a PDF file or provide a PDF URL");
                }
                if (form.type === "video" && !form.sourceUrl) {
                    throw new Error("Please provide a video URL or upload a video file");
                }
                await apiFetch("/resources/submit", {
                    method: "POST",
                    body: JSON.stringify({
                        inviteToken,
                        ...form,
                    }),
                });
                setStatus("success");
            }
            setForm({
                title: "",
                type: "video",
                moduleId: "",
                sourceUrl: "",
                description: "",
            });
            setUploadedFile(null);
            setVideoPreview(null);
        }
        catch (err) {
            setStatus("error");
            setError(err.message || "Submission failed");
        }
    };
    return (<>
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="card p-8">
          <h1 className="text-3xl font-bold mb-2">Add a Learning Resource</h1>
          <p className="text-gray-600 mb-8">
            Submit a learning resource using your invite link.
          </p>

          {!inviteToken && (<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              ⚠️ Missing invite token. Please use the link from your email.
            </div>)}

          {status === "success" && (<div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              ✅ Thanks! Your resource was submitted for review.
            </div>)}

          {status === "error" && error && (<div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              ❌ {error}
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., React Hooks Tutorial" className="input-field" required disabled={!inviteToken || status === "submitting"}/>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type *
              </label>
              <select value={form.type} onChange={(e) => {
            setForm({ ...form, type: e.target.value });
            setUploadedFile(null);
            setVideoPreview(null);
        }} className="input-field" disabled={!inviteToken || status === "submitting"}>
                <option value="video">🎥 Video</option>
                <option value="image">🖼️ Image</option>
                <option value="text">📝 Text</option>
                <option value="pdf">📄 PDF</option>
                <option value="link">🔗 Link</option>
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module *
              </label>
              <input type="text" value={form.moduleId} onChange={(e) => setForm({ ...form, moduleId: e.target.value })} placeholder="e.g., module-1" className="input-field" required disabled={!inviteToken || status === "submitting"}/>
            </div>

            {/* Video Upload or URL */}
            {form.type === "video" && (<div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video File
                  </label>
                  <VideoUpload onFileSelect={(file, preview) => {
                setUploadedFile(file);
                setVideoPreview(preview);
            }} disabled={!inviteToken || status === "submitting"} videoPreview={videoPreview || undefined} selectedFileName={uploadedFile?.name}/>
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
                    Video URL (e.g., YouTube, Vimeo)
                  </label>
                  <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="input-field" disabled={!inviteToken || status === "submitting" || !!uploadedFile}/>
                  <p className="text-sm text-gray-500 mt-1">
                    If you don't upload a video file, provide a video URL
                  </p>
                </div>
              </div>)}

            {/* Image Upload */}
            {form.type === "image" && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image File *
                </label>
                <input type="file" accept="image/*" onChange={(e) => {
                const nextFile = e.currentTarget.files?.[0] || null;
                setUploadedFile(nextFile);
            }} className="input-field" required disabled={!inviteToken || status === "submitting"}/>
                {uploadedFile && (<p className="text-sm text-gray-500 mt-1">Selected: {uploadedFile.name}</p>)}
              </div>)}

            {/* PDF Upload */}
            {form.type === "pdf" && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF File (optional if URL provided)
                </label>
                <input type="file" accept="application/pdf" onChange={(e) => {
                const nextFile = e.currentTarget.files?.[0] || null;
                setUploadedFile(nextFile);
            }} className="input-field" disabled={!inviteToken || status === "submitting"}/>
                {uploadedFile && (<p className="text-sm text-gray-500 mt-1">Selected: {uploadedFile.name}</p>)}
              </div>)}

            {/* Source URL for other types */}
            {form.type !== "video" && form.type !== "image" && form.type !== "text" && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source URL {form.type === "link" && "*"}
                </label>
                <input type="url" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="https://example.com" className="input-field" required={form.type === "link"} disabled={!inviteToken || status === "submitting"}/>
              </div>)}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the resource..." className="input-field" rows={4} disabled={!inviteToken || status === "submitting"}/>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button type="submit" className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!inviteToken || status === "submitting"}>
                {status === "submitting" ? "Submitting..." : "Submit Resource"}
              </button>
              <Link href="/" className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>);
}
