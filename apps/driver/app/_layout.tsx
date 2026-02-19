import { ThemeProvider } from "@emotion/react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { LocationTrackingProvider } from "~/context/LocationTrackingContext";
import { MqttProvider, useMqtt } from "~/context/MqttContext";
import { NetworkProvider } from "~/context/NetworkContext";
import { syncChatMessages } from "~/features/chat/chat-sync";
import { SplashAnimation } from "~/features/onboarding/components/splash-animation";
import { useReconnectStore } from "~/features/trip/stores/reconnectStore";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { TripPhase } from "~/features/trip/trip-phase";
import { useAppStateBackground } from "~/hooks/use-app-state-reconnect";
import { useUser } from "~/hooks/use-auth";
import { usePushNotifications } from "~/hooks/use-push-notifications";
import { useRideRequests } from "~/hooks/use-ride-requests";
import { LocaleProvider } from "~/i18n/LocaleContext";
import { prefetchAppResources } from "~/services/prefetch";
import { useAppStore } from "~/store";
import { useDriverStatusStore } from "~/stores/driver-status-store";

SplashScreen.preventAutoHideAsync();

const ACTIVE_TRIP_PHASES = [
  TripPhase.DriverEnroute,
  TripPhase.DriverWaiting,
  TripPhase.DriverWaitingTimeout,
  TripPhase.TripInProgress,
];

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
          <LocationTrackingProvider>
            <App />
          </LocationTrackingProvider>
        </MqttProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

const onReconnect = async () => {
  const currentPhase = useTripFlow.getState().phase;
  const isTripActive = ACTIVE_TRIP_PHASES.includes(currentPhase);

  const activeRide: { id: string } | undefined = queryClient.getQueryData([QueryKeys.ACTIVE_RIDE]);

  if (!isTripActive) {
    await prefetchAppResources(true);
  } else {
    useReconnectStore.getState().triggerReconnect();
  }

  if (activeRide?.id) {
    await syncChatMessages(activeRide.id);
  }
};

function App() {
  const { previouslyAuthenticated, isHydrated } = useAppStore(
    useShallow((state) => ({
      previouslyAuthenticated: state.previouslyAuthenticated,
      isHydrated: state.isHydrated,
    }))
  );

  const [fontsLoaded, fontsError] = useFonts(FontFiles);
  const [assetsLoaded, assetsError] = useAssets(LocalCachedFiles);
  const resourcesLoaded = fontsLoaded && assetsLoaded;
  const hasErrors = fontsError || assetsError;
  const userQuery = useUser({ enabled: previouslyAuthenticated });
  const [isAnimating, setIsAnimating] = useState(true);

  // Sound management for new requests
  const tripRequests = useRideRequests();
  const soundRef = useRef<Audio.Sound | null>(null);
  const hasRequests = (tripRequests?.length ?? 0) > 0;

  useEffect(() => {
    let isMounted = true;

    const manageSound = async () => {
      try {
        if (hasRequests) {
          if (!soundRef.current) {
            await Audio.setAudioModeAsync({
              playsInSilentModeIOS: true,
              staysActiveInBackground: true,
              shouldDuckAndroid: true,
            });

            const { sound } = await Audio.Sound.createAsync(require("~/assets/new-request.mp3"), {
              isLooping: true,
            });

            if (isMounted) {
              soundRef.current = sound;
              await sound.playAsync();
            } else {
              await sound.unloadAsync();
            }
          }
        } else {
          if (soundRef.current) {
            try {
              await soundRef.current.stopAsync();
              await soundRef.current.unloadAsync();
            } finally {
              soundRef.current = null;
            }
          }
        }
      } catch (error) {
        console.error("Error managing sound:", error);
      }
    };

    manageSound();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [hasRequests]);

  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const { subscribeToTopic, mqttClient, setOnReconnect, skipNextReconnect } = useMqtt()!;
  const { updateLastSeen } = usePushNotifications();
  const { fetchStatus } = useDriverStatusStore();

  useEffect(() => {
    if (userQuery.data?.authenticated) {
      fetchStatus();
    }
  }, [fetchStatus, userQuery.data?.authenticated]);

  const handleReconnect = useCallback(() => {
    onReconnect();
    updateLastSeen();
    fetchStatus();
  }, [updateLastSeen, fetchStatus]);
  useAppStateBackground(mqttClient, handleReconnect, skipNextReconnect);

  // Register MQTT reconnect handler
  useEffect(() => {
    setOnReconnect(() => onReconnect);
    return () => setOnReconnect(undefined);
  }, [setOnReconnect]);

  const { profileId } = userQuery.data || {};
  const userAuthenticated = userQuery.data?.authenticated;

  useEffect(() => {
    if (!previouslyAuthenticated || !isHydrated) {
      setIsBootstrapped(true);
      return;
    }

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
  }, [isHydrated, previouslyAuthenticated]);

  useEffect(() => {
    if (userAuthenticated && !previouslyAuthenticated) {
      useAppStore.getState().setPreviouslyAuthenticated(true);
    }
  }, [previouslyAuthenticated, userAuthenticated]);

  const isLoading = isAnimating || !isBootstrapped || userQuery.isLoading || !isHydrated;

  useEffect(() => {
    if (!profileId || !userAuthenticated) return;

    subscribeToTopic(`driver/${profileId}`);
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
                    name="sos-contacts"
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
                    name="notifications"
                    options={{
                      headerShown: false,
                      presentation: "card",
                      animation: "slide_from_right",
                      gestureEnabled: true,
                    }}
                  />
                  <Stack.Screen
                    name="service-areas"
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
