import { Container, Visible } from "@brocabs/ui";
import { Divider, Image, Row } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveRide } from "~/features/trip/hooks/use-ride";
import { useEndTrip } from "~/features/trip/hooks/useEndTrip";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { EndTripSheet } from "../end-trip-sheet";
import { EmergencyContacts } from "../widgets/emergency-contacts";

export function TripInProgress() {
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const { data: ride } = useActiveRide();
  const rider = ride?.riderProfile;
  const riderName = rider?.fullName;
  const riderAvatarUrl = rider?.avatar?.publicUrl ?? undefined;
  const rating = 5.0;

  const vehiclePlate = ride?.driverProfile?.vehicle?.registrationNumber || "PB-789X";

  const { mutate: endTrip, isPending } = useEndTrip();
  const endTripSheetRef = useRef<BottomSheetModal>(null);

  const handleSOS = () => {
    Linking.openURL("tel:911");
  };

  const handleEndTripPress = () => {
    endTripSheetRef.current?.present();
  };

  const handleEndTrip = (payload: { reasonCode: string; otherReasonText?: string }) => {
    if (ride?.id) {
      endTrip(
        {
          rideId: ride.id,
          reasonCode: payload.reasonCode,
          otherReasonText: payload.otherReasonText,
        },
        {
          onSuccess: () => {
            endTripSheetRef.current?.dismiss();
          },
        }
      );
    }
  };

  return (
    <Container
      borderTopLeftRadius={30}
      borderTopRightRadius={30}
      gap={5}
      backgroundColor="Bg Color">
      <Container
        backgroundColor="white"
        borderBottomLeftRadius={20}
        borderBottomRightRadius={20}
        padding={20}
        gap={15}>
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
                  {riderName || "Rider"}
                </SemiBold>
                <View style={styles.ratingBadge}>
                  <Icon name="star" color={Colors["Primary/600"]} width={10} height={10} />
                  <Regular fontSize={12} color="Primary/50">
                    {rating.toFixed(1)}
                  </Regular>
                </View>
              </Row>
              <View style={styles.topRatedBadge}>
                <Medium fontSize={9} color="black">
                  {t("trip.topRated")}
                </Medium>
              </View>
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
            {t("trip.feelingUnsafe")}
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
      <View style={[styles.actionContainer, { paddingBottom: insets.bottom + 15 }]}>
        <Pressable
          style={({ pressed }) => [styles.endTripButton, pressed && { opacity: 0.8 }]}
          onPress={handleEndTripPress}
          disabled={isPending}>
          <Medium fontSize={20} lineHeight={36} color="white">
            {t("trip.endTrip")}
          </Medium>
        </Pressable>
      </View>
      <EndTripSheet
        bottomSheetRef={endTripSheetRef}
        onEndTrip={handleEndTrip}
        isPending={isPending}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  emergencyContainer: {
    marginTop: 10,
  },
  actionContainer: {
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  endTripButton: {
    backgroundColor: Colors["Primary/600"],
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
  topRatedBadge: {
    backgroundColor: "#FFB74C",
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 18,
    alignSelf: "flex-start",
    marginTop: 4,
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
