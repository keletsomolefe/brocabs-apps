import { QueryKeys, ResponseError, RideResponseDtoStatusEnum } from "@brocabs/client";
import { PickupMarker } from "@brocabs/ui";
import { useLocationStore } from "@brocabs/ui/stores/location-store";
import { getSnappedDriverRoute } from "@brocabs/ui/utils";
import { decode } from "@mapbox/polyline";
import { useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ridesApi } from "~/api";
import { CarMarker } from "~/components/car-marker";
import { MapController } from "~/features/map/components/MapController";
import { DestinationMarker } from "~/features/trip/components/DestinationMarker";
import { TripBottomSheet } from "~/features/trip/components/trip-bottom-sheet";
import { TripList } from "~/features/trip/components/trip-list";
import { TripStatusModal } from "~/features/trip/components/trip-status-modal";
import { TripSummary } from "~/features/trip/components/TripSummary";
import { useActiveRide } from "~/features/trip/hooks/use-ride";
import { useRateRide } from "~/features/trip/hooks/useRateRide";
import { useNoShowStore } from "~/features/trip/stores/noShowStore";
import { useReconnectStore } from "~/features/trip/stores/reconnectStore";
import { useRideCompletedStore } from "~/features/trip/stores/rideCompletedStore";
import { useRiderCancelledStore } from "~/features/trip/stores/riderCancelledStore";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { HOME_PHASES, TripPhase } from "~/features/trip/trip-phase";
import { useRideNavigation } from "~/hooks/use-ride-navigation";
import { useDriverStatusStore } from "~/stores/driver-status-store";
import { useLayoutStore } from "~/stores/layout-store";
import { AssetFiles } from "~/theme/assets";
import { WalletPhase } from "./phases/wallet-phase";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
const BOTTOM_MIN_HEIGHT = 200;
const IGNORE_MAP_PADDING = [TripPhase.RidesList];

const HEADER_SHOWN_PHASES = [
  TripPhase.RidesList,
  TripPhase.RidesListMap,
  TripPhase.DriverEnroute,
  TripPhase.TripInProgress,
  TripPhase.DriverWaiting,
  TripPhase.StartTrip,
  TripPhase.Wallet,
];

export function TripScreen() {
  const queryClient = useQueryClient();
  const mapRef = useRef<MapView>(null);
  const mapTouchedRef = useRef(false);
  const insets = useSafeAreaInsets();
  const homeHeaderHeight = useLayoutStore((state) => state.homeHeaderHeight);
  const mapTopPadding = homeHeaderHeight + 20 || 20;
  const { isOnline, toggleOnline } = useDriverStatusStore();

  const [isMapReady, setIsMapReady] = useState(false);
  const { phase: tripPhase, push: tripPhasePush, reset: tripPhaseReset } = useTripFlow();
  const isEnroute = tripPhase === TripPhase.DriverEnroute || tripPhase === TripPhase.TripInProgress;
  const prevSnapIndexRef = useRef<number | undefined>(undefined);

  const { data: activeRide, refetch: refetchActiveRide } = useActiveRide();
  const prevRideRef = useRef<typeof activeRide | undefined>(undefined);

  const { data: rideNavigation } = useRideNavigation(activeRide?.id);

  const {
    shouldShowModal: showRiderCancelledModal,
    dismissModal: dismissRiderCancelledModal,
    showCancelledModal,
  } = useRiderCancelledStore();

  const {
    shouldShowModal: showRideCompletedModal,
    completedData: rideCompletedData,
    dismissModal: dismissRideCompletedModal,
  } = useRideCompletedStore();

  useEffect(() => {
    const unsubscribe = useReconnectStore.subscribe((state) => {
      if (state.shouldRefresh) {
        ridesApi
          .ridesMeControllerGetActiveRide()
          .then((newRide) => {
            queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], newRide);
            queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_NAVIGATION] });
            useReconnectStore.getState().reset();
          })
          .catch((error) => {
            if (error instanceof ResponseError && error.response.status === 404) {
              if (prevRideRef.current?.id) {
                const prevStatus = prevRideRef.current.status;
                if (
                  prevStatus === RideResponseDtoStatusEnum.Arrived ||
                  prevStatus === RideResponseDtoStatusEnum.Accepted ||
                  prevStatus === RideResponseDtoStatusEnum.InProgress
                ) {
                  showCancelledModal({
                    rideId: prevRideRef.current.id,
                    cancelledBy: "rider",
                  });
                }
              }
            }
            useReconnectStore.getState().reset();
          });
      }
    });
    return unsubscribe;
  }, [queryClient, showCancelledModal]);

  useEffect(() => {
    prevRideRef.current = activeRide;
  }, [activeRide]);

  const handleRiderCancelledDismiss = useCallback(() => {
    queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    tripPhaseReset();
    dismissRiderCancelledModal();
    refetchActiveRide();
  }, [dismissRiderCancelledModal, queryClient, tripPhaseReset, refetchActiveRide]);

  const handleRideCompletedDismiss = useCallback(() => {
    queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
    queryClient.removeQueries({ queryKey: [QueryKeys.RIDE_NAVIGATION] });
    tripPhaseReset();
    dismissRideCompletedModal();
    refetchActiveRide();
  }, [dismissRideCompletedModal, queryClient, tripPhaseReset, refetchActiveRide]);

  const { mutateAsync: rateRide, isPending: isRatingPending } = useRateRide();

  const handleRateSubmission = useCallback(
    async (rating: number, review: string) => {
      if (!rideCompletedData?.rideId) return;
      try {
        await rateRide({
          rideId: rideCompletedData.rideId,
          rating,
          comment: review || undefined,
        });
        queryClient.invalidateQueries({
          queryKey: [QueryKeys.RIDE_HISTORY_DETAIL, rideCompletedData.rideId],
        });
      } catch (error) {
        console.error("Failed to submit rating:", error);
      }
    },
    [rideCompletedData, rateRide, queryClient]
  );

  const { shouldShowModal: isNoShow, dismissModal: dismissNoShowModal } = useNoShowStore();

  const handleNoShowDismiss = useCallback(() => {
    queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    tripPhaseReset();
    dismissNoShowModal();
    refetchActiveRide();
  }, [queryClient, tripPhaseReset, refetchActiveRide, dismissNoShowModal]);

  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const lastPhaseRef = useRef(tripPhase);
  const effectiveHeight = lastPhaseRef.current === tripPhase ? bottomSheetHeight : 0;
  const [snapIndex, setSnapIndex] = useState<number | undefined>(undefined);
  const bottomPadding = useMemo(() => {
    if (IGNORE_MAP_PADDING.includes(tripPhase)) {
      return 0;
    }

    if (snapIndex === 0) {
      return 200;
    }

    return Math.max(effectiveHeight, BOTTOM_MIN_HEIGHT);
  }, [tripPhase, snapIndex, effectiveHeight]);

  const mapBottomPadding = IGNORE_MAP_PADDING.includes(tripPhase) ? 0 : bottomPadding;

  useEffect(() => {
    if (activeRide) {
      const status = activeRide.status;
      if (status === RideResponseDtoStatusEnum.Accepted) {
        tripPhasePush(TripPhase.DriverEnroute);
      } else if (status === RideResponseDtoStatusEnum.Arrived) {
        tripPhasePush(TripPhase.DriverWaiting);
      } else if (status === RideResponseDtoStatusEnum.InProgress) {
        tripPhasePush(TripPhase.TripInProgress);
      }
    }
  }, [activeRide, tripPhasePush, insets.top]);

  const rideNavigationCoords = useMemo(() => {
    if (!rideNavigation?.route.polyline) return [];
    return decode(rideNavigation.route.polyline).map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));
  }, [rideNavigation?.route.polyline]);

  const { snappedDriverPosition, remainingRoute } = useMemo(
    () =>
      getSnappedDriverRoute(
        rideNavigationCoords,
        rideNavigation?.driver.lat,
        rideNavigation?.driver.lon
      ),
    [rideNavigationCoords, rideNavigation?.driver.lat, rideNavigation?.driver.lon]
  );

  useEffect(() => {
    if (snapIndex !== prevSnapIndexRef.current) {
      mapTouchedRef.current = false;
      prevSnapIndexRef.current = snapIndex;
    }
  }, [snapIndex]);

  useEffect(() => {
    if (mapTouchedRef.current) return;

    if (remainingRoute.length > 0 && mapRef.current && isEnroute) {
      mapRef.current.fitToCoordinates(remainingRoute, {
        edgePadding: {
          top: mapTopPadding,
          right: 0,
          bottom: 0,
          left: 0,
        },
        animated: true,
      });
      return;
    }
    if (
      tripPhase === TripPhase.DriverWaiting &&
      mapRef.current &&
      activeRide?.pickup &&
      snappedDriverPosition
    ) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: activeRide.pickup.latitude, longitude: activeRide.pickup.longitude },
          snappedDriverPosition,
        ],
        {
          edgePadding: {
            top: mapTopPadding,
            right: 0,
            bottom: 0,
            left: 0,
          },
          animated: true,
        }
      );
      return;
    }
  }, [
    remainingRoute,
    tripPhase,
    insets.top,
    activeRide?.pickup,
    snappedDriverPosition,
    isEnroute,
    mapTopPadding,
  ]);

  const remainingRouteRef = useRef(remainingRoute);
  remainingRouteRef.current = remainingRoute;
  const snappedDriverPositionRef = useRef(snappedDriverPosition);
  snappedDriverPositionRef.current = snappedDriverPosition;
  const rideNavigationRef = useRef(rideNavigationCoords);
  rideNavigationRef.current = rideNavigationCoords;
  const onCenterMap = useCallback(() => {
    mapTouchedRef.current = false;

    requestAnimationFrame(() => {
      if (mapRef.current && isEnroute && remainingRouteRef.current.length > 0) {
        mapRef.current.fitToCoordinates(remainingRouteRef.current, {
          edgePadding: {
            top: mapTopPadding,
            right: 0,
            bottom: 0,
            left: 0,
          },
          animated: true,
        });
        return;
      }

      if (rideNavigationRef.current.length > 0 && mapRef.current) {
        mapRef.current.fitToCoordinates(rideNavigationRef.current, {
          edgePadding: {
            top: mapTopPadding,
            right: 0,
            bottom: 0,
            left: 0,
          },
          animated: true,
        });
        return;
      }

      const location = useLocationStore.getState().location;
      if (location && mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: (windowWidth / windowHeight) * 0.01,
        });
      }
    });
  }, [isEnroute, mapTopPadding]);

  useEffect(() => {
    onCenterMap();
  }, [onCenterMap]);

  return (
    <>
      <Stack.Screen options={{ headerShown: HEADER_SHOWN_PHASES.includes(tripPhase) }} />
      <MapController mapRef={mapRef}>
        {({ onMapReady }) => (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={PROVIDER_GOOGLE}
            onPanDrag={() => {
              mapTouchedRef.current = true;
            }}
            mapPadding={
              isMapReady ? { bottom: mapBottomPadding, top: 20, left: 20, right: 20 } : undefined
            }
            showsUserLocation={true}
            showsMyLocationButton={false}
            userLocationPriority="high"
            userLocationUpdateInterval={5000}
            showsCompass
            userInterfaceStyle="light"
            rotateEnabled={false}
            pitchEnabled={false}
            onMapReady={() => {
              setIsMapReady(true);
              onMapReady();
            }}>
            {activeRide?.pickup &&
              (tripPhase === TripPhase.DriverEnroute || tripPhase === TripPhase.DriverWaiting) &&
              activeRide?.destination && (
                <>
                  <Marker
                    zIndex={2}
                    coordinate={
                      remainingRoute.length > 0 && tripPhase === TripPhase.DriverEnroute
                        ? remainingRoute[remainingRoute.length - 1]
                        : {
                            latitude: activeRide.pickup.latitude,
                            longitude: activeRide.pickup.longitude,
                          }
                    }
                    anchor={{ x: 0.5, y: 1 }}
                    title="Pickup">
                    <PickupMarker avatar={activeRide?.riderProfile?.avatar?.publicUrl} />
                  </Marker>
                  {snappedDriverPosition && (
                    <Marker
                      zIndex={1}
                      coordinate={snappedDriverPosition}
                      anchor={{ x: 0.5, y: 0.5 }}
                      title="Driver">
                      <CarMarker heading={rideNavigation?.driver.heading || 0} size={40} />
                    </Marker>
                  )}
                </>
              )}
            {tripPhase === TripPhase.TripInProgress && activeRide?.destination && (
              <>
                <Marker
                  zIndex={2}
                  coordinate={{
                    latitude: activeRide.destination.latitude,
                    longitude: activeRide.destination.longitude,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  title="Destination">
                  <DestinationMarker />
                </Marker>
                {snappedDriverPosition && (
                  <Marker
                    zIndex={1}
                    coordinate={snappedDriverPosition}
                    anchor={{ x: 0.5, y: 0.5 }}
                    title="Driver">
                    <CarMarker heading={rideNavigation?.driver.heading || 0} size={40} />
                  </Marker>
                )}
              </>
            )}
            {remainingRoute.length > 0 && isEnroute && (
              <Polyline coordinates={remainingRoute} strokeWidth={4} strokeColor="#6828FF" />
            )}
          </MapView>
        )}
      </MapController>
      {tripPhase === TripPhase.Wallet && <WalletPhase />}
      {tripPhase === TripPhase.RidesList && (
        <TripList isOnline={isOnline} onToggleOnline={toggleOnline} />
      )}
      {!HOME_PHASES.includes(tripPhase) && (
        <TripBottomSheet
          tripPhase={tripPhase}
          activeRide={activeRide}
          rideNavigation={rideNavigation}
          isOnline={isOnline}
          onToggleOnline={toggleOnline}
          onCenterMap={onCenterMap}
          onSnapIndexChange={setSnapIndex}
          onBack={() => tripPhasePush(TripPhase.RidesListMap)}
          onHeightChange={(height) => {
            if (height !== bottomSheetHeight || lastPhaseRef.current !== tripPhase) {
              setBottomSheetHeight(height);
              lastPhaseRef.current = tripPhase;
            }
          }}
        />
      )}
      {showRiderCancelledModal && (
        <Modal
          isVisible={showRiderCancelledModal}
          hideModalContentWhileAnimating
          useNativeDriver
          backdropTransitionOutTiming={0}
          hasBackdrop
          style={{ margin: 0, paddingTop: insets.top, paddingBottom: insets.bottom }}
          backdropOpacity={0.4}>
          <TripStatusModal
            title="Rider cancelled"
            description="You are free to leave, this ride will not affect your profile at all"
            image={AssetFiles.images["mascot-ride-cancelled"]}
            onPress={handleRiderCancelledDismiss}
          />
        </Modal>
      )}
      {isNoShow && (
        <Modal
          isVisible={isNoShow}
          hideModalContentWhileAnimating
          useNativeDriver
          backdropTransitionOutTiming={0}
          hasBackdrop
          style={{ margin: 0, paddingTop: insets.top, paddingBottom: insets.bottom }}
          backdropOpacity={0.4}>
          <TripStatusModal
            title="Rider didn't appear?"
            description="You are free to leave, this ride will not effect your profile at all"
            image={AssetFiles.images["mascot-ride-cancelled"]}
            onPress={handleNoShowDismiss}
          />
        </Modal>
      )}
      {showRideCompletedModal && rideCompletedData?.rideId && (
        <TripSummary
          rideId={rideCompletedData.rideId}
          visible={showRideCompletedModal}
          onClose={handleRideCompletedDismiss}
          onSubmitRating={handleRateSubmission}
          isRatingPending={isRatingPending}
        />
      )}
    </>
  );
}
