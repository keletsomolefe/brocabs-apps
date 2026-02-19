import { Container, Visible } from "@brocabs/ui";
import { Divider, Image, Row } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveRide } from "~/features/trip/hooks/use-ride";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { EmergencyContacts } from "../widgets/emergency-contacts";

interface TripInProgressProps {
  onCancelPress?: () => void;
  isPending?: boolean;
}

export function TripInProgress({ onCancelPress, isPending }: TripInProgressProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: ride } = useActiveRide();
  const rider = ride?.riderProfile;
  const riderName = rider?.fullName;
  const riderAvatarUrl = rider?.avatar?.publicUrl ?? undefined;
  const rating = 5.0;

  const vehiclePlate = ride?.driverProfile?.vehicle?.registrationNumber || "PB-789X";
  const vehicleModel = ride?.driverProfile?.vehicle?.model || "Suzuki Atlas";
  const vehicleColor = ride?.driverProfile?.vehicle?.colour || "White";

  const handleSOS = () => {
    Linking.openURL("tel:911");
  };

  return (
    <Container
      borderTopLeftRadius={40}
      borderTopRightRadius={40}
      gap={5}
      style={{ backgroundColor: "#EEEEEE" }}>
      <Container backgroundColor="white" borderRadius={30} padding={20} gap={15}>
        <Row justifyContent="space-between" alignItems="center">
          <Row gap={10} flex={1}>
            <Container
              width={56}
              height={56}
              overflow="hidden"
              borderRadius={28}
              backgroundColor={riderAvatarUrl ? undefined : "Primary/950"}
              alignItems="center"
              justifyContent="center">
              <Visible if={!riderAvatarUrl}>
                <Icon name="profile-fill" width={35} height={35} color={Colors["Primary/400"]} />
              </Visible>
              <Visible if={!!riderAvatarUrl}>
                <Image width={56} height={56} source={riderAvatarUrl} borderRadius={28} />
              </Visible>
            </Container>

            <View>
              <Row alignItems="center" gap={4}>
                <SemiBold fontSize={16} color="Primary/50">
                  {riderName || t("common.rider")}
                </SemiBold>
                <View style={styles.ratingBadge}>
                  <Icon name="star" color={Colors["Primary/600"]} width={10} height={10} />
                  <Regular fontSize={12} color="Primary/50">
                    {rating.toFixed(1)}
                  </Regular>
                </View>
              </Row>
              <Row gap={4} flexWrap="wrap" style={{ marginTop: 4 }}>
                <View style={styles.topRatedChip}>
                  <Regular fontSize={9} color="black">
                    {t("common.topRated")}
                  </Regular>
                </View>
                <View style={styles.vehicleChip}>
                  <Regular fontSize={9} color="Primary/600">
                    {vehicleModel}
                  </Regular>
                </View>
                <View style={styles.vehicleChip}>
                  <Regular fontSize={9} color="Primary/600">
                    {vehicleColor}
                  </Regular>
                </View>
              </Row>
            </View>
          </Row>

          <View style={styles.vehicleContainer}>
            <Image
              source={AssetFiles.images["bro-car"]}
              width={85}
              height={36}
              contentFit="contain"
            />
            <View style={styles.plateBadge}>
              <Regular fontSize={12} color="Primary/600">
                {vehiclePlate}
              </Regular>
            </View>
          </View>
        </Row>

        <Divider backgroundColor="Neutrals/100" height={1} />

        <View style={styles.sosContainer}>
          <Medium fontSize={12} color="Primary/50">
            {t("common.unsafeMessage")}
          </Medium>
          <Pressable style={styles.sosButton} onPress={handleSOS}>
            <Icon name="siren-fill" width={20} height={20} color="white" />
            <SemiBold fontSize={14} color="white">
              {t("common.sos")}
            </SemiBold>
          </Pressable>
        </View>
      </Container>

      <EmergencyContacts rounded withSafeArea={false} />
      <Pressable
        onPress={onCancelPress}
        disabled={isPending}
        style={[styles.cancelButton, { paddingBottom: insets.bottom + 15 }]}>
        {isPending ? (
          <ActivityIndicator color="#E4211E" />
        ) : (
          <View style={styles.cancelContent}>
            <Text style={styles.cancelText}>{t("common.cancelRide")}</Text>
            <Icon name="chevron-right" width={12} height={24} color="#E4211E" />
          </View>
        )}
      </Pressable>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    gap: 5,
  },
  driverSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
  },
  emergencyContainer: {
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    shadowColor: "#A2A2A2",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.56,
    shadowRadius: 10.9,
    elevation: 5,
  },
  cancelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#E4211E",
    fontFamily: "BR Hendrix",
  },
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
  vehicleContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  plateBadge: {
    backgroundColor: Colors["Primary/900"],
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 100,
  },
  sosContainer: {
    gap: 10,
  },
  sosButton: {
    backgroundColor: Colors["Secondary/600"],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 30, // Large radius for pill shape
  },
});
