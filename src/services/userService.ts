import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import type { Customer } from "../types/profile";
import { customerSchema } from "../types/profile";

export const getAllUsersFromFirestore = async (): Promise<Customer[]> => {
  const queryShapshot = await getDocs(collection(db, "users"));
  const customers: Customer[] = [];
  queryShapshot.docs.forEach((doc) => {
    const rawData = {
      id: doc.id,
      ...doc.data(),
    };
    const result = customerSchema.safeParse(rawData);
    if (result.success) {
      customers.push(result.data);
    } else {
      console.log(result.error);
    }
  });
  return customers;
};

type NewCustomer = Omit<Customer, "id">;

export const addCustomer = async (customer: NewCustomer): Promise<Customer> => {
  try {
    const collectionRef = collection(db, "users");
    const docRef = await addDoc(collectionRef, customer);

    return {
      id: docRef.id,
      ...customer,
    };
  } catch (error) {
    console.error("Failed to add customer:", error);
    throw error;
  }
};
