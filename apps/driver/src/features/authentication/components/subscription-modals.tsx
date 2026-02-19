import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Image, StyleSheet, View } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";
import { AssetFiles } from "~/theme/assets";

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 20,
  },
  modalContainerWithShadow: {
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
  requestSubmittedContainer: {
    marginHorizontal: 20,
    backgroundColor: "#FCFCFA",
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
  lowBalanceImage: {
    width: 220,
    height: 178,
  },
  congratsImage: {
    width: 220,
    height: 178,
  },
  freeTrialImage: {
    width: 220,
    height: 232,
  },
  requestSubmittedImage: {
    width: 220,
    height: 204,
  },
});

/**
 * Low Balance / Insufficient Balance modal
 * Shows when user doesn't have enough funds
 */
export function LowBalanceModal({ onReplaceCard }: LowBalanceModalProps) {
  const { t } = useLocale();

  return (
    <View style={styles.modalContainerWithShadow}>
      <View style={styles.imageContainer}>
        <Image
          source={AssetFiles.images["low-balance-icon"]}
          style={styles.lowBalanceImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/950">
          {t("subscription.insufficientBalance")}
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/950">
          {t("subscription.insufficientBalanceDesc")}
        </Regular>
      </Container>
      <Button
        variant="primary"
        label={t("subscription.replaceCard")}
        onPress={onReplaceCard}
        radius="rounded"
        size="lg"
      />
    </View>
  );
}

interface LowBalanceModalProps {
  onReplaceCard: () => void;
}

/**
 * Congrats / Successfully Purchased modal
 * Shows when subscription payment is successful
 */
export function CongratsModal({ planName, adminFee = "300", year, onSubmit }: CongratsModalProps) {
  const currentYear = year || new Date().getFullYear();
  const { t } = useLocale();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={AssetFiles.images["congrats-icon"]}
          style={styles.congratsImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          {t("subscription.successfullyPurchased")}
        </SemiBold>
        <View>
          <Regular fontSize={14} lineHeight={24} center color="Primary/50">
            {t("subscription.purchaseDescPart1", { planName })}{" "}
            <SemiBold fontSize={14} lineHeight={24} color="Primary/600">
              R {adminFee}
            </SemiBold>{" "}
            {t("subscription.purchaseDescPart2", { year: currentYear })}
          </Regular>
        </View>
      </Container>
      <Button
        variant="primary"
        label={t("subscription.submit")}
        onPress={onSubmit}
        radius="rounded"
        size="lg"
      />
    </View>
  );
}

interface CongratsModalProps {
  planName: string;
  adminFee?: string;
  year?: number;
  onSubmit: () => void;
}

/**
 * Request Submitted modal
 * Shows when subscription requires admin approval
 */
export function RequestSubmittedModal({ onClose }: RequestSubmittedModalProps) {
  const { t } = useLocale();

  return (
    <View style={styles.requestSubmittedContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={AssetFiles.images["request-submitted-icon"]}
          style={styles.requestSubmittedImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} center color="Primary/50">
          {t("subscription.requestSubmitted")}
        </SemiBold>
        <Regular fontSize={14} center color="Primary/50">
          {t("subscription.requestSubmittedDesc")}
        </Regular>
      </Container>
      <Button
        variant="primary"
        label={t("subscription.close")}
        onPress={onClose}
        radius="rounded"
        size="lg"
      />
    </View>
  );
}

interface RequestSubmittedModalProps {
  onClose: () => void;
}

/**
 * Free Trial modal
 * Shows when user's free trial is approved
 */
export function FreeTrialModal({ trialDays = 15, onContinue }: FreeTrialModalProps) {
  const { t } = useLocale();

  return (
    <View style={styles.modalContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={AssetFiles.images["free-trial-icon"]}
          style={styles.freeTrialImage}
          resizeMode="contain"
        />
      </View>
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          {t("subscription.congratulations")}
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/50">
          {t("subscription.freeTrialApproved", { days: trialDays })}
        </Regular>
      </Container>
      <Button
        variant="primary"
        label={t("subscription.continueToApp")}
        onPress={onContinue}
        radius="rounded"
        size="lg"
      />
    </View>
  );
}

interface FreeTrialModalProps {
  trialDays?: number;
  onContinue: () => void;
}
