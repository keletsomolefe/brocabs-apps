import { ThemeProvider } from "@emotion/react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { QueryKeys } from "@brocabs/client";
import { ModalBox } from "@brocabs/ui/modal-box";
import { LocalCachedFiles } from "@brocabs/ui/theme/assets";
import { FontFiles } from "@brocabs/ui/theme/fonts";
import { lightTheme } from "@brocabs/ui/theme/theme";
import { StatusBar } from "expo-status-bar";
import { useShallow } from "zustand/react/shallow";
import { authApi, queryClient } from "~/api";
import { MqttProvider, useMqtt } from "~/context/MqttContext";
import { NetworkProvider } from "~/context/NetworkContext";
import { syncChatMessages } from "~/features/chat/chat-sync";
import { SplashAnimation } from "~/features/onboarding/components/splash-animation";
import { useReconnectStore } from "~/features/trip/stores/reconnectStore";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { VISIBLE_PHASES } from "~/features/trip/trip-phase";
import { useAppStateBackground } from "~/hooks/use-app-state-reconnect";
import { useUser } from "~/hooks/use-auth";
import { usePushNotifications } from "~/hooks/use-push-notifications";
import { LocaleProvider } from "~/i18n/LocaleContext";
import { prefetchAppResources } from "~/services/prefetch";
import { useAppStore } from "~/store";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("white");
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <MqttProvider>
          <App />
        </MqttProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

const onReconnect = async () => {
  const currentPhase = useTripFlow.getState().phase;
  const isBottomSheetVisible = VISIBLE_PHASES.includes(currentPhase);

  const activeRide: { id: string } | undefined = queryClient.getQueryData([QueryKeys.ACTIVE_RIDE]);

  if (!isBottomSheetVisible) {
    await prefetchAppResources(true);
  } else {
    useReconnectStore.getState().triggerReconnect();
  }

  if (activeRide?.id) {
    await syncChatMessages(activeRide.id);
  }
};

function App() {
  const { isHydrated } = useAppStore(
    useShallow((state) => ({
      isHydrated: state.isHydrated,
    }))
  );
  const [fontsLoaded, fontsError] = useFonts(FontFiles);
  const [assetsLoaded, assetsError] = useAssets(LocalCachedFiles);
  const resourcesLoaded = fontsLoaded && assetsLoaded;
  const hasErrors = fontsError || assetsError;
  const userQuery = useUser();
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const { subscribeToTopic, mqttClient, setOnReconnect, skipNextReconnect } = useMqtt()!;
  const { updateLastSeen } = usePushNotifications();
  const handleReconnect = useCallback(() => {
    onReconnect();
    updateLastSeen();
  }, [updateLastSeen]);
  useAppStateBackground(mqttClient, handleReconnect, skipNextReconnect);

  // Register MQTT reconnect handler
  useEffect(() => {
    setOnReconnect(() => onReconnect);
    return () => setOnReconnect(undefined);
  }, [setOnReconnect]);

  const { profileId } = userQuery.data || {};
  const userAuthenticated = userQuery.data?.authenticated && userQuery.data?.state?.canAccessApp;
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const userResponse = await queryClient.fetchQuery({
          queryKey: [QueryKeys.AUTHENTICATE_USER],
          queryFn: async () => {
            return authApi.authControllerGetSession();
          },
        });

        if (userResponse?.authenticated) {
          await prefetchAppResources();
        }
      } catch (error) {
        console.error("Bootstrap error:", error);
      } finally {
        setIsBootstrapped(true);
      }
    }
    bootstrap();
  }, []);

  const isLoading = isAnimating || !isBootstrapped || userQuery.isLoading || !isHydrated;

  useEffect(() => {
    if (!profileId || !userAuthenticated) return;

    subscribeToTopic(`rider/${profileId}`);
  }, [subscribeToTopic, profileId, userAuthenticated]);

  useEffect(() => {
    if (hasErrors) {
      console.error("Resource loading error:", { fontsError, assetsError });
      return;
    }

    if (resourcesLoaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [resourcesLoaded, hasErrors, fontsError, assetsError]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={lightTheme}>
        <KeyboardProvider>
          <NetworkProvider>
            <BottomSheetModalProvider>
              <SafeAreaProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    freezeOnBlur: false,
                  }}>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="chat"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="ride-history"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="bro-scholar"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="notifications"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="sos-contacts"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="favorite-addresses"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="complaints"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="profile-settings"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                </Stack>
                <ModalBox />
                {isLoading && <SplashAnimation onAnimationFinish={() => setIsAnimating(false)} />}
                <StatusBar style="dark" />
              </SafeAreaProvider>
            </BottomSheetModalProvider>
          </NetworkProvider>
        </KeyboardProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
