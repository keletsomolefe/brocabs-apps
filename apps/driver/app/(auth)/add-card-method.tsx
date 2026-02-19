import { Button } from "@brocabs/ui/button";
import { Container, Fill, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert } from "react-native";
import { useAddCard } from "~/hooks/use-add-card";
import { AddCardModal, type AddCardModalRef } from "~/shared/ui/add-card-modal";

type CardInputMethod = "scan" | "manual" | null;

export default function AddCardMethodScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedMethod, setSelectedMethod] = useState<CardInputMethod>(null);
  const addCardModalRef = useRef<AddCardModalRef>(null);
  const { mutateAsync: getAddCardUrl, data: addCardUrl, isPending: isGettingUrl } = useAddCard();

  const handleNext = async () => {
    if (selectedMethod) {
      addCardModalRef.current?.open();
      try {
        const url = await getAddCardUrl();
        if (!url) {
          throw new Error("No URL returned from server");
        }
      } catch (error) {
        console.error("Failed to get add card URL", error);
        addCardModalRef.current?.close();
        Alert.alert("Error", "Failed to initialize card addition. Please try again.");
      }
    }
  };

  const handleModalDismiss = () => {
    setSelectedMethod(null);
  };

  const handleCardAddedSuccess = async () => {
    addCardModalRef.current?.close();
    await queryClient.invalidateQueries({ queryKey: ["saved-cards"] });
    router.push("/(auth)/card-added-success");
  };

  return (
    <Fill backgroundColor="Neutrals/50">
      {/* Content */}
      <Container flex={1} px={20} pt={100} pb={40} gap={30}>
        {/* Title */}
        <Container alignItems="center">
          <Bold
            fontSize={28}
            lineHeight={34}
            color="Primary/50"
            textAlign="center"
            style={{ maxWidth: 282 }}>
            How would you like to add your card?
          </Bold>
        </Container>

        {/* Method Options */}
        <Container gap={20}>
          {/* Scan Card Option */}
          <TouchableOpacity onPress={() => setSelectedMethod("scan")}>
            <Container
              backgroundColor="white"
              borderRadius={10}
              px={16}
              py={16}
              gap={8}
              borderWidth={selectedMethod === "scan" ? 1 : 0}
              borderColor={selectedMethod === "scan" ? "Primary/300" : "transparent"}>
              <Bold fontSize={16} lineHeight={16} color="Primary/50">
                Scan card
              </Bold>
              <Regular fontSize={14} lineHeight={16} color="Neutrals/400">
                Automatic card number & expiry capture
              </Regular>
            </Container>
          </TouchableOpacity>

          {/* Manual Entry Option */}
          <TouchableOpacity onPress={() => setSelectedMethod("manual")}>
            <Container
              backgroundColor="white"
              borderRadius={10}
              px={16}
              py={16}
              gap={8}
              borderWidth={selectedMethod === "manual" ? 1 : 0}
              borderColor={selectedMethod === "manual" ? "Primary/300" : "transparent"}>
              <Bold fontSize={16} lineHeight={16} color="Primary/50">
                Enter manually
              </Bold>
              <Regular fontSize={14} lineHeight={16} color="Neutrals/400">
                Type card details yourself
              </Regular>
            </Container>
          </TouchableOpacity>
        </Container>

        {/* Next Button */}
        <Container width="100%">
          <Button
            label="Next"
            onPress={handleNext}
            variant="primary"
            radius="rounded"
            disabled={!selectedMethod}
          />
        </Container>
      </Container>

      <AddCardModal
        ref={addCardModalRef}
        url={addCardUrl}
        isLoading={isGettingUrl}
        onClose={handleModalDismiss}
        onSuccess={handleCardAddedSuccess}
      />
    </Fill>
  );
}
