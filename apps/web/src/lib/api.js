export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export async function apiFetch(path, opts = {}) {
    try {
        const res = await fetch(`${API_URL}${path}`, {
            ...opts,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(opts.headers || {})
            }
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.message || `Request failed: ${res.status}`);
        }
        return res.json();
    }
    catch (error) {
        console.error(`API Error on ${path}:`, error);
        throw new Error(error?.message || `Failed to fetch ${path}`);
    }
}
