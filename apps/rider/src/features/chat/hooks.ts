import { CreateMessageDto, QueryKeys } from "@brocabs/client";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "~/api";

export const useChatMessages = (rideId: string) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.CHAT, rideId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return chatApi.chatControllerGetChat({
        id: rideId,
        limit: 50,
        before: pageParam ? new Date(pageParam) : undefined,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.paging.hasMore || lastPage.messages.length === 0) return undefined;
      const lastMessage = lastPage.messages[lastPage.messages.length - 1];
      return lastMessage.createdAt.toISOString();
    },
    enabled: !!rideId,
  });
};

export const useSendMessage = (rideId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateMessageDto) => {
      return chatApi.chatControllerSendMessage({
        id: rideId,
        createMessageDto: dto,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CHAT, rideId] });
    },
  });
};
