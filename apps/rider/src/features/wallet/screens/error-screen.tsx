import { Colors } from "@brocabs/ui/theme/colors";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Column } from "@brocabs/ui/layout";
import { Icon } from "~/shared/ui/icons";

import { useTranslation } from "~/i18n/LocaleContext";
import { WalletHeader } from "../components";
import { useWalletFlow } from "../hooks";

interface ErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * ErrorScreen Component
 *
 * Shows when an error occurs during wallet operations.
 * Displays error message and retry option.
 */
export function ErrorScreen({ title, message, onRetry, retryLabel }: ErrorScreenProps) {
  const { t } = useTranslation();
  const { error, navigateToDashboard, retryCardSave, cardSaving, recharge } = useWalletFlow();

  // Use translated defaults
  const displayTitle = title || t("wallet.somethingWentWrong");
  const displayRetryLabel = retryLabel || t("common.tryAgain");

  // Determine error message and retry action
  const displayMessage = message || error || t("wallet.unexpectedError");

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (cardSaving.status === "error") {
      retryCardSave();
    } else if (recharge.status === "error") {
      navigateToDashboard();
    } else {
      navigateToDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <WalletHeader title={t("common.error")} onBack={navigateToDashboard} />

      <View style={styles.content}>
        {/* Error Icon */}
        <Animated.View entering={FadeIn.delay(100).duration(400)} style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="cancel-outline" width={40} height={40} color={Colors["Danger/600"]} />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Column alignItems="center" gap={12}>
          <Animated.Text entering={FadeInUp.delay(200).duration(400)} style={styles.title}>
            {displayTitle}
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(300).duration(400)} style={styles.message}>
            {displayMessage}
          </Animated.Text>
        </Column>

        {/* Action Buttons */}
        <Column gap={16} style={styles.buttonContainer}>
          <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.buttonWrapper}>
            <Button label={displayRetryLabel} variant="primary" onPress={handleRetry} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.buttonWrapper}>
            <Button
              label={t("wallet.goToWallet")}
              variant="outline"
              onPress={navigateToDashboard}
            />
          </Animated.View>
        </Column>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors["Bg Color"],
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors["Danger/600"] + "1a",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "BRHendrix-Bold",
    fontSize: 24,
    lineHeight: 32,
    color: Colors["Primary/50"],
    textAlign: "center",
  },
  message: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: Colors["Neutrals/400"],
    textAlign: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  buttonWrapper: {
    width: "100%",
  },
});
