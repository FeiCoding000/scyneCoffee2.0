import useSWRMutation from "swr/mutation";
import { addCustomer } from "../services/customerService";
import type { CreateCustomerDto } from "../schemas/dto/createCustomerDto";

export function useAddCustomer() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    "customers",
    async (_, { arg }: { arg: CreateCustomerDto }) => {
      const result = await addCustomer(arg);

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    }
  );

  return {
    addCustomerTrigger: trigger,
    data,
    error,
    isLoading: isMutating,
  };
}
