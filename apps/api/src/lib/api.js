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

// Content
export function normalizeContentItem(item = {}) {
    const type = item.type === "article" ? "text" : item.type;
    return {
        ...item,
        _id: item._id || item.id,
        type: type || "link",
        moduleId: item.moduleId || item.subject || item.category || item.gradeLevel || "General",
        sourceUrl: item.sourceUrl || item.url || "",
        url: item.url || item.sourceUrl || "",
        engagementScore: Number(item.engagementScore || 0),
        totalViews: Number(item.totalViews || 0),
    };
}

export async function fetchContentList() {
    const result = await apiFetch("/api/content/");

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

export async function trackContentInteraction(contentId, interactionType, extra = {}) {
    const result = await apiFetch("/api/content/interactions", {
        method: "POST",
        body: JSON.stringify({ contentId, interactionType, ...extra }),
    });

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to update engagement score");
    }

    return {
        ...result.data,
        updatedContent: normalizeContentItem(result.data?.updatedContent || {}),
    };
}

export async function fetchContentById(id) {
    const result = await apiFetch(`/api/content/${id}`);

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch resource");
    }

    return normalizeContentItem(result.data);
}

export async function fetchResources(limit = 20) {
    const result = await apiFetch(`/api/content?limit=${limit}`);

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch resources");
    }

    return Array.isArray(result.data) ? result.data.map(normalizeContentItem) : [];
}

export async function fetchMyContent() {
    const result = await apiFetch("/api/content/mine");
    if (!result.ok) {
        console.warn("fetchMyContent failed:", result.data?.message);
        return [];
    }
    return Array.isArray(result.data) ? result.data.map(normalizeContentItem) : [];
}

export async function createContent(formData) {
    const result = await apiFetch("/api/content", {
        method: "POST",
        body: formData,
    });
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to create content");
    }
    return result.data;
}

export async function deleteContent(id) {
    const result = await apiFetch(`/api/content/${id}`, {
        method: "DELETE",
    });
    if (!result.ok) {
        throw new Error(result.data?.message || "Delete failed");
    }
    return result.data;
}

// User progress
export async function fetchUserProgress() {
    const result = await apiFetch("/api/users/progress");
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch progress");
    }
    return Array.isArray(result.data) ? result.data : [];
}


export async function fetchContentProgress(contentId) {
    const result = await apiFetch(`/api/content/${contentId}/progress`);
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch progress");
    }
    return result.data || { status: "not_started", progressPercent: 0 };
}

export async function saveContentProgress(contentId, payload = {}) {
    const result = await apiFetch(`/api/content/${contentId}/progress`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to save progress");
    }

    return {
        ...result.data,
        updatedContent: normalizeContentItem(result.data?.updatedContent || {}),
    };
}

export async function fetchCurrentUser() {
    const result = await apiFetch("/api/users/me");
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch user");
    }
    return result.data;
}

export async function fetchMyAchievements() {
    const result = await apiFetch("/api/achievements/me");
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to fetch achievements");
    }
    return result.data;
}

export async function evaluateAchievements() {
    const result = await apiFetch("/api/achievements/evaluate", {
        method: "POST",
    });
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to evaluate achievements");
    }
    return result.data;
}

export async function markAchievementSeen(userAchievementId) {
    const result = await apiFetch(`/api/achievements/${userAchievementId}/seen`, {
        method: "PATCH",
    });
    if (!result.ok) {
        throw new Error(result.data?.message || "Failed to mark achievement seen");
    }
    return result.data;
}

// Courses
export function normalizeCourseItem(item = {}) {
  const defaultIcon = "/default-course-icon.svg";

  return {
    ...item,
    _id: item._id || item.id,
    title: item.title || "",
    description: item.description || "",
    avgTime: Number(item.avgTime || 0),
    icon: item.icon || defaultIcon,
    createdBy: item.createdBy || null,
  };
}

export async function fetchCourses() {
  const result = await apiFetch("/api/courses/list");

  if (!result.ok) {
    throw new Error(result.data?.message || "Failed to fetch courses");
  }

  return Array.isArray(result.data)
    ? result.data.map(normalizeCourseItem)
    : [];
}

export async function fetchMyCourses() {
  const result = await apiFetch("/api/courses/mine");

  if (!result.ok) {
    console.warn("fetchMyCourses failed:", result.data?.message);
    return [];
  }

  return Array.isArray(result.data)
    ? result.data.map(normalizeCourseItem)
    : [];
}

export async function createCourse(title, description = "") {
  const result = await apiFetch("/api/courses/creat", {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
    }),
  });

  if (!result.ok) {
    throw new Error(result.data?.message || "Failed to create course");
  }

  return normalizeCourseItem(result.data);
}
