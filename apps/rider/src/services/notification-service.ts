import notifee, { AndroidImportance } from "@notifee/react-native";
import { Platform } from "react-native";

const CHANNEL_ID = "mqtt-notifications";

let channelCreated = false;

async function ensureChannel() {
  if (channelCreated || Platform.OS !== "android") return;

  await notifee.createChannel({
    id: CHANNEL_ID,
    name: "Real-time Updates",
    importance: AndroidImportance.HIGH,
  });

  channelCreated = true;
}

export interface NotificationOptions {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function showForegroundNotification(options: NotificationOptions) {
  await ensureChannel();

  await notifee.displayNotification({
    title: options.title,
    body: options.body,
    data: options.data,
    android: {
      channelId: CHANNEL_ID,
      pressAction: {
        id: "default",
      },
    },
  });
}
