import { useMutation } from "@tanstack/react-query";
import { cardsApi } from "~/api";

export function useAddCard() {
  return useMutation({
    mutationFn: async () => {
      const response = await cardsApi.cardControllerGetAddCardUrl({});
      return response.url;
    },
    mutationKey: ["add-new-card"],
  });
}
