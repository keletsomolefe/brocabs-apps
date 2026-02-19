import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";

import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Container, Row } from "@brocabs/ui/layout";
import { SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePaymentMethods } from "~/hooks/use-payment-methods";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

const PAYMENT_ICONS: Partial<
  Record<PaymentMethodResponseDtoCodeEnum, "wallet" | "card" | "cash-hand-white">
> = {
  [PaymentMethodResponseDtoCodeEnum.Wallet]: "wallet",
  [PaymentMethodResponseDtoCodeEnum.Card]: "card",
  [PaymentMethodResponseDtoCodeEnum.Cash]: "cash-hand-white",
};

interface PaymentMethodSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  selectedMethod: PaymentMethodResponseDtoCodeEnum;
  onMethodSelect: (method: PaymentMethodResponseDtoCodeEnum) => void;
}

interface PaymentOptionProps {
  icon: "wallet" | "card" | "cash-hand-white";
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

function RadioButton({ isSelected }: { isSelected: boolean }) {
  return (
    <Container
      width={17}
      height={17}
      borderRadius={8.5}
      borderWidth={2.72}
      borderColor={isSelected ? Colors["Primary/400"] : "rgba(255, 255, 255, 1)"}
      justifyContent="center"
      alignItems="center">
      {isSelected && (
        <Container width={6.12} height={6.12} borderRadius={3.06} backgroundColor="Primary/400" />
      )}
    </Container>
  );
}

function PaymentOption({ icon, label, isSelected, onPress }: PaymentOptionProps) {
  return (
    <Pressable onPress={onPress}>
      <Container
        height={74}
        borderRadius={20}
        borderWidth={1}
        borderColor="rgba(85, 0, 255, 0.8)"
        overflow="hidden">
        <BlurView
          intensity={22.5}
          tint="light"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: isSelected ? Colors["Primary/950"] : "rgba(255, 255, 255, 0.1)" },
          ]}
        />
        <Row flex={1} alignItems="center" gap={12} px={22}>
          <RadioButton isSelected={isSelected} />
          <Container
            width={44}
            height={44}
            borderRadius={10}
            backgroundColor={isSelected ? "Primary/400" : "white-100"}
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            style={{ borderTopWidth: 1, borderColor: "rgba(255, 255, 255, 0.22)" }}>
            <BlurView intensity={22.5} tint="light" style={StyleSheet.absoluteFill} />
            <Icon name={icon} width={24} height={24} color={Colors.white} />
          </Container>
          <SemiBold fontSize={18} color={isSelected ? "Primary/50" : "white-800"}>
            {label}
          </SemiBold>
        </Row>
      </Container>
    </Pressable>
  );
}

export function PaymentMethodSheet({
  bottomSheetRef,
  selectedMethod,
  onMethodSelect,
}: PaymentMethodSheetProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: paymentMethods } = usePaymentMethods();

  const handleMethodSelect = useCallback(
    (method: PaymentMethodResponseDtoCodeEnum) => {
      onMethodSelect(method);
      bottomSheetRef.current?.dismiss();
    },
    [onMethodSelect, bottomSheetRef]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing
      enablePanDownToClose
      enableOverDrag={false}
      handleComponent={() => null}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "transparent" }}
      handleIndicatorStyle={{ backgroundColor: "transparent" }}>
      <BottomSheetView>
        <LinearGradient
          colors={[Colors["Primary/600"], Colors["Primary/400"]]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.gradientContainer, { paddingBottom: insets.bottom + 20 }]}>
          <SemiBold
            fontSize={24}
            lineHeight={32}
            color="Primary/950"
            style={{ textAlign: "center" }}>
            {t("common.choosePaymentMethod")}
          </SemiBold>

          {paymentMethods?.data?.map((method) => (
            <PaymentOption
              key={method.code}
              icon={PAYMENT_ICONS[method.code] || "card"}
              label={method.displayName}
              isSelected={selectedMethod === method.code}
              onPress={() => handleMethodSelect(method.code)}
            />
          ))}
        </LinearGradient>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 20,
    shadowColor: "rgba(255, 255, 255, 0.1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});
