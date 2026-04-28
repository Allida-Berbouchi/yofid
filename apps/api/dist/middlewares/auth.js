import { verifyAccessToken } from "../utils/jwt.js";
export function authRequired(req, _res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        const err = new Error("Unauthorized");
        err.statusCode = 401;
        return next(err);
    }
    try {
        const payload = verifyAccessToken(token);
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch (error) {
        const err = new Error("Invalid token");
        err.statusCode = 401;
        return next(err);
    }
}
export function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            const err = new Error("Unauthorized");
            err.statusCode = 401;
            return next(err);
        }
        if (!roles.includes(req.user.role)) {
            const err = new Error("Forbidden");
            err.statusCode = 403;
            return next(err);
        }
        next();
    };
}
