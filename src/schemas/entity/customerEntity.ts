import { z } from "zod";
import { orderItemEntitySchema } from "./customerOrderItemEntity";
import { zTimestamp } from "../../types/order";

export const customerEntitySchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    normalizedName: z.string().min(1),
    totalDrinksOrdered: z.number().default(0),
    allergies: z.array(z.string()).default([]),
    options: z.array(orderItemEntitySchema).min(1),
    createdAt: zTimestamp,
    updatedAt: zTimestamp
})

export type CustomerEntity = z.infer< typeof customerEntitySchema>