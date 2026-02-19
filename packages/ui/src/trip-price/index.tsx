import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Icon, IconName } from "../icons/icon";

import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TripPriceProps {
  paymentMethod?: PaymentMethodResponseDtoCodeEnum;
  price: number;
  isLast?: boolean;
}

export function TripPrice({ paymentMethod, price, isLast }: TripPriceProps) {
  const insets = useSafeAreaInsets();
  const getPaymentDetails = (): { icon: IconName; label: string } => {
    switch (paymentMethod) {
      case PaymentMethodResponseDtoCodeEnum.Card:
        return { icon: "card", label: "Card" };
      case PaymentMethodResponseDtoCodeEnum.Wallet:
        return { icon: "wallet", label: "Wallet" };
      case PaymentMethodResponseDtoCodeEnum.Cash:
      default:
        return { icon: "cash-hand-dark", label: "Cash" };
    }
  };

  const { icon: paymentIcon, label: paymentLabel } = getPaymentDetails();

  return (
    <View
      style={[
        styles.priceCard,
        isLast && { paddingBottom: insets.bottom + 15 },
      ]}
    >
      <View style={styles.priceRow}>
        <Icon name={paymentIcon} width={36} height={36} />
        <Text style={styles.priceText}>
          {paymentLabel}: R {Math.round(price)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  priceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#0A021A",
    fontFamily: "BR Hendrix",
  },
});
