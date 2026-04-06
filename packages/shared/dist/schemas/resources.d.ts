import { z } from "zod";
export declare const createResourceSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodEnum<["video", "image", "text", "pdf", "link"]>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodString;
    chapterId: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sourceUrl: z.ZodOptional<z.ZodString>;
    fileKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    tags: string[];
    skills: string[];
    description?: string | undefined;
    chapterId?: string | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    description?: string | undefined;
    chapterId?: string | undefined;
    tags?: string[] | undefined;
    skills?: string[] | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}>, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    tags: string[];
    skills: string[];
    description?: string | undefined;
    chapterId?: string | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    description?: string | undefined;
    chapterId?: string | undefined;
    tags?: string[] | undefined;
    skills?: string[] | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}>;
export declare const createResourceInviteSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name?: string | undefined;
}, {
    email: string;
    name?: string | undefined;
}>;
export declare const submitResourceSchema: z.ZodEffects<z.ZodObject<{
    type: z.ZodEnum<["video", "image", "text", "pdf", "link"]>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    moduleId: z.ZodString;
    chapterId: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    sourceUrl: z.ZodOptional<z.ZodString>;
    fileKey: z.ZodOptional<z.ZodString>;
    inviteToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    tags: string[];
    skills: string[];
    inviteToken: string;
    description?: string | undefined;
    chapterId?: string | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    inviteToken: string;
    description?: string | undefined;
    chapterId?: string | undefined;
    tags?: string[] | undefined;
    skills?: string[] | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}>, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    tags: string[];
    skills: string[];
    inviteToken: string;
    description?: string | undefined;
    chapterId?: string | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}, {
    type: "video" | "image" | "text" | "pdf" | "link";
    title: string;
    moduleId: string;
    inviteToken: string;
    description?: string | undefined;
    chapterId?: string | undefined;
    tags?: string[] | undefined;
    skills?: string[] | undefined;
    sourceUrl?: string | undefined;
    fileKey?: string | undefined;
}>;
