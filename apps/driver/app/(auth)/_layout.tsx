import { Container, TouchableOpacity } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: false,
        header: Header,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerTitle: () => null,
        title: "",
        headerStyle: {
          backgroundColor: Colors["Neutrals/50"],
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false, animation: "slide_from_right" }} />
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false, animation: "slide_from_right" }}
      />
      <Stack.Screen name="mobile-number" />
      {/* ADDED */}
      <Stack.Screen name="driver-plans" />
      <Stack.Screen name="vehicle-selection" />
      <Stack.Screen name="vehicle-details" />
      {/* END ADDED */}
      <Stack.Screen name="create-account" />
      <Stack.Screen name="create-driver-profile" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="admin-fee" />
      <Stack.Screen name="area-of-operation" />
      <Stack.Screen name="bank-details" />
      <Stack.Screen name="add-card-welcome" />
      <Stack.Screen name="add-card-method" />
      <Stack.Screen name="add-card-details" />
      <Stack.Screen name="card-added-success" options={{ headerShown: false }} />
      <Stack.Screen name="driver-documents" />
    </Stack>
  );
}

function Header(props: any) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  let title = "";

  if (lastSegment === "create-account" || lastSegment === "create-driver-profile") {
    title = "Setup Your Profile";
  } else if (lastSegment === "admin-fee") {
    title = "Pay admin Fee";
  } else if (lastSegment === "driver-documents") {
    title = "Upload Documents";
  } else if (lastSegment === "vehicle-selection") {
    title = "Choose Vehicle Type";
  } else if (lastSegment === "driver-plans") {
    title = "Choose Subscription";
  } else if (lastSegment === "vehicle-details") {
    title = "Vehicle Details";
  } else if (lastSegment === "area-of-operation") {
    title = "Select Service Areas";
  } else if (lastSegment === "bank-details") {
    title = "Bank Details";
  } else if (lastSegment === "add-card-welcome") {
    title = "Add a Card for Payments";
  } else if (lastSegment === "add-card-method") {
    title = "Add a card to your wallet";
  }

  const canGoBack = props.navigation.canGoBack();

  return (
    <Container pt={insets.top} backgroundColor="Neutrals/50">
      <Container height={56} flexDirection="row" alignItems="center" px={20} gap={14}>
        <TouchableOpacity
          onPress={canGoBack ? () => props.navigation.goBack() : undefined}
          disabled={!canGoBack}>
          <Icon
            name="arrow-back"
            width={22}
            height={18}
            color={canGoBack ? Colors["Primary/50"] : "#E7E7FF"}
          />
        </TouchableOpacity>
        {title && (
          <Regular fontSize={18} color="Primary/50">
            {title}
          </Regular>
        )}
      </Container>
    </Container>
  );
}
