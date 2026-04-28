import { Resource } from "./resources.model.js";
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
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
    if (q) {
        const rx = new RegExp(escapeRegex(q), "i");
        filter.$or = [
            { title: rx },
            { description: rx },
            { moduleId: rx },
            { chapterId: rx },
            { type: rx },
            { tags: rx },
            { skills: rx },
            { sourceUrl: rx },
            { fileKey: rx }
        ];
    }
    let query_obj = Resource.find(filter);
    query_obj = query_obj.sort({ rankScore: -1, createdAt: -1 });
    return query_obj.limit(Math.min(Number(query.limit ?? 30), 100));
}
export async function create(input, userId) {
    return Resource.create({ ...input, createdBy: userId, status: "pending" });
}
export async function getById(id) {
    const doc = await Resource.findById(id);
    if (!doc) {
        const err = new Error("Resource not found");
        err.statusCode = 404;
        throw err;
    }
    return doc;
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
