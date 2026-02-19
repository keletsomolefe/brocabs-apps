import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container, Fill } from "@brocabs/ui/layout";
import { VehicleSelection } from "~/features/authentication/components/vehicle-selection";

export default function VehicleSelectionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <Fill backgroundColor="Neutrals/50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}>
        <Container px={20} gap={24} pt={20}>
          <VehicleSelection />
        </Container>
      </ScrollView>
    </Fill>
  );
}
