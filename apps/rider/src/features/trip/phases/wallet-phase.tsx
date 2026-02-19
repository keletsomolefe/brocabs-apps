import { Container, Fill } from "@brocabs/ui/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WalletScreen } from "~/features/wallet";
import { useConnectionStatus } from "~/hooks/useConnectionStatus";

export function WalletPhase() {
  const insets = useSafeAreaInsets();
  const { isBannerVisible } = useConnectionStatus();

  return (
    <Fill backgroundColor="Bg Color" paddingTop={isBannerVisible ? insets.top + 30 : insets.top}>
      <Fill mt={10}>
        <Container height={62} />
        <WalletScreen />
      </Fill>
    </Fill>
  );
}
