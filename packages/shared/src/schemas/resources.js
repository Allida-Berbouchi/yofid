import { z } from "zod";
export const createResourceSchema = z.object({
    type: z.enum(["video", "image", "text", "pdf", "link"]),
    title: z.string().min(3),
    description: z.string().max(2000).optional(),
    moduleId: z.string().min(1),
    chapterId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    sourceUrl: z.string().url().optional(),
    fileKey: z.string().optional()
}).refine((v) => v.sourceUrl || v.fileKey, {
    message: "Either sourceUrl or fileKey is required"
});
export const createResourceInviteSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1).optional()
});
export const submitResourceSchema = z.object({
    type: z.enum(["video", "image", "text", "pdf", "link"]),
    title: z.string().min(3),
    description: z.string().max(2000).optional(),
    moduleId: z.string().min(1),
    chapterId: z.string().optional(),
    tags: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    sourceUrl: z.string().url().optional(),
    fileKey: z.string().optional(),
    inviteToken: z.string().min(10)
}).refine((v) => v.sourceUrl || v.fileKey, {
    message: "Either sourceUrl or fileKey is required"
});
