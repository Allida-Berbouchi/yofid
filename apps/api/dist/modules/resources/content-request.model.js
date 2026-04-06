import mongoose from "mongoose";
const schema = new mongoose.Schema({
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    verifiedAt: { type: Date }
}, { timestamps: true });
schema.index({ email: 1, code: 1 });
export const ContentRequest = mongoose.models.ContentRequest || mongoose.model("ContentRequest", schema);
