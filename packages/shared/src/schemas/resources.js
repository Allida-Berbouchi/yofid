import { z } from "zod";

const optionalText = (max = 2000) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed ? trimmed : undefined;
    },
    z.string().max(max).optional()
  );

export const resourceTypeSchema = z.enum(["video", "image", "pdf"]);

const baseResourceSchema = z.object({
  type: resourceTypeSchema,
  title: z.string().trim().min(3),
  description: optionalText(),
  courseId: optionalText(200),
  category: optionalText(200),
  subject: optionalText(200),
  gradeLevel: optionalText(200),
  sourceUrl: z.string().trim().url().optional(),
  fileKey: optionalText(500),
  tags: z.array(z.string().trim().min(1)).default([]),
  skills: z.array(z.string().trim().min(1)).default([]),
});

export const createResourceSchema = baseResourceSchema.refine(
  (value) => value.sourceUrl || value.fileKey,
  {
    message: "Either sourceUrl or fileKey is required",
  }
);

export const createResourceInviteSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional()
});

export const submitResourceSchema = baseResourceSchema.extend({
  inviteToken: z.string().trim().min(10),
}).refine((value) => value.sourceUrl || value.fileKey, {
  message: "Either sourceUrl or fileKey is required"
});
