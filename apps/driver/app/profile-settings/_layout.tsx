import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router, useSegments } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";

const ProfileSettingsSegmentsMap: Record<string, string> = {
  "profile-settings": "Profile",
  index: "Profile",
  "payment-methods": "Payment Methods",
  "edit-profile": "Edit Profile",
  subscriptions: "My Subscriptions",
  "notification-settings": "Notification Settings",
  support: "Help & Support",
  "account-security": "Account & Security",
  "change-password": "Change Password",
  faqs: "FAQs",
  "contact-support": "Contact Support",
  "privacy-policies": "Privacy Policies",
  "vehicle-info": "Vehicle Details",
  "driver-plans": "Driver Plans",
  "card-details": "Card Details",
  "add-card": "Add Card",
  "update-email": "Change Email",
  "update-phone-number": "Change Mobile Number",
};

function ProfileSettingsHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1] || "profile-settings";
  const title = ProfileSettingsSegmentsMap[lastSegment] || "Profile";

  return (
    <Container flexDirection="row" alignItems="center" gap={14}>
      <TouchableOpacity onPress={() => (canGoBack ? router.back() : router.replace("/(app)/home"))}>
        <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
      </TouchableOpacity>
      <Regular fontSize={18} color="Primary/50">
        {title}
      </Regular>
    </Container>
  );
}

export default function ProfileSettingsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          headerShown: true,
          headerLeft: ({ canGoBack }) => <ProfileSettingsHeaderLeft canGoBack={!!canGoBack} />,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="support" />
        <Stack.Screen name="faqs" />
        <Stack.Screen name="contact-support" />
        <Stack.Screen name="privacy-policies" />
        <Stack.Screen name="subscriptions" />
        <Stack.Screen name="notification-settings" />
        <Stack.Screen name="account-security" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="update-email" />
        <Stack.Screen name="update-phone-number" />
        <Stack.Screen name="payment-methods" />
        <Stack.Screen name="add-card" />
        <Stack.Screen name="card-details" />
        <Stack.Screen name="vehicle-info" />
        <Stack.Screen name="driver-plans" />
      </Stack>
    </View>
  );
}
