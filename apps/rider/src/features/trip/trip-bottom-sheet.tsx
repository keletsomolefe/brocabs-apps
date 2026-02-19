import { useEffect, useMemo, useRef, useState } from "react";

import { Colors } from "@brocabs/ui/theme/colors";
import BottomSheet, { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";

import { Container, Row } from "@brocabs/ui/layout";
import { useWatch } from "react-hook-form";
import { BackHandler, TouchableOpacity, View } from "react-native";
import { CancelRideSheet } from "~/features/trip/components/cancel-ride-sheet";
import { DriverWaiting } from "~/features/trip/components/driver-waiting";
import { PaymentMethodSheet } from "~/features/trip/components/payment-method-sheet";
import { TripAccepted } from "~/features/trip/components/trip-accepted";
import { TripSearching } from "~/features/trip/components/trip-searching";
import { useActiveRide, useCancelRide } from "~/features/trip/hooks/use-ride";
import { TripRequestContent } from "~/features/trip/phases/trip-request-content";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { useRideForm } from "./context/ride-context";
import { AddressSelectorPhase } from "./phases/address-selector";
import { TripInProgress } from "./phases/trip-inprogress";
import { useLocationStore } from "./stores/locationStore";
import {
  PhaseDynamicSizing,
  PhaseIndex,
  PhasePanDownToClose,
  PhaseSnapPoints,
  TripPhase,
} from "./trip-phase";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";

const HIDE_HANDLE_PHASES = [
  TripPhase.Searching,
  TripPhase.DriverWaiting,
  TripPhase.Accepted,
  TripPhase.TripInProgress,
  TripPhase.AddressSelection,
];

const HIDE_BACK_BUTTON_PHASES = [
  TripPhase.Home,
  TripPhase.TripInProgress,
  TripPhase.DriverWaiting,
  TripPhase.Searching,
  TripPhase.Accepted,
  TripPhase.AddressSelection,
];

interface Props {
  tripPhase: TripPhase;
  setTripPhase: (phase: TripPhase) => void;
  onClose?: () => void;
  onAddressSelected: (address: string) => void;
  onPickupBlur?: () => void;
  onDestinationBlur?: () => void;
  onMapPress?: (field: "pickup" | "destination") => void;
  onDismiss?: () => void;
  onHeightChange?: (height: number) => void;
  onCenterMap?: () => void;
}

export function TripBottomSheet(props: Props) {
  const { tripPhase, setTripPhase } = props;
  const { form } = useRideForm();
  const { address } = useLocationStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const paymentSheetRef = useRef<BottomSheetModal>(null);
  const cancelSheetRef = useRef<BottomSheetModal>(null);
  const tripPhaseRef = useRef(tripPhase);
  const [activeField, setActiveField] = useState<"pickup" | "destination" | null>(null);
  const selectedPaymentMethod = useWatch({ control: form.control, name: "paymentMethod" });
  const back = useTripFlow((state) => state.back);
  const { reset } = useTripFlow();
  const insets = useSafeAreaInsets();

  const { data: ride } = useActiveRide();
  const { mutate: cancelRide, isPending: isCancelPending } = useCancelRide();

  const handleConfirmCancel = ({
    reasonCode,
    otherReasonText,
  }: {
    reasonCode: string;
    otherReasonText?: string;
  }) => {
    if (ride?.id) {
      cancelRide(
        { id: ride.id, reasonCode, otherReasonText },
        {
          onSuccess: () => {
            cancelSheetRef.current?.dismiss();
            reset();
            form.reset();
            if (address) {
              form.setValue("pickup", {
                latitude: address.latitude,
                longitude: address.longitude,
                address: address.address || "",
              });
            }
          },
        }
      );
    }
  };

  const handleHeight = useMemo(() => {
    const baseHeight = HIDE_HANDLE_PHASES.includes(tripPhase) ? 0 : 15;
    return baseHeight + 56;
  }, [tripPhase]);

  tripPhaseRef.current = tripPhase;

  useEffect(() => {
    const backAction = () => {
      if (tripPhaseRef.current === TripPhase.AddressSelection) {
        back();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [back]);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(PhaseIndex[tripPhase]);
  }, [tripPhase]);

  const renderBottomSheetContent = (tripPhase: TripPhase) => {
    switch (tripPhase) {
      case TripPhase.Request:
        return (
          <TripRequestContent
            onPickupAddressPress={() => {
              setActiveField("pickup");
              setTripPhase(TripPhase.AddressSelection);
            }}
            onDestinationAddressPress={() => {
              setActiveField("destination");
              setTripPhase(TripPhase.AddressSelection);
            }}
            paymentSheetRef={paymentSheetRef}
            selectedPaymentMethod={selectedPaymentMethod}
          />
        );
      case TripPhase.AddressSelection:
        return (
          <AddressSelectorPhase
            onClose={() => {
              setTripPhase(TripPhase.Home);
              router.replace("/(app)/home");
            }}
            initialActiveField={activeField}
            onAddressSelected={props.onAddressSelected}
            onDestinationBlur={props.onDestinationBlur}
            onPickupBlur={props.onPickupBlur}
            onMapPress={props.onMapPress}
            onDismiss={props.onDismiss}
            setTripPhase={setTripPhase}
          />
        );
      case TripPhase.Accepted:
        return (
          <TripAccepted
            onCancelPress={() => cancelSheetRef.current?.present()}
            isPending={isCancelPending}
          />
        );
      case TripPhase.Searching:
        return <TripSearching />;
      case TripPhase.DriverWaiting:
        return (
          <DriverWaiting
            onCancelPress={() => cancelSheetRef.current?.present()}
            isPending={isCancelPending}
          />
        );
      case TripPhase.TripInProgress:
        return (
          <TripInProgress
            onCancelPress={() => cancelSheetRef.current?.present()}
            isPending={isCancelPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <BottomSheet
        key={tripPhase}
        enableOverDrag={false}
        ref={bottomSheetRef}
        enablePanDownToClose={PhasePanDownToClose[tripPhase]}
        enableDynamicSizing={PhaseDynamicSizing[tripPhase]}
        snapPoints={PhaseSnapPoints[tripPhase]}
        index={PhaseIndex[tripPhase]}
        backgroundComponent={({ animatedIndex, animatedPosition, ...props }) => (
          <Container
            backgroundColor="white"
            borderTopLeftRadius={30}
            borderTopRightRadius={30}
            {...props}
          />
        )}
        handleComponent={() => {
          const hideHandle = HIDE_HANDLE_PHASES.includes(tripPhase);
          return (
            <View
              style={{
                height: hideHandle ? 0 : 15,
                justifyContent: "flex-end",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                alignItems: "center",
                backgroundColor: hideHandle ? "transparent" : Colors.white,
              }}
              pointerEvents="box-none">
              {!hideHandle && (
                <View
                  style={{
                    height: 5,
                    borderRadius: 2.5,
                    width: 60,
                    backgroundColor: Colors["Input Color"],
                  }}
                />
              )}
              <View
                style={{
                  position: "absolute",
                  top: -36 - 20,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                }}
                pointerEvents="box-none">
                <Row justifyContent="space-between" alignItems="center" px={20}>
                  {HIDE_BACK_BUTTON_PHASES.includes(tripPhase) ? (
                    <View />
                  ) : (
                    <TouchableOpacity onPress={back}>
                      <Container
                        width={36}
                        height={36}
                        borderRadius={10}
                        backgroundColor="Primary/400"
                        alignItems="center"
                        justifyContent="center">
                        <Icon name="arrow-back" width={16} height={14} color={Colors.white} />
                      </Container>
                    </TouchableOpacity>
                  )}
                  {tripPhase !== TripPhase.AddressSelection && (
                    <TouchableOpacity onPress={props.onCenterMap}>
                      <Container
                        width={36}
                        height={36}
                        borderRadius={10}
                        backgroundColor="Primary/400"
                        alignItems="center"
                        justifyContent="center">
                        <Icon name="human-hello" width={20} height={20} color={Colors.white} />
                      </Container>
                    </TouchableOpacity>
                  )}
                </Row>
              </View>
            </View>
          );
        }}
        handleIndicatorStyle={{ backgroundColor: Colors["black-200"] }}>
        <BottomSheetView
          style={{ flex: 1 }}
          onLayout={(event) => {
            if (props.onHeightChange) {
              props.onHeightChange(event.nativeEvent.layout.height + handleHeight + insets.bottom);
            }
          }}>
          {renderBottomSheetContent(tripPhase)}
        </BottomSheetView>
      </BottomSheet>
      <PaymentMethodSheet
        bottomSheetRef={paymentSheetRef}
        selectedMethod={selectedPaymentMethod}
        onMethodSelect={(method) =>
          form.setValue("paymentMethod", method, { shouldValidate: true })
        }
      />
      <CancelRideSheet
        bottomSheetRef={cancelSheetRef}
        onCancelRide={handleConfirmCancel}
        isPending={isCancelPending}
      />
    </>
  );
}
