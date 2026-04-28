import mongoose from "mongoose";

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String, default: null },
    avgTime: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
