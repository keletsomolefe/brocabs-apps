import { Card, Container, Fill } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Icon } from "~/shared/ui/icons";

interface SupportItemProps {
  label: string;
  onPress?: () => void;
}

const SupportItem = ({ label, onPress }: SupportItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
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
        <Icon name="next-ltr" width={16} height={16} color={Colors.black} />
      </Card>
    </TouchableOpacity>
  );
};

export default function SupportScreen() {
  const router = useRouter();

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={20} gap={14}>
        <SupportItem label="FAQs" onPress={() => router.push("/profile-settings/faqs")} />
        <SupportItem
          label="Contact Support"
          onPress={() => router.push("/profile-settings/contact-support")}
        />
        <SupportItem
          label="Privacy Policies"
          onPress={() => router.push("/profile-settings/privacy-policies")}
        />
      </Container>
    </Fill>
  );
}
