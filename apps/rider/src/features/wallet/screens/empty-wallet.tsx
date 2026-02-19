import { Colors } from "@brocabs/ui/theme/colors";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Column, Fill } from "@brocabs/ui/layout";

import { useTranslation } from "~/i18n/LocaleContext";
import { AddCardModal, AddCardModalRef } from "../components/add-card-modal";
import { useAddCard } from "../hooks/use-add-card";

/**
 * EmptyWalletScreen
 *
 * Shown when user has no wallet balance and no cards.
 * Prompts user to fund their wallet (which will also allow saving a card).
 *
 * Layout:
 * - Centered wallet illustration
 * - Title + Description
 * - Fund Wallet button (primary)
 * - Help text footer
 */
export function EmptyWalletScreen() {
  const { t } = useTranslation();
  const addCardMutation = useAddCard();
  const { bottom } = useSafeAreaInsets();
  const addCardModalRef = useRef<AddCardModalRef>(null);
  const [addCardUrl, setAddCardUrl] = useState<string | null>(null);

  const handleAddCard = async () => {
    addCardModalRef.current?.open();
    try {
      const url = await addCardMutation.mutateAsync();
      if (url) {
        setAddCardUrl(url);
      }
    } catch (error) {
      console.error("Failed to get add card URL", error);
      addCardModalRef.current?.close();
    }
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Column flex={1} paddingHorizontal={20} paddingBottom={20 + bottom}>
        {/* Main Content */}
        <Column
          flex={1}
          justifyContent="flex-start"
          paddingTop={40}
          alignItems="center"
          gap={30}
          style={styles.content}>
          {/* Wallet Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("~/assets/images/wallet.png")}
              style={styles.illustration}
              contentFit="contain"
            />
          </View>

          {/* Text Content */}
          <Column alignItems="center" gap={4}>
            <Text style={styles.title}>{t("wallet.addCardTitle")}</Text>
            <Text style={styles.description}>{t("wallet.addCardDesc")}</Text>
          </Column>

          {/* CTA Button */}
          <View style={styles.buttonWrapper}>
            <Button label={t("wallet.addCard")} variant="primary" onPress={handleAddCard} />
          </View>
        </Column>

        {/* Footer Help Text */}
        <Text style={styles.helpText}>
          <Text style={styles.helpLink}>{t("common.needHelp")}</Text>
          {t("common.contactSupportDesc")}
          <Text style={styles.helpLink}>{t("common.help")}</Text>
        </Text>
      </Column>
      <AddCardModal ref={addCardModalRef} url={addCardUrl} isLoading={addCardMutation.isPending} />
    </Fill>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },
  illustrationContainer: {
    width: 175,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: "BRHendrix-Bold",
    fontSize: 20,
    lineHeight: 40,
    color: Colors["Primary/50"],
    textAlign: "center",
  },
  description: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 18,
    lineHeight: 24,
    color: Colors["Neutrals/400"],
    textAlign: "center",
  },
  buttonWrapper: {
    width: "100%",
  },
  helpText: {
    fontFamily: "BRHendrix-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: Colors["Primary/50"],
    textAlign: "center",
  },
  helpLink: {
    color: Colors["Primary/600"],
    textDecorationLine: "underline",
  },
});
