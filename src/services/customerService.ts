import { FirebaseError } from "firebase/app";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
  query,
  where,
  limit,
} from "firebase/firestore";
import { customerEntitySchema } from "../schemas/entity/customerEntity";
import type { ApiError, ApiResult } from "../types/api";
import { apiFailure, apiSuccess } from "../types/api";
import { type CustomerEntity } from "../schemas/entity/customerEntity";
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

  const customerData = parsedCustomer.data;
  const normalizedName = `${customerData.firstName.trim().toLowerCase()} ${customerData.lastName.trim().toLowerCase()}`;

  try {
    const collectionRef = collection(db, customersCollection);
    const duplicateQuery = query(
      collectionRef,
      where("normalizedName", "==", normalizedName),
      limit(1)
    );
    const duplicateSnapshot = await getDocs(duplicateQuery);

    if (!duplicateSnapshot.empty) {
      return apiFailure({
        code: "duplicate-customer",
        message: "A customer with the same name already exists.",
      });
    }

    const now = Timestamp.now();
    const newCustomer: NewCustomer = {
      ...customerData,
      normalizedName,
      allergies: [],
      createdAt: now,
      updatedAt: now,
      totalDrinksOrdered: 0,
    };

    const docRef = await addDoc(collectionRef, newCustomer);
    const createdCustomer = customerEntitySchema.parse({
      id: docRef.id,
      ...newCustomer,
    });

    return apiSuccess(createdCustomer, "Customer added successfully.");
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to add customer."));
  }
};
