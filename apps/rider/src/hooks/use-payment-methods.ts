import { QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { paymentMethodsApi } from "~/api";

export const paymentMethodsQueryOptions = queryOptions({
  queryKey: [QueryKeys.PAYMENT_METHODS],
  queryFn: async () => {
    return await paymentMethodsApi.paymentMethodsControllerListPaymentMethods();
  },
});

export function usePaymentMethods() {
  return useQuery(paymentMethodsQueryOptions);
}
