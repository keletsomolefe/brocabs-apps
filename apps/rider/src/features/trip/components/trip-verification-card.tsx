import { Medium, SemiBold } from "@brocabs/ui/text";
import { Container, Row } from "@brocabs/ui/layout";
import { useTranslation } from "~/i18n/LocaleContext";

export const TripVerificationCard = () => {
  const { t } = useTranslation();

  return (
    <Container
      backgroundColor="white"
      p={3}
      gap={15}
      borderBottomLeftRadius={30}
      borderBottomRightRadius={30}>
      <Container gap={5}>
        <SemiBold color="Primary/50" fontSize={16}>
          {t("common.rideOtp")}
        </SemiBold>
        <Medium color="Neutrals/400" fontSize={14}>
          {t("common.otpInstruction")}
        </Medium>
      </Container>
      <VerificationCode otp={5678} />
    </Container>
  );
};

function VerificationCode({ otp }: { otp: number }) {
  const otpArray = otp.toString().split("");

  return (
    <Row gap={10} alignItems="center">
      {otpArray.map((digit, index) => (
        <Container
          key={index}
          flex={1}
          height={56}
          backgroundColor="Primary/950"
          borderRadius={10}
          justifyContent="center"
          alignItems="center">
          <Medium color="Primary/600" fontSize={18}>
            {digit}
          </Medium>
        </Container>
      ))}
    </Row>
  );
}
