import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
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
    height: 178,
  },
});

interface InsufficientBalanceModalProps {
  onUseAnotherMethod: () => void;
}

/**
 * Insufficient Balance Modal
 * Shows when the user's wallet balance is insufficient for the ride
 */
export function InsufficientBalanceModal({ onUseAnotherMethod }: InsufficientBalanceModalProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      style={styles.modalContainer}
      entering={FadeInDown.springify().springify().damping(15).mass(1).stiffness(50)}>
      <View style={styles.imageContainer}>
        <Image
          source={require("~/assets/images/insufficient-funds.png")}
          style={styles.mascotImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          {t("common.insufficientBalance")}
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/50">
          {t("common.insufficientBalanceMessage")}
        </Regular>
      </Container>
      <Container gap={10}>
        <Button
          variant="primary"
          label={t("common.useAnotherMethod")}
          onPress={onUseAnotherMethod}
          radius="rounded"
          size="lg"
        />
      </Container>
    </Animated.View>
  );
}
