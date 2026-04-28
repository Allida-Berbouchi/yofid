export function validateBody(schema) {
    return (req, _res, next) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const err = new Error(parsed.error.issues.map(i => i.message).join(", "));
            err.statusCode = 400;
            return next(err);
        }
        req.body = parsed.data;
        next();
    };
}
