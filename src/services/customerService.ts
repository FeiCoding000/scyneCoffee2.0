import { FirebaseError } from "firebase/app";
import { db } from "./firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { customerEntitySchema } from "../schemas/entity/customerEntity";
import type { ApiError, ApiResult } from "../types/api";
import { apiFailure, apiSuccess } from "../types/api";
import {type CustomerEntity } from "../schemas/entity/customerEntity";
import { createCustomerDtoSchema, type CreateCustomerDto } from "../schemas/dto/createCustomerDto";

const customersCollection = "customer";

export type NewCustomer = Omit<CustomerEntity, "id">;

const toApiError = (error: unknown, fallbackMessage: string): ApiError => {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: error.message || fallbackMessage,
    };
  }

  if (error instanceof Error) {
    return {
      code: "unknown-error",
      message: error.message || fallbackMessage,
    };
  }

  return {
    code: "unknown-error",
    message: fallbackMessage,
  };
};

export const getAllCustomersFromFirestore = async (): Promise<
  ApiResult<CustomerEntity[]>
> => {
  try {
    const querySnapshot = await getDocs(collection(db, customersCollection));
    const customers: CustomerEntity[] = [];

    for (const doc of querySnapshot.docs) {
      const rawData = {
        id: doc.id,
        ...doc.data(),
      };

      const result = customerEntitySchema.safeParse(rawData);

      if (!result.success) {
        return apiFailure({
          code: "invalid-customer-data",
          message: `Customer data is invalid. Document id: ${doc.id}`,
        });
      }

      customers.push(result.data);
    }

    return apiSuccess(customers);
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to fetch customers."));
  }
};

export const addCustomer = async (
  customer: CreateCustomerDto
): Promise<ApiResult<CustomerEntity>> => {
  const parsedCustomer = createCustomerDtoSchema.safeParse(customer);

  if (!parsedCustomer.success) {
    return apiFailure({
      code: "invalid-customer-payload",
      message: parsedCustomer.error.issues[0]?.message ?? "Customer payload is invalid.",
    });
  }

  const newCustomer: NewCustomer = {...parsedCustomer.data, createdAt: Timestamp.now(), updatedAt: Timestamp.now(), totalDrinksOrdered: 0 }

  try {
    const collectionRef = collection(db, customersCollection);
    const docRef = await addDoc(collectionRef, newCustomer);

    return apiSuccess(
      {
        id: docRef.id,
        ...newCustomer,
      },
      "Customer added successfully."
    );
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to add customer."));
  }
};
