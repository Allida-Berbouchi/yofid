import { getAccessToken } from "./auth";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

function buildUrl(path) {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildHeaders(opts = {}) {
    const headers = new Headers(opts.headers || {});
    const hasBody = opts.body !== undefined && opts.body !== null;
    const isFormData = typeof FormData !== "undefined" && opts.body instanceof FormData;
    const token = getAccessToken();

    if (hasBody && !isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
}

export async function apiFetch(path, opts = {}) {
    try {
        const res = await fetch(buildUrl(path), {
            ...opts,
            headers: buildHeaders(opts),
        });
        const contentType = res.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
            ? await res.json().catch(() => ({}))
            : await res.text().catch(() => "");

        return {
            ok: res.ok,
            status: res.status,
            data,
        };
    } catch (error) {
        console.error(`API Error on ${path}:`, error);
        return {
            ok: false,
            status: 0,
            data: { message: error?.message || `Failed to fetch ${path}` },
        };
    }
}

export function normalizeContentItem(item = {}) {
    const type = item.type === "article" ? "text" : item.type;
    return {
        ...item,
        _id: item._id || item.id,
        type: type || "link",
        moduleId: item.moduleId || item.subject || item.category || item.gradeLevel || "General",
        sourceUrl: item.sourceUrl || item.url || "",
        url: item.url || item.sourceUrl || "",
    };
}

export async function fetchContentList() {
    const result = await apiFetch("/api/content");

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch content");
    }

    return Array.isArray(result.data) ? result.data.map(normalizeContentItem) : [];
}

export async function fetchTopContent() {
    const result = await apiFetch("/api/content/top");

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch top content");
    }

    return {
        ...result.data,
        topContent: Array.isArray(result.data?.topContent)
            ? result.data.topContent.map(normalizeContentItem)
            : [],
    };
}

export async function trackContentInteraction(contentId, interactionType) {
    const result = await apiFetch("/api/content/interactions", {
        method: "POST",
        body: JSON.stringify({ contentId, interactionType }),
    });

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to update engagement score");
    }

    return normalizeContentItem(result.data?.updatedContent || {});
}

export async function fetchContentById(id) {
    const result = await apiFetch(`/api/content/${id}`);

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch resource");
    }

    return normalizeContentItem(result.data);
}
