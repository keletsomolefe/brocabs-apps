import { Container, TouchableOpacity } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { UnmountOnBlur } from "@brocabs/ui/unmount-onblur";
import { router, Stack, useSegments } from "expo-router";
import { Icon } from "~/shared/ui/icons";

export default function AuthLayout() {
  return (
    <UnmountOnBlur>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTransparent: false,
          headerLeft: AuthHeaderLeft,
          headerBackVisible: false,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors["Bg Color"],
          },
          headerTitle: () => null,
          title: "",
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />

        <Stack.Screen name="mobile-number" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="create-rider-profile" />
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
      </Stack>
    </UnmountOnBlur>
  );
}

function AuthHeaderLeft() {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  let title = "";

  if (lastSegment === "create-account" || lastSegment === "create-rider-profile") {
    title = "Setup Your Profile";
  }

  return (
    <Container flexDirection="row" alignItems="center" gap={14} style={{}}>
      <TouchableOpacity onPress={() => router.back()}>
        <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
      </TouchableOpacity>
      {title && (
        <Regular fontSize={18} color="Primary/50">
          {title}
        </Regular>
      )}
    </Container>
  );
}
