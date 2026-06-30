import { z } from "zod";

export const createOrderItemDtoSchema = z.object({
    reference: z.string().min(1),
    title: z.string(),
    isIced: z.boolean().default(false),
    isXHot: z.boolean(),
    isDecaf: z.boolean().default(false),
    strength: z.number().default(1),
    milk: z.string().default("none"),
    teaBags: z.number().default(1),
    sugar: z.number().default(0),
    sweetner: z.number().default(0)
})

export type CreateOrderItemDto = z.infer<typeof createOrderItemDtoSchema>;