import { Resource } from "./resources.model.js";
export async function list(query) {
    const filter = {};
    if (query.moduleId)
        filter.moduleId = query.moduleId;
    if (query.chapterId)
        filter.chapterId = query.chapterId;
    if (query.type)
        filter.type = query.type;
    if (query.status)
        filter.status = query.status;
    const q = query.q?.trim();
    if (q)
        filter.$text = { $search: q };
    let query_obj = Resource.find(filter);
    // Add text score if searching
    if (q) {
        query_obj = query_obj.select({ score: { $meta: "textScore" } });
        query_obj = query_obj.sort({ score: { $meta: "textScore" }, rankScore: -1, createdAt: -1 });
    }
    else {
        query_obj = query_obj.sort({ rankScore: -1, createdAt: -1 });
    }
    return query_obj.limit(Math.min(Number(query.limit ?? 30), 100));
}
export async function create(input, userId) {
    return Resource.create({ ...input, createdBy: userId, status: "pending" });
}
export async function approve(id) {
    const doc = await Resource.findByIdAndUpdate(id, { status: "approved" }, { new: true });
    if (!doc) {
        const err = new Error("Resource not found");
        err.statusCode = 404;
        throw err;
    }
    return doc;
}
