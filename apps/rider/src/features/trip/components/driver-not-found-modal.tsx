import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Image, StyleSheet, View } from "react-native";
import { useTranslation } from "~/i18n/LocaleContext";

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
    height: 220,
  },
});

interface DriverNotFoundModalProps {
  onTryAgain: () => void;
  onGoBack: () => void;
  isLoading?: boolean;
}

/**
 * Driver Not Found Modal
 * Shows when no driver is available for the requested route
 */
export function DriverNotFoundModal({ onTryAgain, onGoBack, isLoading }: DriverNotFoundModalProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={AssetFiles.images["mascot-ride-not-found"]}
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          {t("common.noDriverFound")}
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/50">
          {t("common.noDriverMessage")}
        </Regular>
      </Container>
      <Container gap={10}>
        <Button
          variant="primary"
          label={t("common.tryAgain")}
          onPress={onTryAgain}
          radius="rounded"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading}
        />
        <Button
          variant="light"
          label={t("common.goBack")}
          onPress={onGoBack}
          radius="rounded"
          size="lg"
          disabled={isLoading}
        />
      </Container>
    </View>
  );
}
