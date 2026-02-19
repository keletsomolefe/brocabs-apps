import { Column, Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRideHistoryById } from "~/hooks/use-ride-history";
import { Icon } from "~/shared/ui/icons";

// Placeholder images
const DEFAULT_AVATAR = "https://cdn.midjourney.com/48556ce5-bc70-47c7-8ad4-bd08dffa278d/0_3.png";

const formatPrice = (price: number) => `R ${price.toFixed(2)}`;

const getPaymentMethodLabel = (code?: string | null) => {
  switch (code) {
    case "WALLET":
      return "My Wallet";
    case "CARD":
      return "Card";
    case "CASH":
      return "Cash";
    default:
      return "—";
  }
};

export default function RideDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const { data: ride, isLoading, isError } = useRideHistoryById(id);

  if (isLoading) {
    return (
      <Fill backgroundColor="Bg Color" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={Colors["Primary/600"]} />
      </Fill>
    );
  }

  if (isError || !ride) {
    return (
      <Fill backgroundColor="Bg Color" alignItems="center" justifyContent="center" px={20}>
        <Regular fontSize={16} color="Neutrals/500">
          Failed to load ride details
        </Regular>
      </Fill>
    );
  }

  const isCancelled = ride.status === "cancelled";
  const isCompleted = ride.status === "completed";
  const riderProfile = ride.riderProfile;
  const pricing = ride.pricing;

  const pickupTime = ride.startedAt ? format(new Date(String(ride.startedAt)), "h:mm a") : "—";
  const arrivalTime = ride.completedAt
    ? format(new Date(String(ride.completedAt)), "h:mm a")
    : ride.arrivedAt
      ? format(new Date(String(ride.arrivedAt)), "h:mm a")
      : "—";
  const rideDate = format(ride.createdAt, "MMM d, yyyy");
  const rideTime = format(ride.createdAt, "h:mm a");

  // Determine feedback state - driver viewing rider's feedback
  const riderRating = riderProfile ? null : null; // TODO: Add rider rating to API if needed
  const isRatingPending = isCompleted && !riderRating;

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
        showsVerticalScrollIndicator={false}>
        <Container px={20} pt={20} gap={16}>
          {/* Route Section */}
          <Container backgroundColor="white" borderRadius={20} p={20}>
            <Row gap={16}>
              {/* Purple Dotted Line Timeline */}
              <Container width={40} alignItems="center">
                <Container py={1}>
                  <Icon name="map-pin" width={20} height={20} color={Colors["Primary/600"]} />
                </Container>
                <Container
                  width={2}
                  flex={1}
                  style={{
                    backgroundColor: Colors["Primary/600"],
                  }}
                  height={32}
                />
                <Container py={1}>
                  <Icon name="location" width={20} height={20} color={Colors["Primary/600"]} />
                </Container>
              </Container>

              <Column flex={1} gap={16}>
                {/* Start Location */}
                <Row justifyContent="space-between" alignItems="flex-start">
                  <Column flex={1} gap={4}>
                    <SemiBold fontSize={14} color="Primary/50">
                      Start Location
                    </SemiBold>
                    <Regular fontSize={12} color="Neutrals/500">
                      {ride.pickup.address}
                    </Regular>
                  </Column>
                  <Regular fontSize={12} color="Neutrals/500">
                    {pickupTime}
                  </Regular>
                </Row>

                {/* Destination */}
                <Row justifyContent="space-between" alignItems="flex-start">
                  <Column flex={1} gap={4}>
                    <SemiBold fontSize={14} color="Primary/50">
                      Destination
                    </SemiBold>
                    <Regular fontSize={12} color="Neutrals/500">
                      {ride.destination.address}
                    </Regular>
                  </Column>
                  <Regular fontSize={12} color="Neutrals/500">
                    {arrivalTime}
                  </Regular>
                </Row>
              </Column>
            </Row>

            {/* Date and Duration */}
            <Container height={1} backgroundColor="Neutrals/100" my={16} />
            <Row justifyContent="space-between" alignItems="center">
              <Regular fontSize={14} color="Primary/50">
                {rideDate}
              </Regular>
              <Regular fontSize={14} color="Neutrals/500">
                {pricing.durationSeconds
                  ? `${Math.round(Number(pricing.durationSeconds) / 60)} mins`
                  : "—"}
              </Regular>
            </Row>
          </Container>

          {/* Driver Section */}
          <Container backgroundColor="white" borderRadius={20} p={20} gap={16}>
            <Row alignItems="center" gap={12}>
              <Image
                source={{ uri: riderProfile?.avatar?.publicUrl ?? DEFAULT_AVATAR }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                contentFit="cover"
              />
              <Column flex={1} gap={6}>
                <Row alignItems="center" gap={8} flexWrap="wrap">
                  <SemiBold fontSize={16} color="Primary/50">
                    {riderProfile?.fullName ?? "Rider"}
                  </SemiBold>
                </Row>
              </Column>
            </Row>

            <TouchableOpacity activeOpacity={0.7}>
              <Container
                backgroundColor="Primary/600"
                borderRadius={20}
                py={14}
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
                gap={8}>
                <Icon name="message" width={20} height={20} color={Colors.white} />
                <Medium fontSize={16} color="white">
                  Message History
                </Medium>
              </Container>
            </TouchableOpacity>
          </Container>

          {/* Fare Details Card */}
          <Container backgroundColor="white" borderRadius={20} p={20}>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                Ride Fare
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {formatPrice(pricing.estimatedPrice)}
              </Regular>
            </Row>
            {pricing.actualPrice != null &&
              Number(pricing.actualPrice) !== pricing.estimatedPrice && (
                <Row justifyContent="space-between" alignItems="center" py={12}>
                  <Regular fontSize={14} color="Primary/50">
                    Final Price
                  </Regular>
                  <Regular fontSize={14} color="Primary/50">
                    {formatPrice(Number(pricing.actualPrice))}
                  </Regular>
                </Row>
              )}
            <Container height={1} backgroundColor="Neutrals/100" my={2} />
            <Row justifyContent="space-between" alignItems="center" py={1}>
              <SemiBold fontSize={16} color="Primary/50">
                Total
              </SemiBold>
              <SemiBold fontSize={16} color="Primary/50">
                {formatPrice(
                  pricing.actualPrice != null ? Number(pricing.actualPrice) : pricing.estimatedPrice
                )}
              </SemiBold>
            </Row>
          </Container>

          {/* Ride Status, Payment & ID Card */}
          <Container backgroundColor="white" borderRadius={20} p={20}>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                Status
              </Regular>
              <Container
                backgroundColor={isCancelled ? "Danger/600" : "Success/400"}
                px={12}
                py={1}
                borderRadius={20}>
                <Regular fontSize={14} color="white">
                  {isCancelled ? "Cancelled" : "Completed"}
                </Regular>
              </Container>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                Payment Method
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {getPaymentMethodLabel(ride.paymentMethodCode)}
              </Regular>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                Date
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {rideDate}
              </Regular>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                Time
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {rideTime}
              </Regular>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                Booking ID
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {ride.id.slice(0, 8).toUpperCase()}
              </Regular>
            </Row>
          </Container>

          {/* Given Feedback Section */}
          <SemiBold fontSize={16} color="Primary/50" mt={2}>
            Given Feedback
          </SemiBold>

          {/* Your Feedback Card */}
          <Container backgroundColor="white" borderRadius={20} p={20} gap={16}>
            <Row justifyContent="space-between" alignItems="center">
              <Regular fontSize={14} color="Primary/50">
                Your Feedback
              </Regular>
              <Row gap={4}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icon key={i} name="star" width={20} height={20} color={Colors["Neutrals/300"]} />
                ))}
              </Row>
            </Row>
            <Regular fontSize={14} color="Primary/50" lineHeight={20}>
              No feedback provided yet
            </Regular>
            {isRatingPending && (
              <TouchableOpacity activeOpacity={0.7}>
                <Container
                  backgroundColor="Primary/600"
                  borderRadius={20}
                  py={14}
                  alignItems="center"
                  justifyContent="center">
                  <Medium fontSize={16} color="white">
                    Give Feedback
                  </Medium>
                </Container>
              </TouchableOpacity>
            )}
          </Container>

          {/* Rider's Feedback Card */}
          {!isRatingPending && (
            <Container backgroundColor="white" borderRadius={20} p={20} gap={16}>
              <Row justifyContent="space-between" alignItems="center">
                <Regular fontSize={14} color="Primary/50">
                  Rider&apos;s Feedback
                </Regular>
                <Row gap={4}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon
                      key={i}
                      name="star"
                      width={20}
                      height={20}
                      color={Colors["Neutrals/300"]}
                    />
                  ))}
                </Row>
              </Row>
              <Regular fontSize={14} color="Primary/50" lineHeight={20}>
                No feedback provided yet
              </Regular>
            </Container>
          )}

          {/* Download Invoice Button */}
          <Container pb={2}>
            <TouchableOpacity activeOpacity={0.7}>
              <Container
                backgroundColor="Primary/600"
                borderRadius={20}
                py={16}
                alignItems="center"
                flexDirection="row"
                justifyContent="center"
                gap={8}>
                <Icon name="document" width={20} height={20} color={Colors.white} />
                <SemiBold fontSize={16} color="white">
                  Download Invoice
                </SemiBold>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </ScrollView>
    </Fill>
  );
}
