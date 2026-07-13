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
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { customerEntitySchema } from "../schemas/entity/customerEntity";
import type { ApiError, ApiResult } from "../types/api";
import { apiFailure, apiSuccess } from "../types/api";
import { type CustomerEntity } from "../schemas/entity/customerEntity";
import { createCustomerDtoSchema, type CreateCustomerDto } from "../schemas/dto/createCustomerDto";
import type { Order } from "../types/order";
import type { OrderItemEntity } from "../schemas/entity/customerOrderItemEntity";

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

export const getCustomerById = async (
  customerId: string
): Promise<ApiResult<CustomerEntity>> => {
  try {
    const customerDoc = await getDoc(doc(db, customersCollection, customerId));

    if (!customerDoc.exists()) {
      return apiFailure({
        code: "customer-not-found",
        message: "Customer not found.",
      });
    }

    const result = customerEntitySchema.safeParse({
      id: customerDoc.id,
      ...customerDoc.data(),
    });

    if (!result.success) {
      return apiFailure({
        code: "invalid-customer-data",
        message: `Customer data is invalid. Document id: ${customerId}`,
      });
    }

    return apiSuccess(result.data);
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to fetch customer."));
  }
};

export const updateCustomerOptions = async (
  customer: CustomerEntity,
  options: OrderItemEntity[]
): Promise<ApiResult<CustomerEntity>> => {
  if (!customer.id) {
    return apiFailure({
      code: "missing-customer-id",
      message: "Customer id is required to update profile.",
    });
  }

  try {
    const now = Timestamp.now();
    const updatedCustomer = customerEntitySchema.parse({
      ...customer,
      options,
      updatedAt: now,
    });

    await updateDoc(doc(db, customersCollection, customer.id), {
      options,
      updatedAt: now,
    });

    return apiSuccess(updatedCustomer, "Customer profile updated successfully.");
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to update customer profile."));
  }
};

export const placeProfileOrder = async (
  customer: CustomerEntity,
  option: OrderItemEntity
): Promise<ApiResult<CustomerEntity>> => {
  if (!customer.id) {
    return apiFailure({
      code: "missing-customer-id",
      message: "Customer id is required to place profile order.",
    });
  }

  try {
    const now = Timestamp.now();
    const order: Order = {
      customerName: `${customer.firstName} ${customer.lastName}`.trim(),
      items: [
        {
          title: option.title,
          isIced: option.isIced,
          isDecaf: option.isDecaf,
          strength: option.strength,
          quantity: 1,
          milk: option.milk,
          isXHot: option.isXHot,
          teaBags: option.teaBags,
          sugar: option.sugar,
          sweetner: option.sweetner,
          extraWater: option.teaBags > 0 ? 500 : 0,
          isHot: !option.isIced,
          isCompleted: false,
        },
      ],
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await addDoc(collection(db, "orders"), order);

    const customerRef = doc(db, customersCollection, customer.id);
    await updateDoc(customerRef, {
      totalDrinksOrdered: increment(1),
      updatedAt: now,
    });

    const updatedCustomer: CustomerEntity = {
      ...customer,
      totalDrinksOrdered: customer.totalDrinksOrdered + 1,
      updatedAt: now,
    };

    return apiSuccess(updatedCustomer, "Order placed successfully.");
  } catch (error) {
    return apiFailure(toApiError(error, "Failed to place order."));
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
