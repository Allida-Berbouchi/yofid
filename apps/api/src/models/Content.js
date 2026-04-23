import mongoose from "mongoose";

const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    type: {
      type: String,
      enum: ["video", "image", "pdf"],
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

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    totalViews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0, min: 0, max: 1 },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Content", contentSchema);
