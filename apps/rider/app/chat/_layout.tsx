import { ChatHeader } from "@brocabs/ui";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveRide } from "~/features/trip/hooks/use-ride";

export default function ChatLayout() {
  const insets = useSafeAreaInsets();
  const { data: activeRide } = useActiveRide();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          presentation: "card",
          headerShown: true,
          header: () => (
            <ChatHeader
              name={activeRide?.driverProfile?.fullName || "Driver"}
              avatar={activeRide?.driverProfile?.avatar?.publicUrl || undefined}
            />
          ),
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen name="index" options={{ title: "" }} />
      </Stack>
    </View>
  );
}
