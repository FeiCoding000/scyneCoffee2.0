import { createOrderItemDtoSchema } from "./createOrderItemDto";
import { z } from "zod";

export const createCustomerDtoSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    options: z.array(createOrderItemDtoSchema).min(1)
})

export type CreateCustomerDto = z.infer<typeof createCustomerDtoSchema>