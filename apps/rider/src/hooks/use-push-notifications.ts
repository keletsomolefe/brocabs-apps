import notifee from "@notifee/react-native";
import {
  AuthorizationStatus,
  getAPNSToken,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";
import Constants from "expo-constants";
import { useCallback, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { useUser } from "./use-auth";
import { useDevicePing, useDeviceRefreshToken, useDeviceRegister } from "./use-devices";

async function waitForAPNSToken(messaging: ReturnType<typeof getMessaging>, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    const apnsToken = await getAPNSToken(messaging);
    if (apnsToken) {
      return apnsToken;
    }
    // Wait 1 second before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return null;
}

async function requestAndroidPermission() {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
}

export function usePushNotifications() {
  const { data: user } = useUser();
  const { mutate: registerDevice, data } = useDeviceRegister();
  const { mutate: refreshDeviceToken } = useDeviceRefreshToken();
  const { mutate: pingDevice } = useDevicePing();

  useEffect(() => {
    async function setupNotifications() {
      if (!user) return;

      try {
        // Request Android 13+ notification permission
        await requestAndroidPermission();

        const messaging = getMessaging();

        const authStatus = await requestPermission(messaging);
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          // On iOS, we need to wait for the APNS token before we can get the FCM token
          if (Platform.OS === "ios") {
            const apnsToken = await waitForAPNSToken(messaging);
            if (!apnsToken) {
              console.warn("APNS token not available after retries, skipping FCM registration");
              return;
            }
          }

          const token = await getToken(messaging);

          if (token) {
            registerDevice({
              platform: Platform.OS === "ios" ? "ios" : "android",
              pushToken: token,
              pushProvider: "fcm",
              appVariant: "rider",
              appVersion: Constants.expoConfig?.version ?? "1.0.0",
              osVersion: String(Platform.Version),
              model: Platform.OS === "ios" ? "iPhone" : "Android",
            });
          }
        }
      } catch (error) {
        console.error("Failed to setup notifications:", error);
      }
    }

    setupNotifications();
  }, [registerDevice, user]);

  const updateLastSeen = useCallback(async () => {
    if (data?.id && user) {
      pingDevice({
        deviceId: data.id,
      });
    }
  }, [data?.id, pingDevice, user]);

  useEffect(() => {
    if (!user) return;

    const messaging = getMessaging();
    const unsubscribe = onTokenRefresh(messaging, (token) => {
      if (data?.id) {
        refreshDeviceToken({
          pushToken: token,
          deviceId: data.id,
        });
      }
    });

    return unsubscribe;
  }, [refreshDeviceToken, data?.id, user]);

  useEffect(() => {
    async function setupForegroundNotifications() {
      if (Platform.OS === "android") {
        await notifee.createChannel({
          id: "default",
          name: "Default Channel",
          importance: 4, // HIGH
        });
      }
    }

    setupForegroundNotifications();

    const messaging = getMessaging();

    const unsubscribe = onMessage(messaging, async (msg) => {
      await notifee.displayNotification({
        title: msg.notification?.title,
        body: msg.notification?.body,
        android: {
          channelId: "default",
        },
      });
    });

    return unsubscribe;
  }, []);

  return { updateLastSeen };
}
