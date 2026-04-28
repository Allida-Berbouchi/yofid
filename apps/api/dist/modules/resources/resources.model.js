import mongoose from "mongoose";
const schema = new mongoose.Schema({
    type: { type: String, required: true, enum: ["video", "image", "text", "pdf", "link"] },
    title: { type: String, required: true, index: true },
    description: { type: String },
    moduleId: { type: String, required: true, index: true },
    chapterId: { type: String, index: true },
    tags: { type: [String], default: [], index: true },
    skills: { type: [String], default: [], index: true },
    sourceUrl: { type: String },
    fileKey: { type: String },
    createdBy: { type: String, required: true, index: true },
    status: { type: String, required: true, enum: ["pending", "approved", "rejected"], default: "pending" },
    rankScore: { type: Number, default: 0 },
    qualityScore: { type: Number, default: 0 }
}, { timestamps: true });
schema.index({ title: "text", description: "text", tags: "text", skills: "text" });
export const Resource = mongoose.models.Resource || mongoose.model("Resource", schema);
