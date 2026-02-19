import { Visible } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { Container, Divider, Fill, Image, Row } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

export function RiderCard({
  isActive,
  isOnBoard,
  riderName,
  riderRating,
  riderAvatarUrl,
  phoneNumber,
  distance,
  eta,
}: {
  isActive?: boolean;
  isOnBoard?: boolean;
  riderName?: string;
  riderRating?: number;
  riderAvatarUrl?: string;
  phoneNumber?: string;
  distance?: string;
  eta?: string;
}) {
  const router = useRouter();
  const { t } = useLocale();

  const handleCallRider = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleMessageRider = () => {
    router.push("/chat");
  };

  return (
    <Container gap={15} backgroundColor="white" p={20} borderRadius={30} overflow="hidden">
      <Row alignItems="center" justifyContent="space-between">
        <View style={styles.profileRow}>
          <Container
            width={65}
            height={65}
            overflow="hidden"
            borderRadius={32.5}
            backgroundColor={riderAvatarUrl ? undefined : "Primary/950"}
            alignItems="center"
            justifyContent="center">
            <Visible if={!riderAvatarUrl}>
              <Icon name="profile-fill" width={40} height={40} color={Colors["Primary/400"]} />
            </Visible>
            <Visible if={!!riderAvatarUrl}>
              <Image width={65} height={65} source={riderAvatarUrl} borderRadius={32.5} />
            </Visible>
          </Container>
          <View style={styles.riderInfo}>
            <Row alignItems="center" gap={10}>
              <SemiBold fontSize={16}>{riderName || t("trip.rider")}</SemiBold>
              <Row
                height={32}
                px={2}
                borderWidth={1}
                borderColor="black-200"
                borderRadius={20}
                gap={8}
                alignItems="center">
                <Icon name="star" color={Colors["Warning/400"]} width={16} height={16} />
                <Regular fontSize={14}>{riderRating || "5.0"}</Regular>
              </Row>
            </Row>
            <View style={styles.topRatedChip}>
              <Regular fontSize={12}>{t("trip.topRated")}</Regular>
            </View>
          </View>
        </View>
        <Visible if={!isOnBoard}>
          <View style={styles.estimateContainer}>
            <View style={styles.timeChip}>
              <Medium fontSize={12} color="white">
                {eta || `0 ${t("trip.min")}`}
              </Medium>
            </View>
            <Regular fontSize={12} color="Primary/600">
              {distance || "0km"} {t("trip.away")}
            </Regular>
          </View>
        </Visible>
      </Row>
      <Visible if={isActive}>
        <Row gap={8}>
          <Fill>
            <Button
              label={t("trip.callRider")}
              variant="primary"
              size="md"
              icon="phone"
              iconColor="white"
              onPress={handleCallRider}
              backgroundColor="Primary/600"
              borderColor="Primary/600"
            />
          </Fill>
          <Fill>
            <Button
              label={t("trip.leaveMessage")}
              variant="primary"
              size="md"
              icon="chat-filled"
              iconColor="white"
              onPress={handleMessageRider}
              backgroundColor="Primary/600"
              borderColor="Primary/600"
            />
          </Fill>
        </Row>
      </Visible>
      <Visible if={isOnBoard}>
        <Divider />
        <Container gap={15}>
          <Medium color="Primary/50">{t("trip.unsafeMessage")}</Medium>
          <Button
            label={t("trip.sos")}
            variant="danger"
            size="md"
            icon="siren-fill"
            iconColor="white"
          />
        </Container>
      </Visible>
    </Container>
  );
}

const styles = StyleSheet.create({
  topRatedChip: {
    backgroundColor: Colors["Warning/400"],
    borderRadius: 18,
    height: 16,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  riderInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
    alignItems: "flex-start",
  },
  estimateContainer: {
    alignItems: "center",
    gap: 4,
  },
  timeChip: {
    backgroundColor: Colors["Secondary/600"],
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  profileRow: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
});
