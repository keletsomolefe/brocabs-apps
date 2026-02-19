import { QueryKeys } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardsApi } from "~/api";

export const useRemoveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      return cardsApi.cardControllerDeleteCard({ cardId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SAVED_CARDS] });
    },
  });
};
