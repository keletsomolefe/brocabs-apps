import { Medium, Row, SemiBold } from "@brocabs/ui";
import { Container, Divider, Image, PressableScale } from "@brocabs/ui/layout";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, IconName } from "~/shared/ui/icons";

export function EmergencyContacts({
  rounded = false,
  withSafeArea = true,
}: {
  rounded?: boolean;
  withSafeArea?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const emergencyContacts = [
    {
      id: "1",
      avatar: "https://cdn.midjourney.com/48556ce5-bc70-47c7-8ad4-bd08dffa278d/0_3.png",
      name: "Husband",
      phone: "+923123456789",
    },
    {
      id: "2",
      avatar: "https://cdn.midjourney.com/cff88445-9945-4eee-99ff-5046bea05b43/0_3.png",
      name: "Father",
      phone: "+923123456789",
    },
  ];

  return (
    <Container
      backgroundColor="white"
      padding={15}
      paddingBottom={withSafeArea ? Math.max(insets.bottom + 15, 15) : 15}
      borderRadius={rounded ? 20 : 0}
      gap={15}>
      <SemiBold color="Primary/50" fontSize={16}>
        Emergency Contacts:
      </SemiBold>
      <Container gap={15}>
        {emergencyContacts.map((contact, index) => (
          <React.Fragment key={contact.id}>
            <Row justifyContent="space-between" alignItems="center">
              <Row gap={10} alignItems="center">
                <Image source={{ uri: contact.avatar }} width={40} height={40} borderRadius={20} />
                <Container>
                  <Medium color="black" fontSize={16}>
                    {contact.name}
                  </Medium>
                  <Medium color="Primary/50" fontSize={12}>
                    {contact.phone}
                  </Medium>
                </Container>
              </Row>
              <Row gap={10} alignItems="center">
                <IconButton icon="phone" onPress={() => {}} />
                <IconButton icon="mdi-location" onPress={() => {}} />
              </Row>
            </Row>
            {index < emergencyContacts.length - 1 && (
              <Divider backgroundColor="Neutrals/100" height={1} />
            )}
          </React.Fragment>
        ))}
      </Container>
    </Container>
  );
}

function IconButton({ icon, onPress }: { icon: IconName; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress}>
      <Container
        width={40}
        height={40}
        backgroundColor="Primary/600"
        borderRadius={20}
        justifyContent="center"
        alignItems="center">
        <Icon name={icon} width={24} height={24} color="white" />
      </Container>
    </PressableScale>
  );
}
