import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Container, Fill, Image, Row } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { useUser } from "~/hooks/use-auth";
import { useSavedCards } from "~/hooks/use-saved-cards";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { AssetFiles } from "~/theme/assets";

type ApprovalStatus = "pending" | "approved" | "rejected";

export default function PendingApprovalScreen() {
  const insets = useSafeAreaInsets();
  const { data: user, refetch } = useUser();
  const { data: cards, isLoading } = useSavedCards();
  const { t } = useLocale();

  // Determine approval status from user state
  const getApprovalStatus = (): ApprovalStatus => {
    const stateData = user?.state?.data as any;

    if (stateData?.onboardingStatus === "APPROVED") return "approved";
    if (stateData?.onboardingStatus === "REJECTED") return "rejected";

    // Fallback to checking message
    const message = user?.state?.message?.toLowerCase() || "";
    if (message.includes("approved") || message.includes("welcome")) return "approved";
    if (message.includes("rejected")) return "rejected";

    return "pending";
  };

  const status = getApprovalStatus();

  // Redirect to rejection screen when rejected
  useEffect(() => {
    if (status === "rejected") {
      router.replace("/(app)/application-rejected");
    }
  }, [status]);

  const handleContactSupport = () => {
    // TODO: Implement support contact
    console.log("Contact support");
  };

  const handleClose = async () => {
    // Refetch session to check if approval status changed
    await refetch();
  };

  const handleContinueToApp = () => {
    // Navigate to main app
    router.replace("/(app)");
  };

  // Helper to derive card details from masked number
  const getCardDetails = (maskedNumber?: string) => {
    if (!maskedNumber) return { brand: "CARD", lastDigits: "0000" };

    let brand = "CARD";
    if (maskedNumber.startsWith("4")) brand = "VISA";
    else if (maskedNumber.startsWith("5")) brand = "MASTERCARD";

    const lastDigits =
      maskedNumber.length > 4 ? maskedNumber.substring(maskedNumber.length - 4) : maskedNumber;

    return { brand, lastDigits };
  };

  return (
    <Fill backgroundColor="Neutrals/50">
      {/* Status Bar Space */}
      <Container pt={insets.top} />

      {/* Content - Card Screen in Background */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 100,
          gap: 40,
        }}
        style={{ flex: 1 }}
        scrollEnabled={false}>
        {/* Title and Description */}
        <Container gap={4}>
          <Bold fontSize={28} lineHeight={34} color="Primary/50">
            {t("wallet.cardAddedExlamation")}
          </Bold>
          <Regular fontSize={18} lineHeight={24} color="Neutrals/400">
            {t("wallet.cardLinked")}
          </Regular>
        </Container>

        {/* Card List */}
        {isLoading || !cards ? (
          <Container
            height={200}
            justifyContent="center"
            alignItems="center"
            backgroundColor="Neutrals/100"
            borderRadius={20}>
            <ActivityIndicator size="small" color="#000" />
          </Container>
        ) : cards && cards.length > 0 ? (
          <Container gap={20}>
            {cards.slice(0, 1).map((card) => {
              const cardDetails = getCardDetails(card.maskedNumber);
              return (
                <Container
                  key={card.id || Math.random().toString()}
                  backgroundColor="Primary/600"
                  borderRadius={20}
                  px={20}
                  py={15}
                  height={200}
                  justifyContent="space-between"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                  }}>
                  {/* Card Brand */}
                  <Container flexDirection="row" justifyContent="flex-end">
                    <Bold fontSize={18} color="white">
                      {cardDetails.brand}
                    </Bold>
                  </Container>

                  {/* Card Number */}
                  <Bold fontSize={24} lineHeight={32} color="white">
                    **** **** **** {cardDetails.lastDigits}
                  </Bold>

                  {/* Card Holder and Expiry */}
                  <Container flexDirection="row" justifyContent="space-between">
                    <Container gap={4}>
                      <Regular fontSize={12} lineHeight={16} color="white">
                        {t("wallet.cardHolderName")}
                      </Regular>
                      <Regular fontSize={20} lineHeight={36} color="white">
                        {card.name || "Unknown"}
                      </Regular>
                    </Container>
                    <Container gap={4} alignItems="flex-end">
                      <Regular fontSize={12} lineHeight={16} color="white">
                        {t("wallet.expires")}
                      </Regular>
                      <Regular fontSize={20} lineHeight={36} color="white">
                        {card.expiryMonth}/{card.expiryYear}
                      </Regular>
                    </Container>
                  </Container>
                </Container>
              );
            })}
          </Container>
        ) : null}
      </ScrollView>

      {/* Modal Overlay */}
      <Container
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="black-400"
        justifyContent="center"
        alignItems="center"
        px={20}
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        {/* Pending State */}
        {status === "pending" && (
          <Container
            backgroundColor="white"
            borderRadius={30}
            px={20}
            py={30}
            gap={20}
            width="100%"
            maxWidth={390}
            alignItems="center"
            borderWidth={1}
            style={{
              borderColor: "rgba(85, 0, 255, 0.4)",
              shadowColor: "rgba(58, 12, 163, 0.21)",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 28.1,
              elevation: 10,
            }}>
            <Container alignItems="center" justifyContent="center" width="100%">
              <Icon name="hourglass" width={75} height={75} />
            </Container>

            <Container gap={2} alignItems="center" width="100%">
              <Bold fontSize={24} center color="Primary/50">
                {t("approval.waitingTitle")}
              </Bold>
              <Regular fontSize={14} center color="Primary/50" lineHeight={24}>
                {t("approval.waitingDesc")}
              </Regular>
            </Container>

            <Row gap={10} width="100%">
              <Container flex={1}>
                <TouchableOpacity style={styles.contactBtn} onPress={handleContactSupport}>
                  <Text style={styles.contactBtnText}>{t("approval.contactSupport")}</Text>
                </TouchableOpacity>
              </Container>
              <Container flex={1}>
                <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                  <Text style={styles.closeBtnText}>{t("subscription.close")}</Text>
                </TouchableOpacity>
              </Container>
            </Row>
          </Container>
        )}

        {/* Approved State */}
        {status === "approved" && (
          <Container
            backgroundColor="white"
            borderRadius={20}
            px={20}
            py={16}
            gap={20}
            width="100%"
            maxWidth={390}
            alignItems="center"
            style={{
              shadowColor: "rgba(58, 12, 163, 0.14)",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 5,
            }}>
            <Image
              source={AssetFiles.images["approved-mascot"]}
              contentFit="contain"
              width={220}
              height={212}
            />

            <Container gap={2} alignItems="center" width="100%">
              <Bold fontSize={24} lineHeight={32} center color="Primary/50">
                {t("approval.welcomeTitle")}
              </Bold>
              <Regular fontSize={14} lineHeight={24} center color="Primary/50">
                {t("approval.welcomeDesc")}
              </Regular>
            </Container>

            <Button
              variant="primary"
              label={t("subscription.continueToApp")}
              onPress={handleContinueToApp}
              radius="rounded"
            />
          </Container>
        )}
      </Container>
    </Fill>
  );
}

const styles = StyleSheet.create({
  contactBtn: {
    height: 56,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#5905ff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  contactBtnText: {
    color: "#5905ff",
    fontSize: 15,
    fontFamily: "BRHendrix-Regular",
    textAlign: "center",
  },
  closeBtn: {
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5905ff",
  },
  closeBtnText: {
    color: "white",
    fontSize: 15,
    fontFamily: "BRHendrix-SemiBold",
    textAlign: "center",
  },
});
