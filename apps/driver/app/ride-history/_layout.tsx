import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router, useSegments } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

function RideHistoryHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  const { t } = useLocale();
  const title = lastSegment === "[id]" ? t("common.rideDetails") : t("drawer.myRidesHistory");

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

export default function RideHistoryLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          headerShown: true,
          headerLeft: ({ canGoBack }) => <RideHistoryHeaderLeft canGoBack={!!canGoBack} />,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
      </Stack>
    </View>
  );
}
