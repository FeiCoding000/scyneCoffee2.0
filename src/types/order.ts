import { z } from "zod";
import { Timestamp } from "firebase/firestore";

const zTimestamp = z.custom<Timestamp>(
  (value) => value instanceof Timestamp,
  { message: "Expected Firestore Timestamp" }
);

/**
 * each item in an order
 */
export const orderItemSchema = z.object({
    coffeeId: z.string().optional(),
    title: z.string(),
    isHot: z.boolean().default(true),
    isXHot: z.boolean().default(false),
    isIced: z.boolean().default(false),
    isDecaf: z.boolean().default(false),
    strength: z.number().min(0.5).max(4).default(1), // strength from 0.5 to 4 for coffee only
    quantity: z.number().min(1).default(1),
    isCompleted: z.boolean().default(false),
    milk: z.string().default("none"),
    extraWater: z.number().default(0),
    teaBags: z.number().default(0),
    sugar: z.number().default(0),
    sweetner: z.number().default(0),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

/**
 * an order
 */
export const OrderSchema = z.object({
    id: z.string().optional(),
    customerName: z.string(),
    items: z.array(orderItemSchema),
    isCompleted: z.boolean().default(false),
    createdAt: zTimestamp,
    updatedAt: zTimestamp
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
