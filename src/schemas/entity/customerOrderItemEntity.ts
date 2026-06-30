import { z } from "zod";
export const orderItemEntitySchema = z.object({
    reference: z.string().min(1),
    title: z.string(),
    isXHot: z.boolean().default(false),
    isIced: z.boolean().default(false),
    isDecaf: z.boolean().default(false),
    strength: z.number().min(0.5).max(4).default(1), 
    milk: z.string().default("none"),
    teaBags: z.number().default(0),
    sugar: z.number().default(0),
    sweetner: z.number().default(0),
});

export type OrderItemEntity = z.infer<typeof orderItemEntitySchema>;