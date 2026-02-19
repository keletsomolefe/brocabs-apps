import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

function NotificationsHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const { t } = useTranslation();

  return (
    <Container flexDirection="row" alignItems="center" gap={14}>
      <TouchableOpacity onPress={() => (canGoBack ? router.back() : router.replace("/(app)/home"))}>
        <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
      </TouchableOpacity>
      <Regular fontSize={18} color="Primary/50">
        {t("common.notifications")}
      </Regular>
    </Container>
  );
}

export default function NotificationsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          headerShown: true,
          headerLeft: ({ canGoBack }) => <NotificationsHeaderLeft canGoBack={!!canGoBack} />,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen name="index" />
      </Stack>
    </View>
  );
}
