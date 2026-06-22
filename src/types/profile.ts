import { z } from "zod"
import { orderItemSchema, zTimestamp } from "./order"

export const CustomerProfile = z.object(
    {
        id: z.string().optional,
        customerName: z.string().min(3),
        options: z.array(orderItemSchema),
        createdAt: zTimestamp,
        updatedAt: zTimestamp
    }
)

export type Customer = z.infer<typeof CustomerProfile>