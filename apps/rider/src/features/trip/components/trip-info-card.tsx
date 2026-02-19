import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Container, Divider, Row } from "@brocabs/ui/layout";
import { Medium, Regular } from "@brocabs/ui/text";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { useActiveRide } from "../hooks/use-ride";

export const TripInfoCard = () => {
  const { t } = useTranslation();
  const { data: activeRide } = useActiveRide();

  const paymentMethod = activeRide?.paymentMethodCode;
  const price = activeRide?.estimatedPrice;

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case PaymentMethodResponseDtoCodeEnum.Card:
        return "card";
      case PaymentMethodResponseDtoCodeEnum.Wallet:
        return "wallet";
      case PaymentMethodResponseDtoCodeEnum.Cash:
      default:
        return "cash-hand";
    }
  };

  const getPaymentLabel = () => {
    switch (paymentMethod) {
      case PaymentMethodResponseDtoCodeEnum.Card:
        return t("common.card");
      case PaymentMethodResponseDtoCodeEnum.Wallet:
        return t("common.wallet");
      case PaymentMethodResponseDtoCodeEnum.Cash:
      default:
        return t("common.cash");
    }
  };

  return (
    <Container backgroundColor="white" p={3} gap={15} borderRadius={30}>
      <Row alignItems="center" gap={10}>
        <Icon name={getPaymentIcon()} width={24} height={24} />
        <Regular color="Primary/50" fontSize={18}>
          {getPaymentLabel()}: R{price}
        </Regular>
      </Row>
      <Divider />
      <Container gap={5}>
        <Regular color="Primary/50" fontSize={18}>
          {t("common.driverInstructions")}
        </Regular>
        <Medium color="Neutrals/400" fontSize={14}>
          {t("common.stopsOnTheWay")}
        </Medium>
      </Container>
    </Container>
  );
};
