import { QueryKeys } from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { cardsApi } from "~/api";

export function useSavedCards() {
  return useQuery({
    queryKey: [QueryKeys.SAVED_CARDS],
    queryFn: async () => {
      const response = await cardsApi.cardControllerGetMySavedCards();
      return response;
    },
  });
}
