import { Colors } from "@brocabs/ui/theme/colors";
import { format } from "date-fns";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { Icon } from "~/shared/ui/icons";
import { Row } from "@brocabs/ui/layout";

import { formatCurrency, Transaction, TransactionType } from "../types";

interface TransactionRowProps {
  transaction: Transaction;
  index?: number;
}

/**
 * TransactionRow Component
 *
 * Displays a single transaction in the wallet history.
 * Shows different icons based on transaction type.
 */
export function TransactionRow({ transaction, index = 0 }: TransactionRowProps) {
  const isCredit =
    transaction.type === TransactionType.RECHARGE || transaction.type === TransactionType.REFUND;

  const amountColor = isCredit ? Colors["Success/400"] : Colors["Secondary/500"];
  const amountPrefix = isCredit ? "+ " : "- ";

  const formatDate = (date: Date) => {
    return format(date, "MMMM d 'at' h:mm a");
  };

  const getIcon = () => {
    switch (transaction.type) {
      case TransactionType.RIDE:
        return (
          <View style={styles.iconContainer}>
            <View style={[styles.tripIcon, styles.tripIconOuter]} />
            <View style={[styles.tripIcon, styles.tripIconInner]} />
          </View>
        );
      case TransactionType.RECHARGE:
        return (
          <View style={[styles.iconContainer, styles.walletIconBg]}>
            <Icon name="wallet2" width={20} height={20} color={Colors["Primary/600"]} />
          </View>
        );
      default:
        return (
          <View style={styles.iconContainer}>
            <Icon name="payment" width={20} height={20} color={Colors["Neutrals/500"]} />
          </View>
        );
    }
  };

  const getDescription = () => {
    if (transaction.type === TransactionType.RIDE && transaction.from && transaction.to) {
      return (
        <Animated.Text style={styles.description} numberOfLines={1}>
          <Animated.Text style={styles.locationText}>{transaction.from}</Animated.Text>
          <Animated.Text style={styles.toText}> to </Animated.Text>
          <Animated.Text style={styles.locationText}>{transaction.to}</Animated.Text>
        </Animated.Text>
      );
    }
    return <Animated.Text style={styles.description}>{transaction.description}</Animated.Text>;
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).duration(200)} style={styles.container}>
      <Row alignItems="center" gap={10}>
        {getIcon()}
        <View style={styles.detailsContainer}>
          <Animated.Text style={styles.date}>{formatDate(transaction.date)}</Animated.Text>
          {getDescription()}
        </View>
      </Row>
      <Animated.Text style={[styles.amount, { color: amountColor }]}>
        {amountPrefix}
        {formatCurrency(transaction.amount).replace("R ", "R ")}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors["white"],
    borderRadius: 20,
    padding: 20,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  walletIconBg: {
    backgroundColor: Colors["Primary/950"],
    borderRadius: 6,
  },
  tripIcon: {
    position: "absolute",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors["Primary/600"],
  },
  tripIconOuter: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
  },
  tripIconInner: {
    width: 8,
    height: 8,
    backgroundColor: Colors["Primary/600"],
    borderWidth: 0,
  },
  detailsContainer: {
    flex: 1,
    gap: 6,
  },
  date: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "rgba(0,0,0,0.5)",
  },
  description: {
    fontFamily: "BRHendrix-Medium",
    fontSize: 14,
    lineHeight: 16,
    color: Colors["Primary/950"],
  },
  locationText: {
    color: Colors["Primary/950"],
  },
  toText: {
    color: "rgba(0,0,0,0.5)",
  },
  amount: {
    fontFamily: "BRHendrix-Medium",
    fontSize: 14,
    lineHeight: 16,
  },
});
