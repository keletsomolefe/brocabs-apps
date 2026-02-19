import { Colors } from "@brocabs/ui/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { CardType, formatExpiry, maskCardNumber } from "../types";
import { useTranslation } from "~/i18n/LocaleContext";

interface CardVisualProps {
  /**
   * Masked card number
   */
  maskedNumber: string;
  /**
   * Cardholder name
   */
  holderName: string;
  /**
   * Expiry month (01-12)
   */
  expiryMonth: number;
  /**
   * Expiry year (YY or YYYY)
   */
  expiryYear: number;
  /**
   * Card type (VISA, Mastercard, etc.)
   */
  cardType?: CardType;
  /**
   * Size variant
   */
  size?: "small" | "medium" | "large";
  /**
   * Whether this card is selected
   */
  selected?: boolean;
}

/**
 * CardVisual Component
 *
 * Renders a credit card visual with gradient background.
 * Based on Figma design with purple/pink gradient and gold chip.
 */
export function CardVisual({
  maskedNumber,
  holderName,
  expiryMonth,
  expiryYear,
  cardType = CardType.VISA,
  size = "large",
  selected = false,
}: CardVisualProps) {
  const { t } = useTranslation();
  const sizeStyles = SIZE_STYLES[size];

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      style={[styles.container, sizeStyles.container, selected && styles.selectedContainer]}>
      <LinearGradient
        colors={["#7B6FE8", "#D4A5FF", "#F5C6EC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, sizeStyles.container]}>
        {/* Card Header - Chip & Card Type */}
        <View style={styles.header}>
          {/* Chip icon placeholder */}
          <View style={[styles.chip, sizeStyles.chip]}>
            <View style={styles.chipLines} />
          </View>
          <Animated.Text style={[styles.cardType, sizeStyles.cardType]}>{cardType}</Animated.Text>
        </View>

        {/* Card Number */}
        <Animated.Text style={[styles.cardNumber, sizeStyles.cardNumber]}>
          {maskCardNumber(maskedNumber)}
        </Animated.Text>

        {/* Card Footer - Holder Name & Expiry */}
        <View style={styles.footer}>
          <View style={styles.holderContainer}>
            <Animated.Text style={[styles.label, sizeStyles.label]}>
              {t("common.cardHolderName")}
            </Animated.Text>
            <Animated.Text style={[styles.holderName, sizeStyles.holderName]}>
              {holderName}
            </Animated.Text>
          </View>
          <View style={styles.expiryContainer}>
            <Animated.Text style={[styles.label, sizeStyles.label]}>{t("common.expDate")}</Animated.Text>
            <Animated.Text style={[styles.expiry, sizeStyles.expiry]}>
              {formatExpiry(expiryMonth, expiryYear)}
            </Animated.Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const SIZE_STYLES = {
  small: StyleSheet.create({
    container: { width: 292, height: 150, borderRadius: 20 },
    chip: { width: 25, height: 18 },
    cardType: { fontSize: 12 },
    cardNumber: { fontSize: 18, lineHeight: 24 },
    label: { fontSize: 9, lineHeight: 12 },
    holderName: { fontSize: 15, lineHeight: 27 },
    expiry: { fontSize: 15, lineHeight: 27 },
  }),
  medium: StyleSheet.create({
    container: { width: 330, height: 180, borderRadius: 20 },
    chip: { width: 30, height: 22 },
    cardType: { fontSize: 14 },
    cardNumber: { fontSize: 20, lineHeight: 28 },
    label: { fontSize: 10, lineHeight: 14 },
    holderName: { fontSize: 16, lineHeight: 30 },
    expiry: { fontSize: 16, lineHeight: 30 },
  }),
  large: StyleSheet.create({
    container: { width: "100%" as any, height: 200, borderRadius: 20 },
    chip: { width: 33, height: 25 },
    cardType: { fontSize: 16 },
    cardNumber: { fontSize: 24, lineHeight: 32 },
    label: { fontSize: 12, lineHeight: 16 },
    holderName: { fontSize: 20, lineHeight: 36 },
    expiry: { fontSize: 20, lineHeight: 36 },
  }),
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: Colors["Primary/600"],
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  chip: {
    backgroundColor: "#D4AF37",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  chipLines: {
    width: "60%",
    height: "60%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    borderRadius: 2,
  },
  cardType: {
    fontFamily: "BRHendrix-SemiBold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  cardNumber: {
    fontFamily: "BRHendrix-SemiBold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  holderContainer: {
    flex: 1,
  },
  expiryContainer: {
    alignItems: "flex-end",
  },
  label: {
    fontFamily: "BRHendrix-Regular",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  holderName: {
    fontFamily: "BRHendrix-Regular",
    color: "#FFFFFF",
  },
  expiry: {
    fontFamily: "BRHendrix-Regular",
    color: "#FFFFFF",
  },
});
