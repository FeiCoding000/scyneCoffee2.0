import { z } from "zod"
import { orderItemSchema, zTimestamp } from "./order"

export const CustomerProfile = z.object(
    {
        customerName: z.string().min(3),
        options: z.array(orderItemSchema),
        createdAt: zTimestamp,
        updatedAt: zTimestamp
    }
)