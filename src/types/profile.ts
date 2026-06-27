import { z } from "zod"
import { orderItemSchema, zTimestamp } from "./order"

export const customerSchema = z.object(
    {
        id: z.string().optional,
        customerName: z.string().min(3),
        totalCoffeeOrdered: z.number(),
        options: z.array(orderItemSchema),
        createdAt: zTimestamp,
        updatedAt: zTimestamp
    }
)

export type Customer = z.infer<typeof customerSchema>