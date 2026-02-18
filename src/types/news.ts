import { url, z } from "zod";

export const NewsSchema = z.object({
    id: z.string().optional(),
    url: url(),
    title: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});