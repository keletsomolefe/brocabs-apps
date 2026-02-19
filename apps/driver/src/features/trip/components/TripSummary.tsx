import { Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { format } from "date-fns";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRideHistoryById } from "~/hooks/use-ride-history";
import { Icon } from "~/shared/ui/icons";
import { useConfirmCashPayment } from "../hooks/use-payment-confirmation";
import { TripRating } from "./trip-rating";

const styles = StyleSheet.create({
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  completedChip: {
    backgroundColor: Colors["Success/400"],
  },
  cancelledChip: {
    backgroundColor: Colors["Secondary/600"],
  },
  inProcessChip: {
    backgroundColor: Colors["Warning/400"],
  },
  fareDetailsCard: {
    backgroundColor: Colors["white"],
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
});

type TripSummaryProps = {
  rideId: string;
  visible: boolean;
  onClose: () => void;
  onSubmitRating: (rating: number, review: string) => Promise<void>;
  isRatingPending?: boolean;
};

export const TripSummary = ({
  rideId,
  visible,
  onClose,
  onSubmitRating,
  isRatingPending,
}: TripSummaryProps) => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const insets = useSafeAreaInsets();
  const { data: ride, isLoading, isError } = useRideHistoryById(rideId);
  const { mutate: confirmPayment, isPending: isConfirmingPayment } = useConfirmCashPayment(rideId);

  const handleClose = () => {
    onClose();
  };

  const handleConfirmPayment = () => {
    confirmPayment(undefined, {
      onSuccess: () => {
        handleClose();
      },
      onError: () => {
        Alert.alert("Error", "Failed to confirm payment. Please try again.");
      },
    });
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    await onSubmitRating(rating, review);
    setHasRated(true);
    setShowRatingModal(false);
  };

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

  if (!visible) return null;

  const content = () => {
    if (isLoading) {
      return (
        <Fill alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={Colors["Primary/600"]} />
        </Fill>
      );
    }

    if (isError || !ride) {
      return (
        <Fill alignItems="center" justifyContent="center" px={20}>
          <Regular fontSize={16} color="Neutrals/500">
            Failed to load ride details
          </Regular>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Container backgroundColor="Primary/600" px={20} py={10} borderRadius={8}>
              <Medium color="white">Close</Medium>
            </Container>
          </TouchableOpacity>
        </Fill>
      );
    }

    const isCancelled = ride.status === "cancelled";
    const pricing = ride.pricing;
    const rideDate = format(ride.createdAt, "MMM d, yyyy");
    const rideTime = format(ride.createdAt, "h:mm a");

    // Cash payment conditional UI
    const isCashPayment = ride.paymentMethodCode === "CASH";
    const isPaid = (ride as { paymentStatus?: string | null }).paymentStatus === "paid";
    const showCashPendingUI = isCashPayment && !isPaid;

    return (
      <Fill>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
          showsVerticalScrollIndicator={false}>
          <Container px={20} pt={20} gap={10}>
            {/* Price Hero Card */}
            {showCashPendingUI ? (
              <Container px={20} py={30} alignItems="center" gap={8}>
                <SemiBold fontSize={20} color="Primary/50" textAlign="center">
                  Collect Payment
                </SemiBold>
                <Regular fontSize={14} color="Neutrals/400" textAlign="center">
                  Once you confirm that the payment has been made, we’ll update your invoice.
                </Regular>
              </Container>
            ) : (
              <Container
                backgroundColor="white"
                borderRadius={30}
                px={20}
                py={30}
                alignItems="center">
                <Icon name="payment-success" width={91} height={91} />
                <Container alignItems="center" gap={2} mt={20}>
                  <SemiBold fontSize={28} color="Primary/50">
                    {formatPrice(
                      pricing.actualPrice != null
                        ? Number(pricing.actualPrice)
                        : pricing.estimatedPrice
                    )}
                  </SemiBold>
                  <Regular fontSize={14} color="Primary/50">
                    Successfully Paid
                  </Regular>
                </Container>
              </Container>
            )}

            {/* Fare Details Card */}
            <View style={styles.fareDetailsCard}>
              <Row justifyContent="space-between" alignItems="center" py={10}>
                <Regular fontSize={14} color="Neutrals/400">
                  Ride Fair
                </Regular>
                <Medium fontSize={14} color="Primary/50">
                  {formatPrice(pricing.estimatedPrice)}
                </Medium>
              </Row>
              {pricing.actualPrice != null &&
                Number(pricing.actualPrice) !== pricing.estimatedPrice && (
                  <Row justifyContent="space-between" alignItems="center" py={10}>
                    <Regular fontSize={14} color="Neutrals/400">
                      Additional Charges
                    </Regular>
                    <Medium fontSize={14} color="Primary/50">
                      {formatPrice(Number(pricing.actualPrice) - pricing.estimatedPrice)}
                    </Medium>
                  </Row>
                )}
              <Row justifyContent="space-between" alignItems="center" py={10}>
                <SemiBold fontSize={14} color="Primary/50">
                  Net Total
                </SemiBold>
                <SemiBold fontSize={14} color="Primary/50">
                  {formatPrice(
                    pricing.actualPrice != null
                      ? Number(pricing.actualPrice)
                      : pricing.estimatedPrice
                  )}
                </SemiBold>
              </Row>
            </View>

            {/* Ride Status, Payment & ID Card */}
            <Container backgroundColor="white" borderRadius={20} p={15}>
              <Row justifyContent="space-between" alignItems="center" py={10}>
                <Regular fontSize={14} color="Neutrals/400">
                  Status
                </Regular>
                <View
                  style={[
                    styles.statusChip,
                    isCancelled
                      ? styles.cancelledChip
                      : showCashPendingUI
                        ? styles.inProcessChip
                        : styles.completedChip,
                  ]}>
                  <Regular fontSize={10} color="Primary/50">
                    {isCancelled ? "Cancelled" : showCashPendingUI ? "In Process" : "Completed"}
                  </Regular>
                </View>
              </Row>
              <Row justifyContent="space-between" alignItems="center" py={10}>
                <Regular fontSize={14} color="Neutrals/400">
                  Payment From
                </Regular>
                <Medium fontSize={14} color="Primary/50">
                  {getPaymentMethodLabel(ride.paymentMethodCode)}
                </Medium>
              </Row>
              <Row justifyContent="space-between" alignItems="center" py={10}>
                <Regular fontSize={14} color="Neutrals/400">
                  Date
                </Regular>
                <Medium fontSize={14} color="Primary/50">
                  {rideDate}
                </Medium>
              </Row>
              <Row justifyContent="space-between" alignItems="center" py={10}>
                <Regular fontSize={14} color="Neutrals/400">
                  Time
                </Regular>
                <Medium fontSize={14} color="Primary/50">
                  {rideTime}
                </Medium>
              </Row>
            </Container>

            {/* Buttons Section */}
            {showCashPendingUI ? (
              <Container gap={10}>
                <TouchableOpacity onPress={handleConfirmPayment} disabled={isConfirmingPayment}>
                  <Container
                    backgroundColor="Primary/600"
                    height={56}
                    borderRadius={10}
                    alignItems="center"
                    justifyContent="center">
                    {isConfirmingPayment ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <SemiBold fontSize={14} color="Neutrals/50">
                        Confirm Payment
                      </SemiBold>
                    )}
                  </Container>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Coming soon", "This feature is not yet implemented.")
                  }>
                  <Container
                    backgroundColor="Primary/950"
                    height={56}
                    borderRadius={10}
                    alignItems="center"
                    justifyContent="center">
                    <Regular fontSize={14} color="Primary/600">
                      Make Complaint
                    </Regular>
                  </Container>
                </TouchableOpacity>
              </Container>
            ) : (
              <>
                {/* Rate Customer Button */}
                {!hasRated && (
                  <TouchableOpacity onPress={() => setShowRatingModal(true)}>
                    <Container
                      backgroundColor="Secondary/600"
                      height={56}
                      borderRadius={10}
                      alignItems="center"
                      justifyContent="center">
                      <SemiBold fontSize={14} color="Neutrals/50">
                        Rate Customer
                      </SemiBold>
                    </Container>
                  </TouchableOpacity>
                )}

                {/* Bottom Close Button */}
                <TouchableOpacity onPress={handleClose}>
                  <Container
                    backgroundColor="Primary/600"
                    height={56}
                    borderRadius={10}
                    alignItems="center"
                    justifyContent="center">
                    <Regular fontSize={14} color="Neutrals/50">
                      Close
                    </Regular>
                  </Container>
                </TouchableOpacity>
              </>
            )}
          </Container>
        </ScrollView>
      </Fill>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <Fill backgroundColor="Bg Color" pt={insets.top}>
        {content()}
        <TripRating
          visible={showRatingModal}
          onCancel={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          isLoading={isRatingPending}
        />
      </Fill>
    </Modal>
  );
};
