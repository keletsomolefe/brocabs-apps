import { useQuery } from "@tanstack/react-query";
import { walletApi } from "~/api";
import { WALLET_QUERY_KEYS } from "../constants";

export function useBalance() {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.balance,
    queryFn: async () => {
      const response = await walletApi.walletControllerGetBalance();
      return response;
    },
  });
}
