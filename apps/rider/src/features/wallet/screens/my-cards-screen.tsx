import { QueryKeys } from "@brocabs/client";
import { getShadow } from "@brocabs/ui";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill, TouchableOpacity } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useRef } from "react";
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet } from "react-native";
import { cardsApi } from "~/api";
import { AddCardModal, AddCardModalRef } from "~/features/wallet/components/add-card-modal";
import { useAddCard } from "~/features/wallet/hooks/use-add-card";
import { useRemoveCard } from "~/features/wallet/hooks/use-remove-card";
import { useTranslation } from "~/i18n/LocaleContext";

enum CardType {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  DISCOVER = "discover",
  DINERS = "diners",
  JCB = "jcb",
  MAESTRO = "maestro",
  UNIONPAY = "unionpay",
  GENERIC = "generic",
  UNKNOWN = "unknown",
}

const CardTypeMap: Record<CardType, number | undefined> = {
  [CardType.VISA]: require("~/assets/images/credit-cards/Visa.png"),
  [CardType.MASTERCARD]: require("~/assets/images/credit-cards/Mastercard.png"),
  [CardType.AMEX]: require("~/assets/images/credit-cards/AMEX.png"),
  [CardType.DISCOVER]: require("~/assets/images/credit-cards/Discover.png"),
  [CardType.DINERS]: require("~/assets/images/credit-cards/DinersClub.png"),
  [CardType.JCB]: require("~/assets/images/credit-cards/JCB.png"),
  [CardType.MAESTRO]: require("~/assets/images/credit-cards/Maestro.png"),
  [CardType.UNIONPAY]: require("~/assets/images/credit-cards/UnionPay.png"),
  [CardType.GENERIC]: require("~/assets/images/credit-cards/Visa.png"), // Fallback to Visa icon
  [CardType.UNKNOWN]: undefined,
};

// Detect card type from card number (first digits)
const detectCardType = (maskedNumber?: string): CardType => {
  if (!maskedNumber) return CardType.GENERIC;

  // Extract only digits from the masked number (remove asterisks, spaces, etc.)
  const digitsOnly = maskedNumber.replace(/\D/g, "");

  if (digitsOnly.length === 0) return CardType.GENERIC;

  const firstDigit = digitsOnly.charAt(0);
  const firstTwo = digitsOnly.substring(0, 2);
  const firstFour = digitsOnly.substring(0, 4);
  const firstSix = digitsOnly.substring(0, 6);

  // Visa: starts with 4
  if (firstDigit === "4") return CardType.VISA;
  // Mastercard: starts with 51-55 or 2221-2720
  if (firstTwo >= "51" && firstTwo <= "55") return CardType.MASTERCARD;
  if (firstFour >= "2221" && firstFour <= "2720") return CardType.MASTERCARD;
  // Amex: starts with 34 or 37
  if (firstTwo === "34" || firstTwo === "37") return CardType.AMEX;
  // Discover: starts with 6011, 622126-622925, 644-649, or 65
  if (firstFour === "6011") return CardType.DISCOVER;
  if (firstTwo === "65") return CardType.DISCOVER;
  if (firstSix >= "622126" && firstSix <= "622925") return CardType.DISCOVER;
  if (firstTwo >= "64" && firstTwo <= "65") return CardType.DISCOVER;
  // Diners: starts with 36, 38, or 300-305
  if (firstTwo === "36" || firstTwo === "38") return CardType.DINERS;
  if (firstFour >= "300" && firstFour <= "305") return CardType.DINERS;
  // JCB: starts with 3528-3589
  if (firstFour >= "3528" && firstFour <= "3589") return CardType.JCB;
  // Maestro: starts with 5018, 5020, 5038, 5893, 6304, 6759, 6761-6763
  if (["5018", "5020", "5038", "5893", "6304", "6759"].includes(firstFour)) return CardType.MAESTRO;
  if (firstFour >= "6761" && firstFour <= "6763") return CardType.MAESTRO;
  // UnionPay: starts with 62
  if (firstTwo === "62") return CardType.UNIONPAY;

  return CardType.GENERIC;
};

// Format card number with spacing (every 4 digits)
// Standard format: **** **** **** 1234 (only last 4 digits visible)
const formatCardNumber = (maskedNumber: string): string => {
  // Extract only digits from the masked number
  const digitsOnly = maskedNumber.replace(/\D/g, "");

  // Get last 4 digits
  const lastFour = digitsOnly.slice(-4);

  // If we don't have at least 4 digits, return as is with spacing
  if (digitsOnly.length < 4) {
    return maskedNumber.replace(/(.{4})/g, "$1 ").trim();
  }

  // Standard 16-digit card format: **** **** **** 1234
  // For cards with last 4 digits, show: **** **** **** XXXX
  return `**** **** **** ${lastFour}`;
};

interface CreditCardProps {
  maskedNumber: string;
  holderName: string;
  expiry: string;
  onRemove?: () => void;
}

const shadow = getShadow(1, "penumbra");

interface RemoveCardSheetProps {
  onConfirm: () => void;
  cardNumber?: string;
}

const RemoveCardSheet = forwardRef<BottomSheetModal, RemoveCardSheetProps>(
  ({ onConfirm, cardNumber }, ref) => {
    const { t } = useTranslation();
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        enableDynamicSizing={true}
        backdropComponent={Backdrop}
        handleComponent={null}
        backgroundStyle={{
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <BottomSheetView
          style={{
            paddingHorizontal: 20,
            paddingBottom: 50,
            paddingTop: 30,
          }}>
          <Container alignItems="center" gap={20}>
            <Container alignItems="center" gap={20}>
              <Container alignItems="center">
                <Image
                  source={AssetFiles.images["mascot-warning"]}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </Container>
              <Bold fontSize={22} color="Primary/50" textAlign="center">
                {t("common.removeCard")}
              </Bold>
              <Regular fontSize={18} lineHeight={24} color="Primary/50" textAlign="center">
                {cardNumber
                  ? t("wallet.removeCardConfirmWithNumber", { number: cardNumber })
                  : t("wallet.removeCardConfirm")}
              </Regular>
            </Container>

            <Container flexDirection="row" style={{ gap: 10 }} width="100%">
              <TouchableOpacity style={{ flex: 1 }} onPress={() => (ref as any).current?.dismiss()}>
                <Container
                  height={56}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="Primary/950"
                  borderRadius={20}>
                  <Regular fontSize={18} lineHeight={24} color="Primary/600">
                    {t("common.cancel")}
                  </Regular>
                </Container>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={onConfirm}>
                <Container
                  height={56}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="Danger/600"
                  borderRadius={20}>
                  <SemiBold fontSize={18} lineHeight={24} color="white">
                    {t("common.remove")}
                  </SemiBold>
                </Container>
              </TouchableOpacity>
            </Container>
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

RemoveCardSheet.displayName = "RemoveCardSheet";

const CreditCard = ({ maskedNumber, holderName, expiry, onRemove }: CreditCardProps) => {
  const { t } = useTranslation();
  const cardType = detectCardType(maskedNumber);
  const cardIconSource = CardTypeMap[cardType];

  return (
    <Container gap={10} width="100%">
      <ImageBackground
        source={require("~/assets/images/credit-card.png")}
        imageStyle={{ borderRadius: 20 }}
        style={{
          borderRadius: 20,
          padding: 20,
          height: 200,
          justifyContent: "space-between",
          overflow: "hidden",
        }}>
        <Container flexDirection="row" justifyContent="space-between" alignItems="flex-start">
          {/* Chip placeholder */}
          <Container
            width={40}
            height={30}
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            borderRadius={4}
          />
          {cardIconSource && (
            <Image source={cardIconSource} style={{ width: 60, height: 40 }} resizeMode="contain" />
          )}
        </Container>

        <Container gap={20}>
          <Medium color="white" fontSize={24} style={{ letterSpacing: 2 }}>
            {formatCardNumber(maskedNumber)}
          </Medium>

          <Container flexDirection="row" justifyContent="space-between">
            <Container>
              <Regular color="white" fontSize={12} style={{ opacity: 0.8 }}>
                {t("common.cardHolderName")}
              </Regular>
              <Regular color="white" fontSize={16}>
                {holderName}
              </Regular>
            </Container>
            <Container>
              <Regular color="white" fontSize={12} style={{ opacity: 0.8 }}>
                {t("common.expDate")}
              </Regular>
              <Regular color="white" fontSize={16}>
                {expiry}
              </Regular>
            </Container>
          </Container>
        </Container>
      </ImageBackground>

      <TouchableOpacity onPress={onRemove}>
        <Container
          backgroundColor="Primary/950"
          borderWidth={1}
          borderColor="Primary/400"
          borderRadius={20}
          height={48}
          alignItems="center"
          justifyContent="center">
          <Medium color="Primary/600" fontSize={16}>
            {t("common.removeCard")}
          </Medium>
        </Container>
      </TouchableOpacity>
    </Container>
  );
};

export function MyCardsScreen() {
  const { t } = useTranslation();
  const addCardMutation = useAddCard();
  const removeCardMutation = useRemoveCard();
  const addCardModalRef = useRef<AddCardModalRef>(null);
  const removeCardSheetRef = useRef<BottomSheetModal>(null);
  const selectedCardIdRef = useRef<string | null>(null);
  const savedCardsQuery = useQuery({
    queryKey: [QueryKeys.SAVED_CARDS],
    queryFn: async () => {
      return cardsApi.cardControllerGetMySavedCards();
    },
  });

  const handleAddCard = async () => {
    addCardModalRef.current?.open();
    try {
      await addCardMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to get add card URL", error);
      addCardModalRef.current?.close();
    }
  };

  const handleRemoveCardClick = (cardId: string) => {
    selectedCardIdRef.current = cardId;
    removeCardSheetRef.current?.present();
  };

  const handleConfirmRemove = async () => {
    if (!selectedCardIdRef.current) return;

    removeCardSheetRef.current?.dismiss();

    ModalBox.show("popup", {
      content: (
        <Dialog.Loader
          source={Lottie.loader}
          title={t("common.processing")}
          description={t("common.pleaseWait")}
        />
      ),
    });

    await removeCardMutation.mutateAsync(selectedCardIdRef.current);
    selectedCardIdRef.current = null;

    ModalBox.show("popup", {
      content: (
        <Dialog.Confirmation
          title={t("wallet.cardRemoved")}
          description={t("wallet.cardRemovedSuccess")}
          icon="double-ticks"
          buttonLabel={t("common.done")}
          onPress={() => {
            ModalBox.hide();
          }}
        />
      ),
    });
  };

  const cards = savedCardsQuery.data || [];
  const isLoading = savedCardsQuery.isLoading;

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Container px={20} pt={20} gap={15}>
          {isLoading ? (
            <Container
              height={200}
              justifyContent="center"
              alignItems="center"
              backgroundColor="white"
              borderRadius={20}>
              <ActivityIndicator size="small" color={Colors["Primary/600"]} />
              <Regular fontSize={14} color="Neutrals/400" style={{ marginTop: 10 }}>
                {t("common.loadingCards")}
              </Regular>
            </Container>
          ) : cards.length > 0 ? (
            cards.map((card) => (
              <Container
                key={card.id}
                backgroundColor="white"
                borderRadius={20}
                style={shadow}
                p={2}
                alignItems="center">
                <CreditCard
                  maskedNumber={card.maskedNumber}
                  holderName={card.name}
                  expiry={`${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`}
                  onRemove={() => handleRemoveCardClick(card.id)}
                />
              </Container>
            ))
          ) : (
            <Container
              backgroundColor="white"
              borderRadius={20}
              p={40}
              alignItems="center"
              gap={16}>
              <Regular fontSize={16} color="Neutrals/400" textAlign="center">
                {t("wallet.noCardsYet")}
              </Regular>
            </Container>
          )}

          <TouchableOpacity onPress={handleAddCard}>
            <Container
              backgroundColor="Primary/600"
              borderRadius={20}
              height={56}
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="rgba(85,0,255,0.4)">
              <SemiBold color="white" fontSize={18}>
                {t("common.addNewCard")}
              </SemiBold>
            </Container>
          </TouchableOpacity>
        </Container>
      </ScrollView>
      <AddCardModal
        ref={addCardModalRef}
        url={addCardMutation.data}
        isLoading={addCardMutation.isPending}
      />
      <RemoveCardSheet
        ref={removeCardSheetRef}
        onConfirm={handleConfirmRemove}
        cardNumber={
          selectedCardIdRef.current
            ? (() => {
                const card = savedCardsQuery.data?.find((c) => c.id === selectedCardIdRef.current);
                if (!card?.maskedNumber) return undefined;
                // Extract last 4 digits from masked number
                const digitsOnly = card.maskedNumber.replace(/\D/g, "");
                return digitsOnly.slice(-4);
              })()
            : undefined
        }
      />
    </Fill>
  );
}

const styles = StyleSheet.create({
  mascotImage: {
    width: 120,
    height: 120,
  },
});
