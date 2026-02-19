import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router, useSegments } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

const ProfileSettingsSegmentsMap: Record<string, string> = {
  "profile-settings": "common.profileSettings",
  index: "common.profileSettings",
  "payment-methods": "common.paymentMethods",
  "edit-profile": "common.editProfile",
  "notification-settings": "common.notificationSettings",
  support: "common.helpSupport",
  "account-security": "common.accountSecurity",
  "change-password": "common.changePassword",
  faqs: "common.faq",
  "contact-support": "common.contactSupport",
  "privacy-policies": "common.privacyPolicies",
  "update-email": "common.changeEmail",
  "update-phone-number": "common.changeMobileNumber",
  "my-cards": "common.myCards",
  wallet: "common.wallet",
};

function ProfileSettingsHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1] || "profile-settings";
  const { t } = useTranslation();

  const translationKey = ProfileSettingsSegmentsMap[lastSegment] || "common.profileSettings";
  const title = t(translationKey as any);

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
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="payment-methods" />
        <Stack.Screen name="notification-settings" />
        <Stack.Screen name="support" />
        <Stack.Screen name="faqs" />
        <Stack.Screen name="contact-support" />
        <Stack.Screen name="privacy-policies" />
        <Stack.Screen name="account-security" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="update-email" />
        <Stack.Screen name="update-phone-number" />
        <Stack.Screen name="my-cards" />
      </Stack>
    </View>
  );
}
