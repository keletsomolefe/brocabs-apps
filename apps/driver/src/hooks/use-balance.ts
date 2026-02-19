import { useQuery } from "@tanstack/react-query";
import { walletApi } from "~/api";

export function useBalance() {
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: () => walletApi.walletControllerGetBalance(),
  });
}
