import { QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { walletApi } from "~/api";

export const bankAccountQueryOptions = queryOptions({
  queryKey: [QueryKeys.WALLET_BANK_ACCOUNT],
  queryFn: async () => {
    return walletApi.walletControllerGetBankAccount();
  },
});

export function useBankAccount() {
  return useQuery(bankAccountQueryOptions);
}
