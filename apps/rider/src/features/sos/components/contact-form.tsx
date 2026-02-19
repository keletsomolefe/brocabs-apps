import { Button } from "@brocabs/ui/button";
import { Container, Fill } from "@brocabs/ui/layout";
import { PhoneField } from "@brocabs/ui/phone-field";
import { Medium } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { useAddSosContact } from "~/hooks/use-sos-contacts";
import { useTranslation } from "~/i18n/LocaleContext";
import { TextField } from "~/shared/ui/textfield";

export function ContactForm({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate: addSosContact, isPending } = useAddSosContact();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+92");

  const handleSave = () => {
    addSosContact(
      {
        name,
        relation,
        phoneNumber: `${countryCode}${phone}`,
      },
      {
        onSuccess: () => router.back(),
        onError: (error) => {
          console.error("Failed to add SOS contact", error);
          Alert.alert("Error", "Failed to save contact. Please try again.");
        },
      }
    );
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={20} pb={20} gap={22}>
        <Container gap={18}>
          <Container gap={10}>
            <Medium fontSize={16} color="Primary/50">
              {t("common.name")}
            </Medium>
            <TextField
              value={name}
              onChangeText={setName}
              placeholder={t("common.namePlaceholder") || "Enter name"}
              placeholderTextColor={Colors["Neutrals/400"]}
              autoCapitalize="words"
            />
          </Container>

          <Container gap={10}>
            <Medium fontSize={16} color="Primary/50">
              {t("common.contactLabel")}
            </Medium>
            <TextField
              value={relation}
              onChangeText={setRelation}
              placeholder={t("common.relationPlaceholder")}
              placeholderTextColor={Colors["Neutrals/400"]}
              autoCapitalize="words"
            />
          </Container>

          <Container gap={10}>
            <Medium fontSize={16} color="Primary/50">
              {t("common.phoneNumber")}
            </Medium>
            <PhoneField
              value={phone}
              onChangeText={setPhone}
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              placeholder={t("common.phonePlaceholder")}
              placeholderTextColor={Colors["black-400"]}
              showCountryCodeInSelection
            />
          </Container>
        </Container>

        <Button
          label={t("sos.saveContact")}
          onPress={handleSave}
          variant="primary"
          radius="rounded"
          isLoading={isPending}
        />
      </Container>
    </Fill>
  );
}
