import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router, useSegments } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

function ComplaintsHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1] || "complaints";
  const { t } = useTranslation();

  const title =
    lastSegment === "[id]"
      ? t("common.complaintDetail")
      : lastSegment === "add-complain"
        ? t("common.addComplain")
        : t("common.myComplaints");

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

export default function ComplaintsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          headerShown: true,
          headerLeft: ({ canGoBack }) => <ComplaintsHeaderLeft canGoBack={!!canGoBack} />,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="[id]" />
        <Stack.Screen name="add-complain" />
      </Stack>
    </View>
  );
}
