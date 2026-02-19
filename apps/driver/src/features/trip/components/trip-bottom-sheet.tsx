import { RideResponseDto } from "@brocabs/client";
import { Container, Image, Row } from "@brocabs/ui";
import { Icon } from "@brocabs/ui/icons";
import { Colors } from "@brocabs/ui/theme/colors";
import BottomSheet, {
  BottomSheetHandleProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Dimensions, Linking, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ridesApi } from "~/api";
import {
  HEADER_HEIGHT_WITHOUT_INSETS,
  PhaseEnableContentPanningGesture,
  PhasePanDownToClose,
  PhaseSnapPoints,
} from "~/features/trip/layout-constants";
import { TripPhase } from "~/features/trip/trip-phase";
import { AssetFiles } from "~/theme/assets";
import { useCancelRide } from "../hooks/use-ride";
import { useTripFlow } from "../stores/tripFlowStore";
import { CancelRideSheet } from "./cancel-ride-sheet";
import {
  DriverEnroute,
  DriverWaiting,
  DriverWaitingTimeout,
  StartTrip,
  TripInProgress,
} from "./phases";
import { TripListBottomSheet } from "./trip-list";

const { height: windowHeight } = Dimensions.get("window");

const HIDE_BACK_BUTTON_PHASES = [
  TripPhase.RidesList,
  TripPhase.RidesListMap,
  TripPhase.DriverEnroute,
  TripPhase.DriverWaiting,
  TripPhase.TripInProgress,
  TripPhase.StartTrip,
];

type RideNavigation = Awaited<ReturnType<typeof ridesApi.ridesControllerGetRideNavigation>>;
const HANDLE_HEIGHT = 24;
// Context to pass dynamic props to the stable handle component
const TripHandleContext = createContext<{
  tripPhase: TripPhase;
  onCenterMap: () => void;
  onBack: () => void;
  navigationTarget: { latitude: number; longitude: number } | null;
} | null>(null);

const openWaze = (lat: number, lng: number) => {
  const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  Linking.openURL(url).catch((err) => console.warn("Failed to open Waze:", err));
};

const openGoogleMaps = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url).catch((err) => console.warn("Failed to open Google Maps:", err));
};

const TripHandle = (props: BottomSheetHandleProps) => {
  const context = useContext(TripHandleContext);
  if (!context) return null;
  const { tripPhase, onCenterMap, onBack, navigationTarget } = context;
  const hasTarget = !!navigationTarget;

  return (
    <View
      style={{
        justifyContent: "center",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        height: HANDLE_HEIGHT,
        alignItems: "center",
        position: "relative",
        backgroundColor: tripPhase === TripPhase.RidesListMap ? Colors["Bg Color"] : Colors.white,
      }}
      pointerEvents="box-none">
      <View
        style={{
          height: 5,
          borderRadius: 2.5,
          width: 60,
          backgroundColor: Colors["Input Color"],
        }}
      />
      {tripPhase !== TripPhase.RidesListMap && (
        <Container
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
              <TouchableOpacity onPress={onBack}>
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
            <Row alignItems="center" gap={10}>
              <TouchableOpacity
                onPress={() => hasTarget && openWaze(navigationTarget!.latitude, navigationTarget!.longitude)}
                disabled={!hasTarget}>
                <Container
                  width={36}
                  height={36}
                  borderRadius={10}
                  backgroundColor="Primary/900"
                  alignItems="center"
                  justifyContent="center">
                  <Image source={AssetFiles.images["waze"]} width={20} height={20} />
                </Container>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  hasTarget && openGoogleMaps(navigationTarget!.latitude, navigationTarget!.longitude)
                }
                disabled={!hasTarget}>
                <Container
                  width={36}
                  height={36}
                  borderRadius={10}
                  backgroundColor="Primary/900"
                  alignItems="center"
                  justifyContent="center">
                  <Image source={AssetFiles.images["google-maps"]} width={20} height={20} />
                </Container>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCenterMap}>
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
            </Row>
          </Row>
        </Container>
      )}
    </View>
  );
};

interface TripBottomSheetProps {
  tripPhase: TripPhase;
  activeRide?: RideResponseDto | null;
  rideNavigation?: RideNavigation | null;
  isOnline: boolean;
  onToggleOnline: (val: boolean) => void;
  onCenterMap: () => void;
  onBack: () => void;
  onHeightChange: (height: number) => void;
  onSnapIndexChange?: (index: number) => void;
}

export function TripBottomSheet({
  tripPhase,
  activeRide,
  rideNavigation,
  isOnline,
  onToggleOnline,
  onCenterMap,
  onBack,
  onHeightChange,
  onSnapIndexChange,
}: TripBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const cancelRideSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const { mutate: cancelRide } = useCancelRide();
  const { reset } = useTripFlow();
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const handleCancelRide = useCallback(
    ({ reasonCode, otherReasonText }: { reasonCode: string; otherReasonText?: string }) => {
      if (!activeRide) return;
      cancelRide(
        {
          id: activeRide.id,
          reasonCode,
          otherReasonText,
        },
        {
          onSuccess: () => {
            cancelRideSheetRef.current?.dismiss();
            reset();
          },
        }
      );
    },
    [activeRide, cancelRide, reset]
  );

  const handlePresentCancelSheet = useCallback(() => {
    cancelRideSheetRef.current?.present();
  }, []);

  const handleHeight = useMemo(() => {
    const baseHeight = HANDLE_HEIGHT;
    const buttonsHeight = tripPhase !== TripPhase.RidesListMap ? 56 : 0;
    return baseHeight + buttonsHeight;
  }, [tripPhase]);

  const phaseSnapPoints = useMemo(() => {
    const fullHeight = windowHeight - insets.top - HEADER_HEIGHT_WITHOUT_INSETS;
    return {
      ...PhaseSnapPoints,
      [TripPhase.RidesListMap]: [470, fullHeight],
    };
  }, [insets.top]);

  const dynamicSnapPoints = useMemo(() => {
    const phaseSnap = phaseSnapPoints[tripPhase];

    if (phaseSnap) {
      return phaseSnap;
    }

    if (bottomSheetHeight === 0) {
      return undefined;
    }

    return [200, bottomSheetHeight + HANDLE_HEIGHT];
  }, [phaseSnapPoints, tripPhase, bottomSheetHeight]);

  const navigationTarget = useMemo(() => {
    const target = rideNavigation?.target ?? activeRide?.destination;
    if (
      !target ||
      typeof target.latitude !== "number" ||
      typeof target.longitude !== "number"
    )
      return null;
    return { latitude: target.latitude, longitude: target.longitude };
  }, [rideNavigation?.target, activeRide?.destination]);

  const contextValue = useMemo(
    () => ({ tripPhase, onCenterMap, onBack, navigationTarget }),
    [tripPhase, onCenterMap, onBack, navigationTarget]
  );

  const renderPhase = useCallback(() => {
    const distance = rideNavigation?.route?.distanceMeters
      ? `${(rideNavigation.route.distanceMeters / 1000).toFixed(1)}km`
      : undefined;
    const eta = rideNavigation?.route?.durationSeconds
      ? `${Math.ceil(rideNavigation.route.durationSeconds / 60)} Min`
      : undefined;

    switch (tripPhase) {
      case TripPhase.StartTrip:
        return <StartTrip />;
      case TripPhase.DriverWaiting:
        return <DriverWaiting distance={distance} eta={eta} />;
      case TripPhase.DriverWaitingTimeout:
        return <DriverWaitingTimeout />;
      case TripPhase.DriverEnroute:
        return (
          <DriverEnroute
            ride={activeRide}
            distance={distance}
            eta={eta}
            onCancelPress={handlePresentCancelSheet}
          />
        );
      case TripPhase.TripInProgress:
        return <TripInProgress />;
      case TripPhase.RidesListMap:
        return <TripListBottomSheet isOnline={isOnline} onToggleOnline={onToggleOnline} />;
      default:
        return null;
    }
  }, [tripPhase, isOnline, activeRide, rideNavigation, onToggleOnline, handlePresentCancelSheet]);

  const defaultIndex = useMemo(() => {
    if (tripPhase === TripPhase.RidesListMap) {
      return 0;
    }
    return 1;
  }, [tripPhase]);

  if (tripPhase === TripPhase.RidesList) {
    return null;
  }

  return (
    <TripHandleContext.Provider value={contextValue}>
      <BottomSheet
        onChange={(index) => {
          onSnapIndexChange?.(index);
        }}
        enableHandlePanningGesture
        key={tripPhase}
        ref={bottomSheetRef}
        enablePanDownToClose={PhasePanDownToClose[tripPhase]}
        enableDynamicSizing={bottomSheetHeight === 0 ? true : false}
        snapPoints={dynamicSnapPoints}
        enableContentPanningGesture={PhaseEnableContentPanningGesture[tripPhase]}
        index={defaultIndex}
        backgroundComponent={({ animatedIndex, animatedPosition, ...props }) => (
          <Container
            backgroundColor="Bg Color"
            borderTopLeftRadius={30}
            borderTopRightRadius={30}
            {...props}
          />
        )}
        handleComponent={TripHandle}>
        <BottomSheetView
          onLayout={(event) => {
            if (onHeightChange) {
              setBottomSheetHeight(event.nativeEvent.layout.height);
              onHeightChange(event.nativeEvent.layout.height + handleHeight + insets.bottom);
            }
          }}>
          {renderPhase()}
        </BottomSheetView>
      </BottomSheet>
      <CancelRideSheet bottomSheetRef={cancelRideSheetRef} onCancelRide={handleCancelRide} />
    </TripHandleContext.Provider>
  );
}
