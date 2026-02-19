import { QueryKeys } from "@brocabs/client";
import { getShadow } from "@brocabs/ui";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill, TouchableOpacity } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useRef } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet } from "react-native";
import { cardsApi } from "~/api";
import { CreditCard } from "~/features/wallet/components";
import { useAddCard } from "~/hooks/use-add-card";
import { useRemoveCard } from "~/hooks/use-remove-card";
import { AddCardModal, AddCardModalRef } from "~/shared/ui/add-card-modal";
import { AssetFiles } from "~/theme/assets";

const shadow = getShadow(1, "penumbra");

interface RemoveCardSheetProps {
  onConfirm: () => void;
  cardNumber?: string;
}

const RemoveCardSheet = forwardRef<BottomSheetModal, RemoveCardSheetProps>(
  ({ onConfirm, cardNumber }, ref) => {
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
                Remove Card
              </Bold>
              <Regular fontSize={18} lineHeight={24} color="Primary/50" textAlign="center">
                Are you sure you want to remove this card
                {cardNumber ? ` ending in ${cardNumber}` : ""} from your payment methods?
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
                    Cancel
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
                    Remove
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

export function MyCardsScreen() {
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
          title="Processing..."
          description="Please wait! Your action is under process"
        />
      ),
    });

    await removeCardMutation.mutateAsync(selectedCardIdRef.current);
    selectedCardIdRef.current = null;

    ModalBox.show("popup", {
      content: (
        <Dialog.Confirmation
          title="Card Removed"
          description="Card removed successfully."
          icon="double-ticks"
          buttonLabel="Done"
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
                Loading cards...
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
                No cards added yet
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
                + Add New Card
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
