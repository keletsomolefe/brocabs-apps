import { PaymentResponseDto } from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";

import { walletApi } from "~/api";
import { useUser } from "~/hooks/use-auth";

import { WALLET_QUERY_KEYS } from "../constants";
import { Transaction, TransactionStatus, TransactionType } from "../types";

/**
 * Transform API PaymentResponseDto to local Transaction type
 */
const transformTransaction = (dto: PaymentResponseDto): Transaction => ({
  id: dto.id ?? "",
  type: dto.type === "DEPOSIT" ? TransactionType.RECHARGE : TransactionType.RIDE,
  status: (dto.status as TransactionStatus) ?? TransactionStatus.COMPLETED,
  amount: dto.amount ?? 0,
  date: dto.createdAt ? new Date(dto.createdAt) : new Date(),
  description: typeof dto.description === "string" ? dto.description : "",
  from: (dto.metadata as Record<string, unknown>)?.from as string | undefined,
  to: (dto.metadata as Record<string, unknown>)?.to as string | undefined,
});

export function useTransactions() {
  const { data: userData } = useUser();
  const isAuthenticated = userData?.authenticated && userData.state?.canAccessApp;

  return useQuery<Transaction[]>({
    queryKey: WALLET_QUERY_KEYS.transactions,
    queryFn: async () => {
      const response = await walletApi.walletControllerGetTransactionHistory({
        limit: 50,
      });
      return (response.data ?? []).map(transformTransaction);
    },
    enabled: !!isAuthenticated,
  });
}
