import { RideResponseDto } from "@brocabs/client";
import { Container } from "@brocabs/ui";
import { Colors } from "@brocabs/ui/theme/colors";
import { TripPrice } from "@brocabs/ui/trip-price";
import { Pressable, StyleSheet, Text } from "react-native";
import { useConfirmArrival } from "~/features/trip/hooks/useConfirmArrival";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { CancelTrip } from "../widgets/cancel-trip";
import { RiderCard } from "../widgets/rider-card";

export function DriverEnroute({
  ride,
  distance,
  eta,
  onCancelPress,
}: {
  ride?: RideResponseDto | null;
  distance?: string;
  eta?: string;
  onCancelPress?: () => void;
}) {
  const { t } = useLocale();
  const rider = ride?.riderProfile;
  const { mutate: confirmArrival, isPending } = useConfirmArrival();

  const handleConfirmArrival = () => {
    if (ride?.id) {
      confirmArrival(ride.id);
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
        p={15}
        borderBottomRightRadius={20}
        borderBottomLeftRadius={20}
        overflow="hidden">
        <Pressable
          style={[styles.confirmButton, isPending && { opacity: 0.5 }]}
          onPress={handleConfirmArrival}
          disabled={isPending}>
          <Icon name="location" width={24} height={24} color={Colors.white} />
          <Text style={styles.confirmButtonText}>
            {isPending ? t("trip.confirming") : t("trip.confirmArrival")}
          </Text>
        </Pressable>
      </Container>
      <RiderCard
        isActive
        riderName={rider?.fullName}
        riderAvatarUrl={rider?.avatar?.publicUrl ?? undefined}
        phoneNumber={rider?.phoneNumber}
        distance={distance}
        eta={eta}
      />
      <TripPrice paymentMethod={ride?.paymentMethodCode as any} price={ride?.estimatedPrice || 0} />
      <CancelTrip onPress={onCancelPress} />
    </Container>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: Colors["Primary/600"],
    height: 56,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 20,
    lineHeight: 36,
    fontFamily: "BRHendrix-Medium",
  },
});
