import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Image, StyleSheet, View } from "react-native";
import { AssetFiles } from "~/theme/assets";

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 20,
    shadowColor: "rgba(58, 12, 163, 0.14)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    alignItems: "center" as const,
  },
  mascotImage: {
    width: 220,
    height: 178,
  },
});

interface RiderCancelledModalProps {
  onViewMap: () => void;
  isLoading?: boolean;
}

/**
 * Rider Cancelled Modal
 * Shows when a rider cancels the trip while the driver is not on the rides list screen
 */
export function RiderCancelledModal({ onViewMap, isLoading }: RiderCancelledModalProps) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={AssetFiles.images["mascot-ride-cancelled"]}
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2} px={20}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          Rider cancelled
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/50">
          You are free to leave, this ride will not affect your profile at all
        </Regular>
      </Container>
      <Button
        variant="primary"
        label="View Map"
        onPress={onViewMap}
        radius="rounded"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
}
