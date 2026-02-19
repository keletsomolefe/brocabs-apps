import { Column, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentAddress } from "~/features/trip/stores/locationStore";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { TripPhase } from "~/features/trip/trip-phase";
import { useTranslation } from "~/i18n/LocaleContext";
import { BaseHeader } from "~/shared/ui/headers";
import { Icon } from "~/shared/ui/icons";
import { useLayoutStore } from "~/stores/layout-store";

import { withConnectionStatus } from "~/shared/ui/with-connection-status";

const RechargeHeader = withConnectionStatus(function RechargeHeader({
  connectionBannerVisible,
}: {
  connectionBannerVisible?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <BaseHeader
      title={t("common.rechargeWallet")}
      connectionBannerVisible={connectionBannerVisible}
    />
  );
});

const HomeHeader = withConnectionStatus(function HomeHeader({
  connectionBannerVisible,
}: {
  connectionBannerVisible?: boolean;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { data: currentAddress } = useCurrentAddress();
  const { phase, back, push } = useTripFlow();
  const setHomeHeaderHeight = useLayoutStore((state) => state.setHomeHeaderHeight);

  return (
    <Column
      onLayout={(event) => setHomeHeaderHeight(event.nativeEvent.layout.height)}
      px={20}
      style={{ paddingTop: connectionBannerVisible ? 10 : insets.top }}>
      <Row justifyContent="space-between" alignItems="center" height={62} pb={10}>
        <Column gap={10}>
          <Image
            source={
              phase === TripPhase.Home
                ? AssetFiles.images["logo-navbar"]
                : AssetFiles.images["logo-dark"]
            }
            width={85.5}
            height={31.3}
          />
          <Row gap={5} alignItems="center">
            {(phase === TripPhase.Home || phase === TripPhase.Wallet) && (
              <>
                <Icon name="map-pin" width={16} height={16} color={Colors["Primary/600"]} />
                <Regular color={phase === TripPhase.Home ? "white" : "Neutrals/600"} fontSize={12}>
                  {currentAddress || t("common.locating")}
                </Regular>
              </>
            )}
          </Row>
        </Column>
        <Row gap={10}>
          <TouchableOpacity
            activeOpacity={0.9}
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor="Danger/600"
            justifyContent="center"
            alignItems="center"
            onPress={() => (phase === TripPhase.Wallet ? back() : push(TripPhase.Wallet))}>
            <Icon
              name={phase === TripPhase.Wallet ? "home" : "wallet"}
              width={24}
              height={24}
              color={Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor="Primary/600"
            justifyContent="center"
            alignItems="center"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon name="menu" width={24} height={24} color={Colors.white} />
          </TouchableOpacity>
        </Row>
      </Row>
    </Column>
  );
});

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
        animation: "none",
        presentation: "card",
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTransparent: true,
          header: () => <HomeHeader />,
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="recharge"
        options={{
          animation: "default",
          headerShown: true,
          header: () => <RechargeHeader />,
        }}
      />
      <Stack.Screen name="my-cards" options={{ headerShown: false }} />
    </Stack>
  );
}
