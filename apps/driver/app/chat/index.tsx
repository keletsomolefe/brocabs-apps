import { CreateMessageDtoMessageTypeEnum } from "@brocabs/client";
import { ChatScreen, IMessage } from "@brocabs/ui";
import { useMemo } from "react";
import { useChatMessages, useSendMessage } from "~/features/chat/hooks";
import { useActiveRide } from "~/features/trip/hooks/use-ride";

export default function ChatRoute() {
  const { data: ride } = useActiveRide();
  const rideId = ride?.id;

  const { data: chatData, isLoading } = useChatMessages(rideId ?? "");
  const { mutate: sendMessage, isPending: isSending } = useSendMessage(rideId ?? "");
  const messages = useMemo(() => {
    if (!chatData?.pages) return [];
    const allMessages = chatData.pages.flatMap((page) => page.messages);
    if (allMessages.length === 0) return [];

    const participants = chatData.pages[0].participants;

    return allMessages.map((msg) => ({
      _id: msg.id,
      text: (msg.body as unknown as string) ?? "",
      createdAt: msg.createdAt,
      user: {
        _id: msg.senderType,
        name:
          msg.senderType === "rider"
            ? participants.rider.displayName
            : participants.driver.displayName,
        avatar:
          msg.senderType === "rider"
            ? (participants.rider.avatarUrl as unknown as string)
            : (participants.driver.avatarUrl as unknown as string),
      },
    })) as IMessage[];
  }, [chatData]);

  const onSend = (newMessages: IMessage[]) => {
    if (!newMessages.length) return;
    const message = newMessages[0];
    sendMessage({
      body: message.text,
      messageType: CreateMessageDtoMessageTypeEnum.Text,
    });
  };

  return (
    <ChatScreen
      messages={messages}
      onSend={onSend}
      isLoading={isLoading}
      isSending={isSending}
      user={{ _id: "driver" }}
    />
  );
}
