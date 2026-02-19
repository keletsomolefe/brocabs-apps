import { Button } from "@brocabs/ui/button";
import { Card, Container, Divider, Fill, Image, PressableScale, Row } from "@brocabs/ui/layout";
import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRemoveSosContact, useSosContacts } from "~/hooks/use-sos-contacts";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { AssetFiles } from "~/theme/assets";
import { DeleteContactSheet } from "./delete-contact-sheet";

export function ContactList() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useLocale();
  const deleteContactSheetRef = useRef<BottomSheetModal>(null);
  const [selectedContact, setSelectedContact] = useState<{ id: string; name: string } | null>(null);

  const { data: contacts } = useSosContacts();
  const { mutate: removeSosContact } = useRemoveSosContact();

  const handleAddContact = () => {
    router.push("/sos-contacts/add");
  };

  const handleEditContact = (id: string) => {
    // Edit not supported in requirements, only create/delete, but we can keep navigation or disable it
  };

  const handleDeletePress = (e: any, contact: { id: string; name: string }) => {
    setSelectedContact(contact);
    deleteContactSheetRef.current?.present();
  };

  const handleDelete = () => {
    if (selectedContact) {
      removeSosContact(selectedContact.id);
    }
    deleteContactSheetRef.current?.dismiss();
    setSelectedContact(null);
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={2} pb={Math.max(insets.bottom, 20)} gap={20}>
        {contacts && contacts.length > 0 ? (
          <Card backgroundColor="white" borderRadius={20} px={16} py={2}>
            {contacts.map((contact, index) => (
              <PressableScale onPress={() => handleEditContact(contact.id)} key={contact.id}>
                <Container>
                  <Row alignItems="center" justifyContent="space-between" py={12}>
                    <Row alignItems="center" gap={12}>
                      <Image
                        source={AssetFiles.images["placeholder-avatar"]}
                        width={40}
                        height={40}
                        borderRadius={20}
                      />
                      <Container>
                        <Medium fontSize={16} color="Primary/50">
                          {contact.name}
                        </Medium>
                        <Medium fontSize={12} color="Neutrals/500">
                          {contact.phoneNumber}
                        </Medium>
                      </Container>
                    </Row>
                    <PressableScale onPress={(e) => handleDeletePress(e, contact)}>
                      <Container
                        width={40}
                        height={40}
                        borderRadius={12}
                        backgroundColor="Secondary/100"
                        alignItems="center"
                        justifyContent="center">
                        <Icon name="trash" width={18} height={18} color={Colors["Secondary/600"]} />
                      </Container>
                    </PressableScale>
                  </Row>
                  {index < contacts.length - 1 && <Divider backgroundColor="Neutrals/100" />}
                </Container>
              </PressableScale>
            ))}
          </Card>
        ) : (
          <Container
            backgroundColor="white"
            borderRadius={20}
            px={20}
            py={40}
            alignItems="center"
            gap={12}>
            <Icon name="siren-fill" width={48} height={48} color={Colors["Neutrals/400"]} />
            <Regular fontSize={16} color="Neutrals/500" textAlign="center">
              {t("sos.noContacts")}
            </Regular>
            <Regular fontSize={14} color="Neutrals/400" textAlign="center">
              {t("sos.addContactDesc")}
            </Regular>
          </Container>
        )}

        <Button
          label={t("common.addNewContact")}
          onPress={handleAddContact}
          variant="primary"
          radius="rounded"
        />
      </Container>
      <DeleteContactSheet
        ref={deleteContactSheetRef}
        onDelete={handleDelete}
        contactName={selectedContact?.name}
      />
    </Fill>
  );
}
