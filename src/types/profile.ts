import { z } from "zod"
import { orderItemSchema, zTimestamp } from "./order"

export const customerSchema = z.object(
    {
        id: z.string().optional,
        firstName: z.string().min(1, "Minum 1 letter"),
        lastName: z.string().min(1, "Minum 1 letter"),
        totalCoffeeOrdered: z.number(),
        options: z.array(orderItemSchema).min(1, "Make sure you have at least one item in your option list"),
        createdAt: zTimestamp,
        updatedAt: zTimestamp
    }
)

export type Customer = z.infer<typeof customerSchema>