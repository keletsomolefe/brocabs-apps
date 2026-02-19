import { useQuery } from "@tanstack/react-query";
import { cardsApi } from "~/api";

export function useSavedCards() {
  return useQuery({
    queryKey: ["saved-cards"],
    queryFn: async () => {
      const response = await cardsApi.cardControllerGetMySavedCards();
      return response;
    },
  });
}
