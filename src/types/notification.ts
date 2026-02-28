import { z } from "zod";

export const NotificationSchema = z.object({
    id: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    type: z.enum(["info", "admin", "error"]).default("info"),
    isActive: z.boolean().default(false),
    timer: z.number().optional(),
    createdAt: z.object({
      seconds: z.number(),
      nanoseconds: z.number()
    }).optional(),
    updatedAt: z.object({
      seconds: z.number(),
      nanoseconds: z.number()
    }).optional()
});

export type Notification = z.infer<typeof NotificationSchema>;