import { QueryKeys } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "~/api";

export function useConfirmCashPayment(rideId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // 1. Get transaction by ref (rideId) - assuming rideId is used as reference
      // This relies on the backend setting certain metadata/reference for cash transactions
      const transaction = await paymentsApi.paymentControllerGetTransactionByReference({
        reference: rideId,
      });

      // 2. Complete it
      return paymentsApi.paymentControllerCompleteCashTransaction({
        id: transaction.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_HISTORY] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.RIDE_HISTORY_DETAIL, rideId],
      });
    },
  });
}
