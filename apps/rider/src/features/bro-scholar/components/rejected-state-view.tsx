import { BroScholarApplicationResponseDto } from "@brocabs/client";
import { Button } from "@brocabs/ui/button";
import { Column, Container, Fill, Image } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";

interface RejectedStateViewProps {
  application: BroScholarApplicationResponseDto;
}

export function RejectedStateView({ application }: RejectedStateViewProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  const handleCorrectInfo = () => {
    router.push("/bro-scholar/create-application");
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Column
        flex={1}
        paddingHorizontal={20}
        paddingBottom={20 + bottom}
        justifyContent="center"
        alignItems="center"
        gap={20}>
        {/* Illustration */}
        <Container width={300} height={200} justifyContent="center" alignItems="center">
          <Image
            source={require("~/assets/images/car-big-bro-scholar-white.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
          />
        </Container>

        {/* Title */}
        <Bold fontSize={24} center color="Primary/50" lineHeight={36}>
          {t("common.applicationNotApproved")}
        </Bold>

        {/* Reason */}
        <Column width="100%" gap={8} alignItems="flex-start">
          <Bold fontSize={14} color="Primary/50">
            {t("common.reason")}
          </Bold>
          <Container>
            {application.rejectionReason ? (
              <Regular fontSize={14} color="Primary/50" lineHeight={24}>
                {application.rejectionReason}
              </Regular>
            ) : (
              <Column gap={4}>
                <Regular fontSize={14} color="Primary/50" lineHeight={24}>
                  {t("common.faceImageBlurry")}
                </Regular>
                <Regular fontSize={14} color="Primary/50" lineHeight={24}>
                  {t("common.licenseExpired")}
                </Regular>
              </Column>
            )}
          </Container>
        </Column>

        {/* CTA Button */}
        <Container width="100%" mt={20}>
          <Button
            label={t("common.correctInfoLabel")}
            variant="primary"
            radius="rounded"
            size="md"
            onPress={handleCorrectInfo}
          />
        </Container>
      </Column>
    </Fill>
  );
}
