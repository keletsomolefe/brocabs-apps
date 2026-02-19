import { Regular, SemiBold } from "@brocabs/ui/text";
import { BlurView } from "expo-blur";
import * as Linking from "expo-linking";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Column, Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";

import { useWalletFlow } from "../hooks";
import { useWalletStore } from "../store";
import { formatCurrency } from "../types";
import { useTranslation } from "~/i18n/LocaleContext";

interface SuccessScreenProps {
  variant: "card-added" | "recharge";
  amount?: number;
  newBalance?: number;
  onDone?: () => void;
}

export function SuccessScreen({ variant, amount, newBalance, onDone }: SuccessScreenProps) {
  const { t } = useTranslation();
  const { navigateToDashboard } = useWalletFlow();
  const { cardSaving } = useWalletStore();

  const hasAuthUrl = variant === "card-added" && !!cardSaving.authorizationUrl;

  const handleOpenAuthUrl = async () => {
    if (cardSaving.authorizationUrl) {
      try {
        await Linking.openURL(cardSaving.authorizationUrl);
      } catch (error) {
        console.error("Failed to open authorization URL:", error);
      }
    }
  };

  const handlePrimaryAction = () => {
    if (hasAuthUrl) {
      handleOpenAuthUrl();
    } else {
      if (onDone) {
        onDone();
      } else {
        navigateToDashboard();
      }
    }
  };

  const title = variant === "card-added" ? t("wallet.cardAdded") : t("wallet.successfullyRecharged");
  const description =
    variant === "card-added"
      ? t("wallet.cardAddedDesc")
      : `${formatCurrency(amount || 0)} added into your wallet`;

  return (
    <Fill>
      {/* Backdrop */}
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(10, 2, 26, 0.4)" }]} />

      {/* Centered Card */}
      <View style={styles.centeredContainer}>
        <Container
          backgroundColor="white"
          borderRadius={20}
          p={20}
          width="100%"
          maxWidth={390}
          alignItems="center"
          gap={20}
          style={styles.cardShadow}>
          {/* Icon */}
          <Container width={91} height={91} alignItems="center" justifyContent="center">
            <Svg width={91} height={91} viewBox="0 0 91 91" fill="none">
              <Path
                d="M45.5 0C20.4116 0 0 20.4116 0 45.5C0 70.5884 20.4116 91 45.5 91C70.5884 91 91 70.5884 91 45.5C91 20.4116 70.5884 0 45.5 0ZM56.0416 26.5606L61.3134 31.1675L45.2113 49.5644L39.9394 44.52L56.0416 26.5606ZM31.4847 64.4503L16.0497 49L21 44.0497L36.4372 59.5L31.4847 64.4503ZM45.7034 64.6231L30.0891 49L35.0416 44.0519L45.3578 54.3791L69.6675 26.5606L74.9394 31.1675L45.7034 64.6231Z"
                fill="#319F43"
              />
            </Svg>
          </Container>

          {/* Text */}
          <Column alignItems="center" gap={2} width="100%">
            <SemiBold fontSize={24} style={{ textAlign: "center", color: "#0A021A" }}>
              {title}
            </SemiBold>
            <Regular fontSize={14} style={{ textAlign: "center", color: "#0A021A" }}>
              {description}
            </Regular>
          </Column>

          {/* Buttons */}
          <Row gap={10} width="100%">
            {/* View Details Button (Secondary) */}
            <TouchableOpacity
              flex={1}
              height={56}
              backgroundColor="#E7E7FF"
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              onPress={() => {
                // Handle View Details - maybe navigate to transaction history?
                // For now, just close or do nothing specific as per requirement "View Details"
                if (onDone) onDone();
              }}>
              <Regular fontSize={18} color="Primary/600">
                {t("common.viewDetails")}
              </Regular>
            </TouchableOpacity>

            {/* Close Button (Primary) */}
            <TouchableOpacity
              flex={1}
              height={56}
              backgroundColor="Primary/600"
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              onPress={handlePrimaryAction}>
              <SemiBold fontSize={18} color="white">
                {t("common.close")}
              </SemiBold>
            </TouchableOpacity>
          </Row>
        </Container>
      </View>
    </Fill>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardShadow: {
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
