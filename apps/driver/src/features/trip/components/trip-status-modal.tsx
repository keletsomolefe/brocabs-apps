import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";

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

interface TripStatusModalProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  buttonLabel?: string;
  onPress: () => void;
  isLoading?: boolean;
}

/**
 * Trip Status Modal
 * Generic modal for trip statuses like Cancelled, No Show etc.
 */
export function TripStatusModal({
  title,
  description,
  image,
  buttonLabel,
  onPress,
  isLoading,
}: TripStatusModalProps) {
  const { t } = useLocale();
  const label = buttonLabel || t("trip.viewMap");

  return (
    <View style={styles.modalContainer}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.mascotImage} resizeMode="contain" />
      </View>
      <Container alignItems="center" gap={2} px={20}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          {title}
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/50">
          {description}
        </Regular>
      </Container>
      <Button
        variant="primary"
        label={label}
        onPress={onPress}
        radius="rounded"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
      />
    </View>
  );
}
