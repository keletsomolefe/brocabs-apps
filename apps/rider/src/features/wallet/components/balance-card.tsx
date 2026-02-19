import { Colors } from "@brocabs/ui/theme/colors";
import { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { Column, Row } from "@brocabs/ui/layout";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

import { WALLET_TEXT } from "../constants";
import { formatCurrency } from "../types";

interface BalanceCardProps {
  balance: number;
  onRecharge: () => void;
  isLoading?: boolean;
}

/**
 * BalanceCard Component
 *
 * Displays wallet balance with option to hide and recharge button.
 * Based on Figma wallet dashboard design.
 */
export function BalanceCard({ balance, onRecharge, isLoading }: BalanceCardProps) {
  const { t } = useTranslation();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const displayBalance = isBalanceHidden ? "R ••••••" : formatCurrency(balance);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Column alignItems="center" gap={10}>
        {/* Available Balance Label */}
        <Animated.Text style={styles.label}>{WALLET_TEXT.dashboard.availableBalance}</Animated.Text>

        {/* Balance Amount with Toggle */}
        <Row alignItems="center" gap={10} pl={32}>
          {isLoading ? (
            <Animated.Text style={styles.balance}>{t("common.loading")}...</Animated.Text>
          ) : (
            <Animated.Text entering={FadeInDown.duration(200)} style={styles.balance}>
              {displayBalance}
            </Animated.Text>
          )}
          <TouchableOpacity onPress={toggleBalanceVisibility} hitSlop={10}>
            <Icon
              name={isBalanceHidden ? "eye" : "eye"}
              width={24}
              height={24}
              color={Colors["Neutrals/400"]}
            />
          </TouchableOpacity>
        </Row>
      </Column>

      {/* Recharge Button */}
      <TouchableOpacity onPress={onRecharge} style={styles.rechargeButton}>
        <Row alignItems="center" justifyContent="center" gap={8}>
          <Animated.Text style={styles.plusIcon}>+</Animated.Text>
          <Animated.Text style={styles.rechargeText}>
            {WALLET_TEXT.dashboard.rechargeButton.replace("+ ", "")}
          </Animated.Text>
        </Row>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["white"],
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
    alignItems: "center",
  },
  label: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 14,
    lineHeight: 24,
    color: Colors["Primary/950"],
    opacity: 0.6,
  },
  balance: {
    fontFamily: "BRHendrix-Bold",
    fontSize: 32,
    lineHeight: 40,
    color: Colors["Primary/950"],
  },
  rechargeButton: {
    borderWidth: 1,
    borderColor: Colors["Primary/600"],
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: 214,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 28,
    lineHeight: 37,
    color: Colors["Primary/600"],
  },
  rechargeText: {
    fontFamily: "BRHendrix-Medium",
    fontSize: 18,
    lineHeight: 16,
    color: Colors["Primary/600"],
  },
});
