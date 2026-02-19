import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Container, Fill, Row } from "@brocabs/ui/layout";
import { Normal as Text } from "@brocabs/ui/text";
import { useShadow } from "@brocabs/ui/utils/shadow";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

interface TripActionBarProps {
  paymentSheetRef: React.RefObject<BottomSheetModal | null>;
  selectedPaymentMethod: PaymentMethodResponseDtoCodeEnum;
  onRequestPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function TripActionBar({
  paymentSheetRef,
  selectedPaymentMethod,
  onRequestPress,
  disabled,
  loading,
}: TripActionBarProps) {
  const { t } = useTranslation();
  const shadowStyle = useShadow(3, "penumbra");
  const insets = useSafeAreaInsets();

  const getPaymentIcon = (): "wallet" | "card" | "cash-hand" => {
    switch (selectedPaymentMethod) {
      case PaymentMethodResponseDtoCodeEnum.Wallet:
        return "wallet";
      case PaymentMethodResponseDtoCodeEnum.Card:
        return "card";
      case PaymentMethodResponseDtoCodeEnum.Cash:
      default:
        return "cash-hand";
    }
  };

  return (
    <Row
      pt={3}
      pb={insets.bottom}
      gap={5}
      px={20}
      backgroundColor="white"
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      style={shadowStyle}>
      <Pressable
        disabled={disabled}
        onPress={() => paymentSheetRef.current?.present()}
        style={({ pressed }) => ({
          opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
        })}>
        <Container
          width={56}
          height={56}
          borderRadius={10}
          backgroundColor="Primary/950"
          justifyContent="center"
          alignItems="center">
          <Icon
            style={{ color: Colors["Primary/300"] }}
            name={getPaymentIcon()}
            width={30}
            height={30}
          />
        </Container>
      </Pressable>
      <Fill>
        <Pressable
          onPress={onRequestPress}
          disabled={disabled}
          style={({ pressed }) => ({
            flex: 1,
            height: 56,
            backgroundColor: disabled ? Colors["Primary/900"] : Colors["Primary/600"],
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            opacity: pressed ? 0.9 : 1,
          })}>
          {!disabled && (
            <View
              style={{
                position: "absolute",
                top: -88,
                left: -125,
                width: 128,
                height: 128,
                transform: [{ rotate: "45deg" }],
              }}>
              <LinearGradient
                colors={["rgb(135, 129, 255)", "rgba(135, 129, 255, 0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 10, height: 171 }}
              />
            </View>
          )}
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text medium color="white" style={{ fontSize: 20, lineHeight: 36 }}>
              {t("common.request")}
            </Text>
          )}
        </Pressable>
      </Fill>
      <Container
        width={56}
        height={56}
        borderRadius={10}
        backgroundColor="Primary/950"
        justifyContent="center"
        alignItems="center">
        <Icon name="filter" width={24} height={24} color={Colors.black} />
      </Container>
    </Row>
  );
}
