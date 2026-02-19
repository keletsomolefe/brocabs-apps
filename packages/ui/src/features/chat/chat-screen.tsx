import { useCallback } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Message,
} from "react-native-gifted-chat";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export { IMessage };

import { Icon } from "../../icons/icon";
import { Container } from "../../layout";

interface ChatScreenProps {
  messages: IMessage[];
  onSend: (messages: IMessage[]) => void;
  isLoading?: boolean;
  isSending?: boolean;
  user: { _id: string | number };
}

export function ChatScreen({
  messages,
  onSend,
  isLoading,
  isSending,
  user,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();

  const handleSend = useCallback(
    (newMessages: IMessage[] = []) => {
      onSend(newMessages);
    },
    [onSend],
  );

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#5905ff", // Primary/600 from Figma
            borderRadius: 16,
            padding: 4,
          },
          left: {
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 4,
          },
        }}
        textStyle={{
          right: {
            color: "#FFFFFF", // Assuming white text for better contrast on purple
            fontFamily: "BRHendrix-Medium", // Fallback font if not loaded
          },
          left: {
            color: "#0a021a", // Primary/950
            fontFamily: "BRHendrix-Medium",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "transparent",
          borderTopWidth: 0,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + 10,
        }}
        primaryStyle={{
          alignItems: "center",
        }}
      />
    );
  };

  const renderComposer = (props: any) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#E7E7FF", // Primary/950
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#4701D2", // Primary/200
            paddingHorizontal: 14,
            height: 52,
          }}
        >
          {/* Camera icon */}
          <TouchableOpacity onPress={() => {}} style={{ marginRight: 10 }}>
            <Icon name="camera-filled" width={22} height={22} color="#6B50FF" />
          </TouchableOpacity>

          <Composer
            {...props}
            multiline
            textInputStyle={{
              flex: 1,
              color: "#0a021a",
              fontSize: 13,
              fontFamily: "BRHendrix-Regular",
              paddingTop: 0,
              paddingBottom: 0,
              margin: 0,
            }}
            placeholder="Type a message..."
            placeholderTextColor="#6f6f6f"
          />
        </View>

        {/* Send button - always visible, opacity when disabled */}
        <TouchableOpacity
          onPress={() => {
            if (props.text && props.onSend) {
              props.onSend({ text: props.text.trim() }, true);
            }
          }}
          disabled={!props.text?.trim() || isSending}
          style={{
            backgroundColor: "#5905ff", // Primary/600
            width: 52,
            height: 52,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            opacity: props.text?.trim() && !isSending ? 1 : 0.5,
          }}
        >
          {isSending ? (
            <ActivityIndicator color="#E7E7FF" size="small" />
          ) : (
            <Icon name="send" width={25} height={25} color="#E7E7FF" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderSend = () => {
    // Send button is now rendered inside renderComposer
    return null;
  };

  if (isLoading && messages.length === 0) {
    return (
      <Container flex={1} backgroundColor="Bg Color" justifyContent="center">
        <ActivityIndicator size="large" color="#5905ff" />
      </Container>
    );
  }

  return (
    <Container flex={1} backgroundColor="Bg Color">
      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "rgba(231,231,255,0.1)" }} />

      {/* Chat Area */}
      <GiftedChat
        renderMessage={(props) => (
          <Message
            {...props}
            containerStyle={{
              left: { marginLeft: 0, marginRight: 0 },
              right: { marginLeft: 0, marginRight: 0 },
            }}
          />
        )}
        messagesContainerStyle={{
          paddingHorizontal: 20,
        }}
        messages={messages}
        onSend={(messages) => handleSend(messages)}
        user={user}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        renderAvatar={null} // Design doesn't show avatars next to bubbles for the other user in the screenshot provided (except in the header)
        minInputToolbarHeight={70}
      />
    </Container>
  );
}
