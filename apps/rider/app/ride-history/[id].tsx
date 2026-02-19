import { Column, Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { format } from "date-fns";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRideHistoryById } from "~/hooks/use-ride-history";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

// Placeholder images
const DEFAULT_AVATAR = "https://cdn.midjourney.com/48556ce5-bc70-47c7-8ad4-bd08dffa278d/0_3.png";

export default function RideDetailsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const formatPrice = (price: number) => t("common.priceFormat", { amount: price.toFixed(2) });

  const getPaymentMethodLabel = (code?: string | null) => {
    switch (code) {
      case "WALLET":
        return t("common.wallet");
      case "CARD":
        return t("common.card");
      case "CASH":
        return t("common.cash");
      default:
        return t("common.nA");
    }
  };

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
          {t("common.failedToLoad")}
        </Regular>
      </Fill>
    );
  }

  const isCancelled = ride.status === "cancelled";
  const isCompleted = ride.status === "completed";
  const driverProfile = ride.driverProfile;
  const pricing = ride.pricing;

  const pickupTime = ride.startedAt ? format(new Date(String(ride.startedAt)), "h:mm a") : t("common.nA");
  const arrivalTime = ride.completedAt
    ? format(new Date(String(ride.completedAt)), "h:mm a")
    : ride.arrivedAt
      ? format(new Date(String(ride.arrivedAt)), "h:mm a")
      : t("common.nA");
  const rideDate = format(ride.createdAt, "MMM d, yyyy");
  const rideTime = format(ride.createdAt, "h:mm a");

  // Determine feedback state - rider viewing driver's feedback
  const driverRating = driverProfile?.rating;
  const isRatingPending = isCompleted && !driverRating;

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
                      {t("common.startLocation")}
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
                      {t("common.destination")}
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
                  ? t("common.mins", {
                      count: Math.round(Number(pricing.durationSeconds) / 60),
                    })
                  : t("common.nA")}
              </Regular>
            </Row>
          </Container>

          {/* Driver Section */}
          <Container backgroundColor="white" borderRadius={20} p={20} gap={16}>
            <Row alignItems="center" gap={12}>
              <Image
                source={{ uri: driverProfile?.avatar?.publicUrl ?? DEFAULT_AVATAR }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
                contentFit="cover"
              />
              <Column flex={1} gap={6}>
                <Row alignItems="center" gap={8} flexWrap="wrap">
                  <SemiBold fontSize={16} color="Primary/50">
                    {driverProfile?.fullName ?? t("common.driver")}
                  </SemiBold>
                  {driverProfile?.rating != null && (
                    <Container
                      flexDirection="row"
                      alignItems="center"
                      gap={4}
                      px={2}
                      py={1}
                      backgroundColor="Neutrals/100"
                      borderRadius={20}>
                      <Icon name="star" width={14} height={14} color={Colors["Warning/400"]} />
                      <Regular fontSize={12} color="Primary/50">
                        {String(driverProfile.rating)}
                      </Regular>
                    </Container>
                  )}
                </Row>
                {driverProfile?.vehicle && (
                  <Regular fontSize={12} color="Neutrals/500">
                    {driverProfile.vehicle.make} {driverProfile.vehicle.model} •{" "}
                    {driverProfile.vehicle.registrationNumber}
                  </Regular>
                )}
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
                  {t("common.messageHistory")}
                </Medium>
              </Container>
            </TouchableOpacity>
          </Container>

          {/* Fare Details Card */}
          <Container backgroundColor="white" borderRadius={20} p={20}>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                {t("common.rideFare")}
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {formatPrice(pricing.estimatedPrice)}
              </Regular>
            </Row>
            {pricing.actualPrice != null &&
              Number(pricing.actualPrice) !== pricing.estimatedPrice && (
                <Row justifyContent="space-between" alignItems="center" py={12}>
                  <Regular fontSize={14} color="Primary/50">
                    {t("common.finalPrice")}
                  </Regular>
                  <Regular fontSize={14} color="Primary/50">
                    {formatPrice(Number(pricing.actualPrice))}
                  </Regular>
                </Row>
              )}
            <Container height={1} backgroundColor="Neutrals/100" my={2} />
            <Row justifyContent="space-between" alignItems="center" py={1}>
              <SemiBold fontSize={16} color="Primary/50">
                {t("common.total")}
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
                {t("common.status")}
              </Regular>
              <Container
                backgroundColor={isCancelled ? "Danger/600" : "Success/400"}
                px={12}
                py={1}
                borderRadius={20}>
                <Regular fontSize={14} color="white">
                  {isCancelled ? t("common.cancelled") : t("common.completed")}
                </Regular>
              </Container>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                {t("common.paymentMethod")}
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {getPaymentMethodLabel(ride.paymentMethodCode)}
              </Regular>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                {t("common.date")}
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {rideDate}
              </Regular>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                {t("common.time")}
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {rideTime}
              </Regular>
            </Row>
            <Row justifyContent="space-between" alignItems="center" py={12}>
              <Regular fontSize={14} color="Primary/50">
                {t("common.bookingID")}
              </Regular>
              <Regular fontSize={14} color="Primary/50">
                {ride.id.slice(0, 8).toUpperCase()}
              </Regular>
            </Row>
          </Container>

          {/* Given Feedback Section */}
          <SemiBold fontSize={16} color="Primary/50" mt={2}>
            {t("common.givenFeedback")}
          </SemiBold>

          {/* Your Feedback Card */}
          <Container backgroundColor="white" borderRadius={20} p={20} gap={16}>
            <Row justifyContent="space-between" alignItems="center">
              <Regular fontSize={14} color="Primary/50">
                {t("common.yourFeedback")}
              </Regular>
              <Row gap={4}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icon key={i} name="star" width={20} height={20} color={Colors["Neutrals/300"]} />
                ))}
              </Row>
            </Row>
            <Regular fontSize={14} color="Primary/50" lineHeight={20}>
              {t("common.noFeedback")}
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
                    {t("common.giveFeedback")}
                  </Medium>
                </Container>
              </TouchableOpacity>
            )}
          </Container>

          {/* Driver's Feedback Card */}
          {!isRatingPending && driverRating != null && (
            <Container backgroundColor="white" borderRadius={20} p={20} gap={16}>
              <Row justifyContent="space-between" alignItems="center">
                <Regular fontSize={14} color="Primary/50">
                  {t("common.driverRating")}
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
                {t("common.noFeedback")}
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
                  {t("common.downloadInvoice")}
                </SemiBold>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </ScrollView>
    </Fill>
  );
}
