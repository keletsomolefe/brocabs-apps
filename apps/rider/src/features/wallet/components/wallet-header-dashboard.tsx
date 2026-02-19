import { Column, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentAddress } from "~/features/trip/stores/locationStore";
import { Icon } from "~/shared/ui/icons";

const HEADER_CONTENT_HEIGHT = 62;
const HEADER_VERTICAL_PADDING = 15;

export function WalletHeaderDashboard() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: currentAddress } = useCurrentAddress();

  return (
    <Column
      width="100%"
      px={15}
      paddingTop={insets.top + HEADER_VERTICAL_PADDING}
      paddingBottom={HEADER_VERTICAL_PADDING}
      borderBottomRightRadius={20}>
      <Row justifyContent="space-between" height={HEADER_CONTENT_HEIGHT} alignItems="center">
        <Column gap={10}>
          <Image source={AssetFiles.images["logo-dark"]} width={95} height={36} />
          <Row gap={5} alignItems="center">
            <Icon name="map-pin" width={16} height={16} color={Colors["Primary/600"]} />
            <Regular color="Primary/50" fontSize={12}>
              {currentAddress || "Locating..."}
            </Regular>
          </Row>
        </Column>
        <Row gap={10}>
          <TouchableOpacity
            activeOpacity={0.9}
            width={36}
            height={36}
            borderRadius={10}
            backgroundColor="Secondary/400"
            justifyContent="center"
            alignItems="center"
            onPress={() => {
              // Already on wallet screen
            }}>
            <Icon name="wallet" width={24} height={24} color={Colors.black} />
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
}
