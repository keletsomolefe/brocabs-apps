import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Container, Fill, Image } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { useUser } from "~/hooks/use-auth";
import { AssetFiles } from "~/theme/assets";
import { useLocale } from "~/i18n/LocaleContext";

export default function ApplicationRejectedScreen() {
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const { t } = useLocale();

  const handleCorrectInfo = () => {
    // Navigate back to document upload
    router.replace("/(auth)/driver-documents");
  };

  // Extract rejection reasons from state data
  const getRejectionReasons = (): string[] => {
    const stateData = user?.state?.data as any;

    if (stateData?.rejectionReasons && Array.isArray(stateData.rejectionReasons)) {
      return stateData.rejectionReasons.filter((reason: any) => reason);
    }

    // Fallback to parsing from message if no structured data
    if (user?.state?.message?.includes("rejected:")) {
      const reasonText = user.state.message.split("rejected:")[1]?.trim();
      if (reasonText) {
        return reasonText
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r);
      }
    }

    return [t("approval.genericRejection")];
  };

  return (
    <Fill backgroundColor="white">
      <Container pt={insets.top} />
      <Container flex={1} px={20} justifyContent="center" alignItems="center" gap={20}>
        <Image
          source={AssetFiles.images["rejected-mascot"]}
          contentFit="contain"
          width={344}
          height={344}
        />

        <Container gap={2} alignItems="flex-start" width="100%">
          <Bold fontSize={24} center color="Primary/50" width="100%">
            {t("approval.notApprovedTitle")}
          </Bold>
          <Container gap={2} width="100%">
            <Bold fontSize={14} color="Primary/50">
              {t("approval.reason")}
            </Bold>
            <Container pl={20}>
              {getRejectionReasons().map((reason, index) => (
                <Container key={index} flexDirection="row" gap={8} mb={4}>
                  <Regular fontSize={14} color="Primary/50">
                    •
                  </Regular>
                  <Regular fontSize={14} color="Primary/50" flex={1} lineHeight={24}>
                    {reason}
                  </Regular>
                </Container>
              ))}
            </Container>
          </Container>
        </Container>

        <Button
          variant="primary"
          label={t("approval.correctInfo")}
          onPress={handleCorrectInfo}
          radius="rounded"
        />
      </Container>
    </Fill>
  );
}
