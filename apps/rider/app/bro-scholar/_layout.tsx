import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack, router, useSegments } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { BroScholarText } from "~/shared/ui/bro-scholar-text";
import { Icon } from "~/shared/ui/icons";

function BroScholarHeaderLeft({ canGoBack }: { canGoBack: boolean }) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  const { t } = useTranslation();

  const title =
    lastSegment === "create-application" ? (
      <Regular fontSize={18} color="Primary/50">
        {t("common.uploadDocuments")}
      </Regular>
    ) : (
      <BroScholarText fontSize={18} lineHeight={24} width={85} />
    );

  return (
    <Container flexDirection="row" alignItems="center" gap={14}>
      <TouchableOpacity onPress={() => (canGoBack ? router.back() : router.replace("/(app)/home"))}>
        <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
      </TouchableOpacity>
      {title}
    </Container>
  );
}

export default function BroScholarLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          presentation: "card",
          headerShown: true,
          headerLeft: ({ canGoBack }) => <BroScholarHeaderLeft canGoBack={!!canGoBack} />,
          headerTitle: "",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Colors["Bg Color"],
          },
        }}>
        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="create-application" options={{ title: "" }} />
      </Stack>
    </View>
  );
}
