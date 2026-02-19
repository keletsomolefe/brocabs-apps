import { WithdrawRequestDto } from "@brocabs/client";
import { useMutation } from "@tanstack/react-query";
import { paymentsApi } from "~/api";

export function useWithdraw() {
  return useMutation({
    mutationFn: (dto: WithdrawRequestDto) =>
      paymentsApi.tradeSafeControllerWithdraw({ withdrawRequestDto: dto }),
  });
}
