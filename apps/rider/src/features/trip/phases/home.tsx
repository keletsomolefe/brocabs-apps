import { Colors } from "@brocabs/ui/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Column, Container, Fill, Image, ScrollView } from "@brocabs/ui/layout";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { RideSelector } from "~/features/home/component/ride-selector";
import { SearchTrigger } from "~/features/home/component/search-trigger";
import { useConnectionStatus } from "~/hooks/useConnectionStatus";

type Props = {
  pickup?: string;
  destination?: string;
  onSearchPress: () => void;
  onRequestRide: () => void;
};

export function HomePhase(props: Props) {
  const { pickup, destination, onSearchPress, onRequestRide } = props;
  const insets = useSafeAreaInsets();
  const { isBannerVisible } = useConnectionStatus();

  return (
    <LinearGradient
      colors={[Colors["Primary/700"], Colors["Primary/600"]]}
      style={{ flex: 1 }}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0, y: 1 }}>
      <Fill paddingTop={isBannerVisible ? insets.top + 30 : insets.top}>
        <Image
          source={AssetFiles.images.mascot}
          width={336}
          height={336}
          position="absolute"
          bottom={-80}
          right={-80}
        />
        <Fill px={20} mt={10}>
          <Container height={62} />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
            showsVerticalScrollIndicator={false}>
            <Column gap={24} pt={14}>
              <SearchTrigger pickup={pickup} destination={destination} onPress={onSearchPress} />
              <RideSelector onRequestRide={onRequestRide} />
            </Column>
          </ScrollView>
        </Fill>
      </Fill>
    </LinearGradient>
  );
}
