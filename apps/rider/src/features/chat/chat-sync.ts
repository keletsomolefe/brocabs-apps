import { QueryKeys } from "@brocabs/client";
import { ChatMessagePayload } from "@brocabs/mqtt-envelope";
import { chatApi, queryClient } from "~/api";

export async function syncChatMessages(rideId: string) {
  try {
    const queryKey = [QueryKeys.CHAT, rideId];
    const oldData = queryClient.getQueryData<{
      pages: { messages: ChatMessagePayload[] }[];
    }>(queryKey);

    if (!oldData || !oldData.pages || oldData.pages.length === 0) {
      // If we don't have any data, we probably want to fetch or invalidate
      // But invalidating forces a refetch if mounted.
      await queryClient.invalidateQueries({ queryKey });
      return;
    }

    const newestPage = oldData.pages[0];
    const newestMessage = newestPage.messages[0];

    if (!newestMessage) {
      await queryClient.invalidateQueries({ queryKey });
      return;
    }

    const response = await chatApi.chatControllerGetChat({
      id: rideId,
      since: new Date(newestMessage.createdAt),
    });

    if (response.messages.length === 0) {
      return;
    }

    const newMessagesInDesc = [...response.messages].reverse();

    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old || !old.pages) return old;

      const newPages = [...old.pages];
      const firstPage = { ...newPages[0] };

      const existingIds = new Set(firstPage.messages.map((m: any) => m.id));
      const uniqueNewMessages = newMessagesInDesc.filter((m: any) => !existingIds.has(m.id));

      if (uniqueNewMessages.length === 0) return old;

      firstPage.messages = [...uniqueNewMessages, ...firstPage.messages];
      newPages[0] = firstPage;

      return { ...old, pages: newPages };
    });
  } catch (error) {
    console.error("Failed to sync chat messages", error);
    queryClient.invalidateQueries({ queryKey: [QueryKeys.CHAT, rideId] });
  }
}
