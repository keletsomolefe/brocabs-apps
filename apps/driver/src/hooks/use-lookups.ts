import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "~/api";

interface LookupOption {
  label: string;
  value: string;
}

export const useBankAccountTypes = () => {
  return useQuery({
    queryKey: ["bank-account-types"],
    queryFn: async () => {
      // The generated client might return the array directly or wrap it.
      // Based on PaymentsApi.ts attached earlier: 
      // async tradeSafeControllerGetBankAccountTypes(...) : Promise<Array<object>>
      const response = await paymentsApi.tradeSafeControllerGetBankAccountTypes();
      return response as LookupOption[];
    },
    staleTime: Infinity, // These don't change often
  });
};

export const useUniversalBranchCodes = () => {
  return useQuery({
    queryKey: ["universal-branch-codes"],
    queryFn: async () => {
      const response = await paymentsApi.tradeSafeControllerGetUniversalBranchCodes();
      return response as LookupOption[];
    },
    staleTime: Infinity,
  });
};
