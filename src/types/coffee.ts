import { z } from "zod";

export const CoffeeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(5, "Description should be at least 5 characters"),
    popularity: z.number().default(0), 
    defaultMilk: z.enum(["full cream", "lite", "almond", "oat", "lactose free", "soy", "none"]).optional(),
    category: z.enum(["coffee", "tea", "other"]),
    hotOnly: z.boolean().default(true),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().default(true),
    // isIced: z.boolean().default(false),
    // isXHot: z.boolean().default(false),
    // isIced: z.boolean().default(false),
    defaultStrength: z.number().optional(),
    defaultTeaBags: z.number().optional(),
    tags: z.array(z.string()).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

export type Coffee = z.infer<typeof CoffeeSchema>;
