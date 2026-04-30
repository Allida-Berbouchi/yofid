import mongoose from "mongoose";

const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    type: {
      type: String,
      enum: ["video", "image", "pdf", "link", "text", "article"],
      required: true,
    },

    sourceKind: {
      type: String,
      enum: ["file", "url"],
      required: true,
    },

    url: { type: String, default: "" },

    fileName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },

    storageType: {
      type: String,
      enum: ["local", "external"],
      default: "local",
    },

    localPath: { type: String, default: "" },

    category: { type: String, default: "" },
    subject: { type: String, default: "" },
    gradeLevel: { type: String, default: "" },

    courseId: { type: Schema.Types.ObjectId, ref: "Course", default: null },

    duration: { type: Number, default: 0, min: 0 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    totalViews: { type: Number, default: 0, min: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    engagementScore: { type: Number, default: 0, min: 0, max: 1 },
    interactionCounts: {
      views: { type: Number, default: 0, min: 0 },
      starts: { type: Number, default: 0, min: 0 },
      progressUpdates: { type: Number, default: 0, min: 0 },
      completions: { type: Number, default: 0, min: 0 },
      earlyExits: { type: Number, default: 0, min: 0 },
      likes: { type: Number, default: 0, min: 0 },
      comments: { type: Number, default: 0, min: 0 },
    },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

contentSchema.index({ status: 1, engagementScore: -1, totalViews: -1 });
contentSchema.index({ category: 1, subject: 1, gradeLevel: 1 });

export default mongoose.model("Content", contentSchema);
