"use client";
import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";
import { apiFetch, API_URL } from "@/lib/api";
function toAbsoluteUrl(url) {
    if (!url)
        return "";
    if (url.startsWith("http://") || url.startsWith("https://"))
        return url;
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
                const data = await apiFetch(`/resources/${resourceId}`);
                if (active)
                    setResource(data.item);
            }
            catch (e) {
                if (active)
                    setError(e?.message || "Failed to fetch resource");
            }
            finally {
                if (active)
                    setIsLoading(false);
            }
        }
        loadResource();
        return () => {
            active = false;
        };
    }, [resourceId]);
    const fileUrl = useMemo(() => toAbsoluteUrl(resource?.sourceUrl), [resource?.sourceUrl]);
    if (isLoading) {
        return (<div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-6 text-center text-gray-600">Loading resource...</div>
      </div>);
    }
    if (error || !resource) {
        return (<div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-6 text-center text-red-700">{error || "Resource not found"}</div>
      </div>);
    }
    return (<div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">{resource.title}</h1>
        <p className="text-gray-500">
          {resource.moduleId} • {resource.type.toUpperCase()}
        </p>
      </div>

      <div className="card p-6 overflow-hidden">
        {resource.type === "video" && (<div className="bg-black rounded-lg overflow-hidden">
            <ReactPlayer src={fileUrl} controls width="100%" height="100%" style={{ aspectRatio: "16 / 9" }}/>
          </div>)}

        {resource.type === "image" && (<img src={fileUrl} alt={resource.title} className="w-full rounded-lg max-h-[70vh] object-contain"/>)}

        {resource.type === "pdf" && (<div className="space-y-3">
            <div className="rounded border border-gray-200 overflow-hidden">
              <iframe src={fileUrl} title={resource.title} className="w-full h-[80vh]"/>
            </div>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-block">
              Open PDF in new tab
            </a>
          </div>)}

        {resource.type === "text" && (<article className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{resource.description || "No content available."}</p>
          </article>)}

        {resource.type === "link" && resource.sourceUrl && (<div className="flex flex-col items-center justify-center py-10">
            <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Open External Link
            </a>
          </div>)}
      </div>

      {resource.description && resource.type !== "text" && (<div className="card p-6">
          <h3 className="text-xl font-semibold mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{resource.description}</p>
        </div>)}
    </div>);
}
