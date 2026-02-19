import { Button } from "@brocabs/ui/button";
import { Container, Fill } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cardsApi } from "~/api";
import {
  CongratsModal,
  LowBalanceModal,
} from "~/features/authentication/components/subscription-modals";
import { useUser } from "~/hooks/use-auth";
import { useSavedCards } from "~/hooks/use-saved-cards";
import { navigateBasedOnSession } from "~/utils/session-navigation";

export default function CardAddedSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
  const { data: cards, isLoading, isRefetching } = useSavedCards();
  const { refetch } = useUser({ enabled: false });

  // Helper to derive card details from masked number
  const getCardDetails = (maskedNumber?: string) => {
    if (!maskedNumber) return { brand: "CARD", lastDigits: "0000" };

    // Simple brand detection
    let brand = "CARD";
    if (maskedNumber.startsWith("4")) brand = "VISA";
    else if (maskedNumber.startsWith("5")) brand = "MASTERCARD";

    // Get last visible digits
    const lastDigits =
      maskedNumber.length > 4 ? maskedNumber.substring(maskedNumber.length - 4) : maskedNumber;

    return { brand, lastDigits };
  };

  const handlePayAndSubmit = async () => {
    if (!cards || cards.length === 0) {
      alert("No cards available to process payment.");
      return;
    }

    // Use the most recently added card (first in list due to DESC sort)
    const cardToCharge = cards[0];

    setIsProcessing(true);
    try {
      await cardsApi.cardControllerPayAdminFee({
        payAdminFeeDto: { cardId: cardToCharge.id },
      });
      setIsProcessing(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      setIsProcessing(false);
      console.error("Payment failed", error);

      // Check if error is insufficient balance
      if (error?.response?.data?.error === "INSUFFICIENT_FUNDS") {
        setShowInsufficientBalanceModal(true);
      } else {
        alert("Payment failed. Please try again.");
      }
    }
  };

  const handleSuccessContinue = async () => {
    setShowSuccessModal(false);
    const { data } = await refetch();
    navigateBasedOnSession(data);
  };

  const handleReplaceCard = () => {
    setShowInsufficientBalanceModal(false);
    router.back(); // Go back to add a new card
  };

  return (
    <Fill backgroundColor="Neutrals/50">
      {/* Status Bar Space */}
      <Container pt={insets.top} />

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 100,
          gap: 40,
        }}
        style={{ flex: 1 }}>
        {/* Title and Description */}
        <Container gap={4}>
          <Bold fontSize={28} lineHeight={34} color="Primary/50">
            Card added!
          </Bold>
          <Regular fontSize={18} lineHeight={24} color="Neutrals/400">
            You&apos;re all set - your card is now linked to the wallet.
          </Regular>
        </Container>

        {/* Card List */}
        {isLoading || (isRefetching && !cards) ? (
          <Container
            height={200}
            justifyContent="center"
            alignItems="center"
            backgroundColor="Neutrals/100"
            borderRadius={20}>
            <ActivityIndicator size="small" color="#000" />
            <Regular fontSize={14} color="Neutrals/500" style={{ marginTop: 10 }}>
              Retrieving cards...
            </Regular>
          </Container>
        ) : cards && cards.length > 0 ? (
          <Container gap={20}>
            {cards.map((card) => {
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
                        Card Holder Name
                      </Regular>
                      <Regular fontSize={20} lineHeight={36} color="white">
                        {card.name || "Unknown"}
                      </Regular>
                    </Container>
                    <Container gap={4} alignItems="flex-end">
                      <Regular fontSize={12} lineHeight={16} color="white">
                        Expires
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
        ) : (
          <Container>
            <Regular color="Schemes/Error">No cards found. Please add a card.</Regular>
          </Container>
        )}

        <Container mt={20}>
          <Button
            label="Pay & Submit"
            onPress={handlePayAndSubmit}
            variant="primary"
            radius="rounded"
            disabled={isLoading || !cards || cards.length === 0}
          />
        </Container>
      </ScrollView>

      {/* Processing Modal */}
      <Modal visible={isProcessing} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(10,2,26,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Container backgroundColor="white" p={24} borderRadius={20} alignItems="center" gap={16}>
            <ActivityIndicator size="large" color="#5905ff" />
            <Bold fontSize={18}>Processing Payment...</Bold>
            <Regular fontSize={14} color="Neutrals/600">
              Please wait while we verify funds.
            </Regular>
          </Container>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(10,2,26,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}>
          <CongratsModal
            planName="Plan"
            adminFee="300"
            year={new Date().getFullYear()}
            onSubmit={handleSuccessContinue}
          />
        </View>
      </Modal>

      {/* Insufficient Balance Modal */}
      <Modal visible={showInsufficientBalanceModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(10,2,26,0.6)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}>
          <LowBalanceModal onReplaceCard={handleReplaceCard} />
        </View>
      </Modal>
    </Fill>
  );
}
