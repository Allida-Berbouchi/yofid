export function notFound(_req, res) {
    res.status(404).json({ message: "Not Found" });
}
export function errorHandler(err, _req, res, _next) {
    const status = err?.statusCode || err?.status || 500;
    const message = err?.message || "Server Error";
    if (status >= 500) {
        console.error("❌ Server Error:", err);
    }
    else {
        console.warn("⚠️ Client Error:", message);
    }
    res.status(status).json({
        message,
        ...(process.env.NODE_ENV === "development" && { error: err?.toString?.() })
    });
}
