import { QueryKeys, UpdateBankDetailsDto } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "~/api";

export function useUpdateBankDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateBankDetailsDto) => {
      return await walletApi.walletControllerUpdateBankDetails({
        updateBankDetailsDto: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.WALLET_BANK_ACCOUNT],
      });
    },
  });
}
