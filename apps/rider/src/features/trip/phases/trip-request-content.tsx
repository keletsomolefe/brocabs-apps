import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { View } from "react-native";

import { PaymentMethodResponseDtoCodeEnum, ResponseError } from "@brocabs/client";
import { Container } from "@brocabs/ui/layout";
import { useWatch } from "react-hook-form";
import { LocationSelector } from "~/features/trip/components/location-selector";
import { TripActionBar } from "~/features/trip/components/trip-action-bar";
import { VehicleSelector } from "~/features/trip/components/vehicle-selector";
import { useRideForm } from "../context/ride-context";
import { useCreateRideRequest } from "../hooks/use-ride";
import { useRidesQuote } from "../hooks/use-rides-quote";
import { useInsufficientBalanceStore } from "../stores/insufficientBalanceStore";

export function TripRequestContent({
  onPickupAddressPress,
  onDestinationAddressPress,
  paymentSheetRef,
  selectedPaymentMethod,
}: TripRequestContentProps) {
  const { form } = useRideForm();
  const { isValid } = form.formState;
  const pickup = useWatch({ control: form.control, name: "pickup" });
  const destination = useWatch({ control: form.control, name: "destination" });
  const rideType = useWatch({ control: form.control, name: "rideType" });

  const { mutateAsync: createRide, isPending: isCreatingRide } = useCreateRideRequest();
  const showInsufficientBalanceModal = useInsufficientBalanceStore((state) => state.showModal);

  const { data: quote, isLoading: isQuoteLoading } = useRidesQuote({
    startLat: pickup?.latitude,
    startLng: pickup?.longitude,
    startAddress: pickup?.address,
    endLat: destination?.latitude,
    endLng: destination?.longitude,
    endAddress: destination?.address,
  });

  const idempotencyKeyRef = useRef<string | null>(null);

  const handleRequestRide = useCallback(async () => {
    if (!quote?.id || !rideType) return;

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = Math.random().toString(36).substring(7);
    }

    try {
      await createRide({
        quoteId: quote.id,
        rideTypeId: rideType,
        idempotencyKey: idempotencyKeyRef.current,
        paymentMethod: selectedPaymentMethod,
        cardId: "a40a9adf-079d-4bb4-a242-daa4d55e03e8",
      });
      idempotencyKeyRef.current = null;
    } catch (error) {
      if (error instanceof ResponseError) {
        const errorResponse = await error.response.json();
        if (errorResponse.errorCode === "InsufficientFunds") {
          showInsufficientBalanceModal();
          return;
        }
      }
      throw error;
    }
  }, [createRide, quote?.id, rideType, selectedPaymentMethod, showInsufficientBalanceModal]);

  return (
    <Container backgroundColor="Bg Color" flex={1} gap={5}>
      <LocationSelector
        pickupAddress={pickup?.address}
        destinationAddress={destination?.address}
        onPickupAddressPress={() => {
          onPickupAddressPress();
        }}
        onDestinationAddressPress={() => {
          onDestinationAddressPress();
        }}
        loading={isQuoteLoading}
      />
      <View>
        <VehicleSelector loading={isQuoteLoading} quote={quote} />
      </View>
      <View>
        <TripActionBar
          paymentSheetRef={paymentSheetRef}
          selectedPaymentMethod={selectedPaymentMethod}
          disabled={isQuoteLoading || !isValid || isCreatingRide}
          loading={isCreatingRide}
          onRequestPress={handleRequestRide}
        />
      </View>
    </Container>
  );
}

interface TripRequestContentProps {
  onPickupAddressPress: () => void;
  onDestinationAddressPress: () => void;
  paymentSheetRef: React.RefObject<BottomSheetModal | null>;
  selectedPaymentMethod: PaymentMethodResponseDtoCodeEnum;
}
