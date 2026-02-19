import { Visible } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { Container, Fill, Image, Row } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

export function DriverCard({
  driverName,
  driverAvatarUrl,
  driverRating,
  vehiclePlate,
  phoneNumber,
  vehicleModel,
  vehicleColor,
}: {
  driverName?: string;
  driverAvatarUrl?: string;
  driverRating?: number;
  vehiclePlate?: string;
  phoneNumber?: string;
  vehicleModel?: string;
  vehicleColor?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const handleCallDriver = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  return (
    <Container gap={15}>
      <Row alignItems="center" justifyContent="space-between">
        <Row gap={10} flex={1}>
          <Container
            width={65}
            height={65}
            overflow="hidden"
            borderRadius={32.5}
            backgroundColor={driverAvatarUrl ? undefined : "Primary/950"}
            alignItems="center"
            justifyContent="center">
            <Visible if={!driverAvatarUrl}>
              <Icon name="profile-fill" width={40} height={40} color={Colors["Primary/400"]} />
            </Visible>
            <Visible if={!!driverAvatarUrl}>
              <Image width={65} height={65} source={driverAvatarUrl} borderRadius={32.5} />
            </Visible>
          </Container>
          <Container alignItems="flex-start" justifyContent="center" gap={4} flex={1}>
            <Row alignItems="center" gap={10}>
              <SemiBold fontSize={16}>{driverName || t("common.driver")}</SemiBold>
              <View style={styles.ratingBadge}>
                <Icon name="star" color={Colors["Warning/400"]} width={12} height={12} />
                <Regular fontSize={12} color="Primary/50">
                  {(driverRating ?? 5).toFixed(1)}
                </Regular>
              </View>
            </Row>
            <Row gap={4} flexWrap="wrap">
              <View style={styles.topRatedChip}>
                <Regular fontSize={9} color="black">
                  {t("common.topRated")}
                </Regular>
              </View>
              {vehicleModel && (
                <View style={styles.vehicleChip}>
                  <Regular fontSize={9} color="Primary/600">
                    {vehicleModel}
                  </Regular>
                </View>
              )}
              {vehicleColor && (
                <View style={styles.vehicleChip}>
                  <Regular fontSize={9} color="Primary/600">
                    {vehicleColor}
                  </Regular>
                </View>
              )}
            </Row>
          </Container>
        </Row>
        <Container gap={5} width={80} alignItems="center">
          <Image
            source={AssetFiles.images["bro-car"]}
            width={85}
            height={36}
            contentFit="contain"
          />
          <View style={styles.plateContainer}>
            <Regular fontSize={12} color="Primary/600" center>
              {vehiclePlate || t("common.defaultPlate")}
            </Regular>
          </View>
        </Container>
      </Row>
      <Row gap={8}>
        <Fill>
          <Button
            label={t("common.callDriver")}
            variant="primary"
            size="md"
            icon="phone"
            iconColor="white"
            onPress={handleCallDriver}
            backgroundColor="Primary/600"
            borderColor="Primary/600"
          />
        </Fill>
        <Fill>
          <Button
            label={t("common.leaveMessage")}
            variant="primary"
            size="md"
            icon="chat-filled"
            iconColor="white"
            onPress={() => router.push("/chat")}
            backgroundColor="Primary/600"
            borderColor="Primary/600"
          />
        </Fill>
      </Row>
    </Container>
  );
}

const styles = StyleSheet.create({
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors["Primary/600"],
  },
  topRatedChip: {
    backgroundColor: Colors["Warning/400"],
    borderRadius: 18,
    height: 16,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  vehicleChip: {
    borderColor: Colors["Primary/600"],
    borderWidth: 1,
    borderRadius: 18,
    height: 16,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  plateContainer: {
    backgroundColor: Colors["Primary/900"],
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
});
