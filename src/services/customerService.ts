import { FirebaseError } from "firebase/app";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import type { Customer } from "../types/profile";
import { customerSchema } from "../types/profile";
import type { ApiError, ApiResult } from "../types/api";
import { apiFailure, apiSuccess } from "../types/api";

const customersCollection = "users";

export type NewCustomer = Omit<Customer, "id">;

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
  ApiResult<Customer[]>
> => {
  try {
    const querySnapshot = await getDocs(collection(db, customersCollection));
    const customers: Customer[] = [];

    for (const doc of querySnapshot.docs) {
      const rawData = {
        id: doc.id,
        ...doc.data(),
      };

      const result = customerSchema.safeParse(rawData);

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
  customer: NewCustomer
): Promise<ApiResult<Customer>> => {
  const parsedCustomer = customerSchema.omit({ id: true }).safeParse(customer);

  if (!parsedCustomer.success) {
    return apiFailure({
      code: "invalid-customer-payload",
      message: parsedCustomer.error.issues[0]?.message ?? "Customer payload is invalid.",
    });
  }

  try {
    const collectionRef = collection(db, customersCollection);
    const docRef = await addDoc(collectionRef, parsedCustomer.data);

    return apiSuccess(
      {
        id: docRef.id,
        ...parsedCustomer.data,
      },
      "Customer added successfully."
    );
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to add customer."));
  }
};
