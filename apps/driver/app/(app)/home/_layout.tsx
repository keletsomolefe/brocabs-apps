import { Column, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Stack, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_CONTENT_HEIGHT, HEADER_VERTICAL_PADDING } from "~/features/trip/layout-constants";
import { useCurrentAddress } from "~/features/trip/stores/locationStore";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { TripPhase } from "~/features/trip/trip-phase";
import { BaseHeader } from "~/shared/ui/headers";
import { Icon } from "~/shared/ui/icons";
import { withConnectionStatus } from "~/shared/ui/with-connection-status";
import { useLayoutStore } from "~/stores/layout-store";

const HomeSegmentsMap: Record<string, string> = {
  withdrawal: "Withdraw",
  "edit-bank-details": "Edit Banking Details",
};

const StackHeader = withConnectionStatus(function StackHeader({
  connectionBannerVisible,
}: {
  connectionBannerVisible?: boolean;
}) {
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  const title = HomeSegmentsMap[lastSegment] || "";

  return <BaseHeader title={title} connectionBannerVisible={connectionBannerVisible} />;
});

const HomeHeader = withConnectionStatus(function HomeHeader({
  connectionBannerVisible,
}: {
  connectionBannerVisible?: boolean;
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { phase, back, push } = useTripFlow();
  const { data: currentAddress } = useCurrentAddress();
  const setHomeHeaderHeight = useLayoutStore((state) => state.setHomeHeaderHeight);

  const isHomePhase =
    phase === TripPhase.RidesList || phase === TripPhase.RidesListMap || phase === TripPhase.Wallet;

  return (
    <Column
      onLayout={(event) => setHomeHeaderHeight(event.nativeEvent.layout.height)}
      px={15}
      borderBottomLeftRadius={20}
      backgroundColor={phase === TripPhase.RidesListMap ? "white" : "transparent"}
      paddingTop={
        connectionBannerVisible ? HEADER_VERTICAL_PADDING : insets.top + HEADER_VERTICAL_PADDING
      }
      paddingBottom={isHomePhase ? HEADER_VERTICAL_PADDING : 0}
      borderBottomRightRadius={20}>
      <Row justifyContent="space-between" height={HEADER_CONTENT_HEIGHT} alignItems="center">
        <Column gap={10}>
          <Image source={AssetFiles.images["logo-dark"]} width={95} height={36} />
          {isHomePhase && (
            <Row gap={5} alignItems="center">
              <Icon name="map-pin" width={16} height={16} color={Colors["Primary/600"]} />
              <Regular color="Primary/50" fontSize={12}>
                {currentAddress || "Locating..."}
              </Regular>
            </Row>
          )}
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
        name="withdrawal"
        options={{
          headerShown: true,
          header: () => <StackHeader />,
        }}
      />
      <Stack.Screen
        name="edit-bank-details"
        options={{
          headerShown: true,
          header: () => <StackHeader />,
        }}
      />
    </Stack>
  );
}
