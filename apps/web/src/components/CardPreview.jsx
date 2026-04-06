import Link from "next/link";
import { API_URL } from "@/lib/api";
export default function CardPreview({ resource }) {
    const mediaUrl = resource.sourceUrl?.startsWith("http")
        ? resource.sourceUrl
        : resource.sourceUrl
            ? `${API_URL}${resource.sourceUrl}`
            : undefined;
    return (<Link href={`/resource/${resource._id}`}>
      <div className="card p-4 cursor-pointer hover:shadow-lg hover:scale-105 transition-all transform duration-200">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {resource.type.toUpperCase()} • {resource.moduleId}
        </p>

        <div className="overflow-hidden rounded-lg bg-gray-900 mb-3 h-40 relative group">
          {resource.type === "video" && resource.sourceUrl && (<>
              <video src={mediaUrl} className="w-full h-full object-cover" muted/>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <div className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                  ▶
                </div>
              </div>
            </>)}
          {resource.type === "image" && resource.sourceUrl && (<img src={mediaUrl} alt={resource.title} className="w-full h-full object-cover"/>)}
          {resource.type === "text" && (<div className="p-3 bg-gradient-to-b from-blue-50 to-blue-100 h-full flex flex-col justify-center">
              <p className="text-sm text-gray-700 line-clamp-4">
                {resource.description || "No description"}
              </p>
            </div>)}
          {resource.type === "pdf" && (<div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-orange-50 to-orange-100">
              <span className="text-5xl mb-2">📄</span>
              <p className="text-gray-600 font-medium text-sm">PDF Document</p>
            </div>)}
          {resource.type === "link" && (<div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-green-50 to-green-100">
              <span className="text-5xl mb-2">🔗</span>
              <p className="text-gray-600 font-medium text-sm">External Link</p>
            </div>)}
        </div>

        {resource.description && resource.type !== "text" && (<p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {resource.description}
          </p>)}

        <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm px-3 py-2 rounded font-medium transition">
          View Details
        </button>
      </div>
    </Link>);
}
