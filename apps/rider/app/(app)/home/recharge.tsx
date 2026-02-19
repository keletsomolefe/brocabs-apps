import { processApiError } from "@brocabs/client";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Column, Container, Fill, Row, ScrollView, TouchableOpacity } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import { maskCardNumber, useWalletFlow } from "~/features/wallet";
import { CheckoutWebView } from "~/features/wallet/components";
import { useAddCard } from "~/features/wallet/hooks/use-add-card";
import { useSavedCards } from "~/features/wallet/hooks/use-saved-cards";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

export default function RechargeWalletScreen() {
  const { t } = useTranslation();
  const {
    createCheckoutSession,
    isRecharging,
    recharge,
    handleCheckoutSuccess,
    handleCheckoutCancel,
    setRechargeError,
    rechargeSuccess,
    rechargeAmount,
    resetRecharge,
  } = useWalletFlow();
  const savedCardsQuery = useSavedCards();
  const addCardMutation = useAddCard();

  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [checkoutLink, setCheckoutLink] = useState<string | undefined>(undefined);

  // Bottom Sheet Logic
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);

  useEffect(() => {
    if (checkoutLink) {
      ModalBox.hide();
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [bottomSheetRef, checkoutLink]);

  // Hide modal when there's an error
  useEffect(() => {
    if (recharge.errorMessage) {
      ModalBox.hide();
    }
  }, [recharge.errorMessage]);

  useEffect(() => {
    if (rechargeSuccess) {
      ModalBox.show("popup", {
        content: (
          <Container
            backgroundColor="white"
            borderRadius={30}
            px={20}
            py={30}
            gap={20}
            alignItems="center"
            mx={20}
            style={{
              shadowColor: "#3A0CA3",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.14,
              shadowRadius: 2,
              elevation: 2,
            }}>
            <Container alignItems="center" justifyContent="center">
              <Icon name="double-ticks" width={91} height={91} color={Colors["Random/Success"]} />
            </Container>

            <Column gap={2} alignItems="center">
              <SemiBold fontSize={24} color="Primary/50" style={{ textAlign: "center" }}>
                {t("common.successTitle")}
              </SemiBold>
              <Regular fontSize={14} color="Primary/50" style={{ textAlign: "center" }}>
                {t("common.successDesc")}
              </Regular>
            </Column>

            <Row gap={10} width="100%">
              <TouchableOpacity
                flex={1}
                height={56}
                backgroundColor={Colors["Primary/950"]}
                borderRadius={20}
                alignItems="center"
                justifyContent="center"
                onPress={() => {
                  ModalBox.hide();
                  resetRecharge();
                  router.back();
                }}>
                <Regular fontSize={18} color={"Primary/400"}>
                  {t("common.viewDetails")}
                </Regular>
              </TouchableOpacity>

              <TouchableOpacity
                flex={1}
                height={56}
                backgroundColor={Colors["Primary/600"]}
                borderRadius={20}
                alignItems="center"
                justifyContent="center"
                onPress={() => {
                  ModalBox.hide();
                  resetRecharge();
                  router.back();
                }}>
                <SemiBold fontSize={18} color="white">
                  {t("common.close")}
                </SemiBold>
              </TouchableOpacity>
            </Row>
          </Container>
        ),
      });
    }
  }, [rechargeSuccess, rechargeAmount, resetRecharge, t]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        handleCheckoutCancel();
      }
    },
    [handleCheckoutCancel]
  );

  const addNewCardPayment = async () => {
    try {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title={t("common.processing")}
            description={t("common.pleaseWait")}
          />
        ),
      });

      setCheckoutLink(await addCardMutation.mutateAsync());
    } catch (error) {
      const err = await processApiError(error);
      console.error("Checkout session creation failed:", err);
      // Ensure error is displayed to the user
      setRechargeError(typeof err === "string" ? err : t("common.error"));
    } finally {
      ModalBox.hide();
    }
  };

  const rechargeWallet = async () => {
    if (!amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    // Validate minimum amount
    if (numAmount < 50) {
      setRechargeError(t("common.minimumAmount"));
      return;
    }

    try {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title={t("common.processing")}
            description={t("common.pleaseWait")}
          />
        ),
      });

      // Generate a checkout deposit link via the backend
      // The checkout page handles card payment (saved or new)
      await createCheckoutSession(numAmount);
    } catch (error) {
      console.error("Recharge failed:", error);
      ModalBox.hide();
    }
  };

  // Show WebView when checkout URL is available from the store
  useEffect(() => {
    if (recharge.checkoutUrl) {
      setCheckoutLink(recharge.checkoutUrl);
    }
  }, [recharge.checkoutUrl]);

  return (
    <Fill backgroundColor="Neutrals/50">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Column gap={30} pt={20} px={20}>
          {recharge.errorMessage && (
            <Container
              backgroundColor="Secondary/50"
              borderRadius={12}
              p={12}
              width="100%"
              borderWidth={1}
              borderColor="Secondary/200">
              <Regular fontSize={14} color="Secondary/600" style={{ textAlign: "center" }}>
                {recharge.errorMessage}
              </Regular>
            </Container>
          )}

          <Column alignItems="center" gap={26}>
            <SemiBold fontSize={20} color="Primary/50" style={{ textAlign: "center", width: 318 }}>
              {t("common.howMuchToAdd")}
            </SemiBold>

            <Container
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              backgroundColor="Neutrals/100"
              borderRadius={20}
              px={22}
              height={56}
              width="100%"
              borderWidth={1}
              borderColor="Neutrals/100"
              gap={12}
              style={{
                shadowColor: "#3A0CA3",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.14,
                shadowRadius: 2,
                elevation: 2,
              }}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="00.00"
                placeholderTextColor={Colors["Primary/50"]}
                keyboardType="numeric"
                style={{
                  fontFamily: "BRHendrix-SemiBold",
                  fontSize: 18,
                  color: Colors["Primary/50"],
                  flex: 1,
                  textAlign: "left",
                }}
              />
              <Medium fontSize={14} style={{ color: "rgba(0,0,0,0.4)" }}>
                ZAR
              </Medium>
            </Container>
          </Column>

          <Column gap={16}>
            {!!savedCardsQuery.data?.length && (
              <Regular fontSize={14} style={{ color: "rgba(0,0,0,0.5)" }}>
                {t("common.selectPaymentMethod")}
              </Regular>
            )}

            {savedCardsQuery.data?.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  activeOpacity={0.8}>
                  <Container
                    backgroundColor="white"
                    borderRadius={20}
                    px={16}
                    height={74}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    borderWidth={1}
                    borderColor={isSelected ? "Primary/600" : "Neutrals/100"}
                    style={{
                      shadowColor: "#3A0CA3",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.14,
                      shadowRadius: 2,
                      elevation: 2,
                    }}>
                    <Row gap={10} alignItems="center">
                      <Container
                        width={17}
                        height={17}
                        borderRadius={8.5}
                        borderWidth={1}
                        borderColor={isSelected ? "Primary/600" : "Neutrals/300"}
                        alignItems="center"
                        justifyContent="center">
                        {isSelected && (
                          <Container
                            width={9}
                            height={9}
                            borderRadius={4.5}
                            backgroundColor="Primary/600"
                          />
                        )}
                      </Container>

                      <Column gap={4}>
                        <Medium fontSize={14} style={{ color: "#0A021A" }}>
                          {method.name}
                        </Medium>
                        <Regular fontSize={12} style={{ color: "#0A021A" }}>
                          {maskCardNumber(method.maskedNumber)}
                        </Regular>
                      </Column>
                    </Row>

                    <Medium
                      fontSize={14}
                      style={{ color: isSelected ? "#0A021A" : "rgba(0,0,0,0.5)" }}>
                      {"VISA"}
                    </Medium>
                  </Container>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity onPress={addNewCardPayment}>
              <Regular fontSize={14} color="Primary/600">
                {t("common.addPaymentMethod")}
              </Regular>
            </TouchableOpacity>
          </Column>

          <TouchableOpacity
            onPress={rechargeWallet}
            backgroundColor={amount && parseFloat(amount) >= 50 ? "Primary/600" : "Neutrals/300"}
            borderRadius={20}
            height={56}
            alignItems="center"
            justifyContent="center"
            disabled={isRecharging || !amount || parseFloat(amount) < 50}>
            <SemiBold fontSize={18} color="white">
              {t("common.recharge")}
            </SemiBold>
          </TouchableOpacity>
        </Column>
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}>
        <BottomSheetView style={{ flex: 1 }}>
          {checkoutLink && (
            <CheckoutWebView
              url={checkoutLink}
              onSuccess={handleCheckoutSuccess}
              onCancel={() => {
                bottomSheetRef.current?.dismiss();
                handleCheckoutCancel();
              }}
              onError={(err) => setRechargeError(err)}
            />
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </Fill>
  );
}
