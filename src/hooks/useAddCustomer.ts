import useSWRMutation from "swr/mutation";
import { addCustomer } from "../services/customerService";
import type { CreateCustomerDto } from "../schemas/dto/createCustomerDto";

type AddCustomerArg = {
  customer: CreateCustomerDto;
  skipDuplicateCheck?: boolean;
};

export function useAddCustomer() {
  const { trigger, data, error, isMutating } = useSWRMutation(
    "customers",
    async (_, { arg }: { arg: AddCustomerArg }) => {
      const result = await addCustomer(arg.customer, {
        skipDuplicateCheck: arg.skipDuplicateCheck,
      });

      if (!result.ok) {
        throw result.error;
      }

      return result.data;
    }
  );

  return {
    addCustomerTrigger: (
      customer: CreateCustomerDto,
      options?: { skipDuplicateCheck?: boolean }
    ) => trigger({ customer, ...options }),
    data,
    error,
    isLoading: isMutating,
  };
}
