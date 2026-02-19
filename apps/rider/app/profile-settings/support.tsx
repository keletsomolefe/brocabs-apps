import { Container, Fill, PressableScale } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

interface SupportItemProps {
  label: string;
  onPress?: () => void;
}

const SupportItem = ({ label, onPress }: SupportItemProps) => {
  return (
    <PressableScale onPress={onPress}>
      <Container
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="white"
        borderRadius={20}
        px={20}
        py={16}>
        <Regular fontSize={14} lineHeight={24} color="Primary/50">
          {label}
        </Regular>
        <Icon name="next-ltr" width={16} height={16} color={Colors["Primary/600"]} />
      </Container>
    </PressableScale>
  );
};

export default function SupportScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={20} gap={14}>
        <SupportItem label={t("profile.faqs")} onPress={() => router.push("/profile-settings/faqs")} />
        <SupportItem
          label={t("common.helpSupport")}
          onPress={() => router.push("/profile-settings/contact-support")}
        />
        <SupportItem
          label={t("common.privacyPolicies")}
          onPress={() => router.push("/profile-settings/privacy-policies")}
        />
      </Container>
    </Fill>
  );
}
