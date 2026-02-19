import { QueryKeys, ResponseError, RideResponseDtoStatusEnum } from "@brocabs/client";
import { icons } from "@brocabs/ui/icons/registry";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { getSnappedDriverRoute } from "@brocabs/ui/utils";
import { decode } from "@mapbox/polyline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from "react-native-maps";
import Modal from "react-native-modal";
import { ridesApi } from "~/api";
import { CarMarker } from "~/components/car-marker";
import { MapController } from "~/features/map/components/MapController";
import { DestinationMarker } from "~/features/trip/components/DestinationMarker";
import { DriverArrivedModal } from "~/features/trip/components/driver-arrived-modal";
import { DriverNotFoundModal } from "~/features/trip/components/driver-not-found-modal";
import { InsufficientBalanceModal } from "~/features/trip/components/insufficient-balance-modal";
import { PickupMarker } from "~/features/trip/components/PickupMarker";
import { PulsingCircles } from "~/features/trip/components/PulsingCircles";
import { TripStatusModal } from "~/features/trip/components/trip-status-modal";
import { TripSummary } from "~/features/trip/components/TripSummary";
import { LocationPoint, RideProvider, useRideForm } from "~/features/trip/context/ride-context";
import { useActiveRide, useRetryRideRequest } from "~/features/trip/hooks/use-ride";
import { useRidesQuote } from "~/features/trip/hooks/use-rides-quote";
import { useRateRide } from "~/features/trip/hooks/useRateRide";
import { HomePhase } from "~/features/trip/phases/home";
import { WalletPhase } from "~/features/trip/phases/wallet-phase";
import { useDriverArrivedStore } from "~/features/trip/stores/driverArrivedStore";
import { useDriverNotFoundStore } from "~/features/trip/stores/driverNotFoundStore";
import { useInsufficientBalanceStore } from "~/features/trip/stores/insufficientBalanceStore";
import { useLocationStore } from "~/features/trip/stores/locationStore";
import { useReconnectStore } from "~/features/trip/stores/reconnectStore";
import { useRideCancelledStore } from "~/features/trip/stores/rideCancelledStore";
import { useRideCompletedStore } from "~/features/trip/stores/rideCompletedStore";
import { reverseGeocode } from "~/services/map";
import { LocationConfirmationPhase } from "./phases/location-confirmation/location-confirmation-phase";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRideNavigation } from "~/hooks/use-ride-navigation";
import { useRiderProfile } from "~/hooks/use-rider-profile";
import { useTranslation } from "~/i18n/LocaleContext";
import { useLayoutStore } from "~/stores/layout-store";
import { useTripFlow } from "./stores/tripFlowStore";
import { TripBottomSheet } from "./trip-bottom-sheet";
import { TripPhase, VISIBLE_PHASES } from "./trip-phase";

const PickLocationIcon = icons.picklocation;

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get("window");
const BOTTOM_MIN_HEIGHT = 200;
const IGNORE_MAP_PADDING = [TripPhase.AddressSelection, TripPhase.Home];
const HEADER_SHOWN_PHASES = [
  TripPhase.Home,
  TripPhase.Wallet,
  TripPhase.TripInProgress,
  TripPhase.DriverWaiting,
  TripPhase.Searching,
  TripPhase.Accepted,
];

export function TripScreen() {
  return (
    <RideProvider>
      <TripContent />
    </RideProvider>
  );
}

function TripContent() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading } = useRiderProfile();
  const {
    phase: tripPhase,
    back: tripPhaseBack,
    push: tripPhasePush,
    pop: tripPhasePop,
    reset: tripPhaseReset,
    history,
  } = useTripFlow();
  const { form } = useRideForm();
  const pickup = useWatch({ control: form.control, name: "pickup" });
  const destination = useWatch({ control: form.control, name: "destination" });
  const insets = useSafeAreaInsets();
  const homeHeaderHeight = useLayoutStore((state) => state.homeHeaderHeight);
  const mapTopPadding =
    tripPhase === TripPhase.Request ? insets.top + 20 : homeHeaderHeight + 20 || insets.top + 20;

  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const [isMapReady, setIsMapReady] = useState(false);

  const { data: activeRide, refetch: refetchActiveRide } = useActiveRide();

  const isDriverEnroute =
    activeRide?.status === RideResponseDtoStatusEnum.Accepted ||
    activeRide?.status === RideResponseDtoStatusEnum.Arrived ||
    activeRide?.status === RideResponseDtoStatusEnum.InProgress;
  const { data: rideNavigation } = useRideNavigation(isDriverEnroute ? activeRide?.id : undefined);
  const { shouldShowModal: showDriverNotFoundModal, dismissModal: dismissDriverNotFoundModal } =
    useDriverNotFoundStore();

  const {
    shouldShowModal: showInsufficientBalanceModal,
    dismissModal: dismissInsufficientBalanceModal,
  } = useInsufficientBalanceStore();

  const { shouldShowModal: showRideCancelledModal, dismissModal: dismissRideCancelledModal } =
    useRideCancelledStore();

  const {
    shouldShowModal: showRideCompletedModal,
    completedData: rideCompletedData,
    dismissModal: dismissRideCompletedModal,
  } = useRideCompletedStore();

  const prevRideRef = useRef<typeof activeRide | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = useReconnectStore.subscribe((state) => {
      if (state.shouldRefresh) {
        ridesApi
          .ridesMeControllerGetActiveRide()
          .then((newRide) => {
            const currentStatus = newRide?.status;
            const prevStatus = prevRideRef.current?.status;

            if (currentStatus && prevStatus !== currentStatus) {
              if (
                currentStatus === RideResponseDtoStatusEnum.Arrived &&
                prevStatus !== RideResponseDtoStatusEnum.Arrived
              ) {
                useDriverArrivedStore.getState().showModal();
              }
            }

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
                  useRideCancelledStore.getState().showModal({
                    rideId: prevRideRef.current.id,
                    cancelledBy: "driver",
                    reason: t("common.rideEndedUnexpectedly"),
                  });
                }
              }
            }
            useReconnectStore.getState().reset();
          });
      }
    });
    return unsubscribe;
  }, [queryClient, t]);

  useEffect(() => {
    prevRideRef.current = activeRide;
  }, [activeRide]);

  const handleRideCancelledDismiss = useCallback(() => {
    tripPhaseReset();
    queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    const address = useLocationStore.getState().address;
    const paymentMethod = form.getValues("paymentMethod");
    form.reset({
      pickup: address
        ? {
            latitude: address.latitude,
            longitude: address.longitude,
            address: address.address ?? undefined,
          }
        : undefined,
      paymentMethod,
    });
    queryClient.removeQueries({ queryKey: [QueryKeys.RIDES_QUOTE] });
    queryClient.removeQueries({ queryKey: [QueryKeys.RIDE_NAVIGATION] });
    dismissRideCancelledModal();
  }, [tripPhaseReset, dismissRideCancelledModal, form, queryClient]);

  const handleRideCompletedDismiss = useCallback(() => {
    tripPhaseReset();
    queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
    const address = useLocationStore.getState().address;
    const paymentMethod = form.getValues("paymentMethod");
    form.reset({
      pickup: address
        ? {
            latitude: address.latitude,
            longitude: address.longitude,
            address: address.address ?? undefined,
          }
        : undefined,
      paymentMethod,
    });
    queryClient.removeQueries({ queryKey: [QueryKeys.RIDES_QUOTE] });
    queryClient.removeQueries({ queryKey: [QueryKeys.RIDE_NAVIGATION] });
    dismissRideCompletedModal();
  }, [tripPhaseReset, dismissRideCompletedModal, form, queryClient]);

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

  const { mutateAsync: retryRideRequest } = useRetryRideRequest();

  const handleDriverNotFoundDismiss = useCallback(() => {
    dismissDriverNotFoundModal();
    tripPhaseReset();
    form.reset();
    queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    const address = useLocationStore.getState().address;
    if (address) {
      form.setValue("pickup", {
        latitude: address.latitude,
        longitude: address.longitude,
        address: address.address ?? undefined,
      });
    }
    refetchActiveRide();
  }, [dismissDriverNotFoundModal, tripPhaseReset, form, queryClient, refetchActiveRide]);

  const handleDriverNotFoundTryAgain = useCallback(async () => {
    if (!activeRide?.id) return;
    dismissDriverNotFoundModal();
    try {
      await retryRideRequest(activeRide.id);
    } catch (error) {
      console.error("Failed to retry ride request", error);
    }
  }, [dismissDriverNotFoundModal, activeRide?.id, retryRideRequest]);

  const handleInsufficientBalanceUseAnotherMethod = useCallback(() => {
    dismissInsufficientBalanceModal();
  }, [dismissInsufficientBalanceModal]);

  useEffect(() => {
    if (activeRide) {
      const status = activeRide.status;
      if (status === RideResponseDtoStatusEnum.Searching) {
        tripPhasePush(TripPhase.Searching);
      } else if (status === RideResponseDtoStatusEnum.Accepted) {
        tripPhasePush(TripPhase.Accepted);
      } else if (status === RideResponseDtoStatusEnum.Arrived) {
        tripPhasePush(TripPhase.DriverWaiting);
      } else if (status === RideResponseDtoStatusEnum.InProgress) {
        tripPhasePush(TripPhase.TripInProgress);
      }

      if (activeRide.pickup && !form.getValues("pickup")) {
        form.setValue("pickup", activeRide.pickup);
      }
      if (activeRide.destination && !form.getValues("destination")) {
        form.setValue("destination", activeRide.destination);
      }
    }
  }, [activeRide, tripPhasePush, form, insets.top]);

  const { data: quote } = useRidesQuote({
    startLat: pickup?.latitude,
    startLng: pickup?.longitude,
    startAddress: pickup?.address,
    endLat: destination?.latitude,
    endLng: destination?.longitude,
    endAddress: destination?.address,
    enabled: tripPhase === TripPhase.Request,
  });

  const decodedCoords = useMemo(() => {
    const polyline = activeRide?.routePolyline || quote?.routePolyline;
    if (!polyline) return [];
    return decode(polyline).map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));
  }, [quote?.routePolyline, activeRide?.routePolyline]);

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

  const tripPhaseRef = useRef(tripPhase);
  tripPhaseRef.current = tripPhase;

  const lastPhaseRef = useRef(tripPhase);
  const effectiveHeight = lastPhaseRef.current === tripPhase ? bottomSheetHeight : 0;

  const isProgrammaticMoveRef = useRef(false);
  const mapRef = useRef<MapView | null>(null);
  const mapTouchedRef = useRef(false);

  const [pickingField, setPickingField] = useState<"pickup" | "destination">("destination");

  const [confirmingLocation, setConfirmingLocation] = useState<LocationPoint | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutateAsync: reverseGeocodeAsync, isPending: loadingReverseGeocode } = useMutation({
    mutationFn: ({
      latitude,
      longitude,
      signal,
    }: {
      latitude: number;
      longitude: number;
      signal?: AbortSignal;
    }) => reverseGeocode(latitude, longitude, signal),
  });

  const centerOnSearching = useCallback(() => {
    if (!pickup || !mapRef.current) return false;
    const ZOOM_OFFSET = 0.018;
    const boundingBox = [
      {
        latitude: pickup.latitude - ZOOM_OFFSET,
        longitude: pickup.longitude - ZOOM_OFFSET,
      },
      {
        latitude: pickup.latitude + ZOOM_OFFSET,
        longitude: pickup.longitude + ZOOM_OFFSET,
      },
    ];
    mapRef.current.fitToCoordinates(boundingBox, {
      edgePadding: {
        top: mapTopPadding,
        right: 0,
        bottom: 0,
        left: 0,
      },
      animated: true,
    });
    return true;
  }, [pickup, mapTopPadding]);

  const bottomPadding = useMemo(() => {
    if (tripPhase === TripPhase.LocationConfirmation || tripPhase === TripPhase.AddressSelection) {
      return 0;
    }
    return Math.max(effectiveHeight, BOTTOM_MIN_HEIGHT);
  }, [effectiveHeight, tripPhase]);

  useEffect(() => {
    if (mapTouchedRef.current) return;

    if (
      remainingRoute.length > 0 &&
      mapRef.current &&
      (tripPhase === TripPhase.Accepted || tripPhase === TripPhase.TripInProgress)
    ) {
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
  }, [remainingRoute, tripPhase, activeRide?.pickup, snappedDriverPosition, mapTopPadding]);

  const onRegionChangeComplete = async (newRegion: Region) => {
    if (isProgrammaticMoveRef.current) {
      isProgrammaticMoveRef.current = false;
      return;
    }

    if (tripPhase === TripPhase.LocationConfirmation) {
      const { latitude, longitude } = newRegion;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const address = await reverseGeocodeAsync({
          latitude,
          longitude,
          signal: controller.signal,
        });
        setConfirmingLocation({ latitude, longitude, address });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Reverse geocode failed", error);
        }
      }
    }
  };

  const onInitialLocationDetected = useCallback(
    (location: LocationPoint) => {
      if (!form.getValues("pickup")) {
        form.setValue(
          "pickup",
          {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address ?? undefined,
          },
          { shouldValidate: true }
        );
      }
    },
    [form]
  );

  const remainingRouteRef = useRef(remainingRoute);
  remainingRouteRef.current = remainingRoute;
  const snappedDriverPositionRef = useRef(snappedDriverPosition);
  snappedDriverPositionRef.current = snappedDriverPosition;
  const onCenterMap = useCallback(() => {
    const tripPhase = tripPhaseRef.current;
    mapTouchedRef.current = false;

    setImmediate(() => {
      if (activeRide?.status === RideResponseDtoStatusEnum.Searching) {
        centerOnSearching();
        return;
      }

      if (
        tripPhase === TripPhase.Accepted &&
        remainingRouteRef.current.length > 0 &&
        mapRef.current
      ) {
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

      if (
        tripPhase === TripPhase.DriverWaiting &&
        mapRef.current &&
        activeRide?.pickup &&
        snappedDriverPositionRef.current
      ) {
        mapRef.current.fitToCoordinates(
          [
            { latitude: activeRide.pickup.latitude, longitude: activeRide.pickup.longitude },
            snappedDriverPositionRef.current,
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

      if (
        (tripPhase === TripPhase.Accepted || tripPhase === TripPhase.DriverWaiting) &&
        decodedCoords.length > 0 &&
        mapRef.current
      ) {
        mapRef.current.fitToCoordinates(decodedCoords, {
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

      if (tripPhase === TripPhase.Request && mapRef.current) {
        if (decodedCoords.length > 0) {
          mapRef.current.fitToCoordinates(decodedCoords, {
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

        if (pickup && destination) {
          mapRef.current.fitToCoordinates([pickup, destination], {
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
      }

      if (tripPhase === TripPhase.LocationConfirmation) {
        const location = useLocationStore.getState().location;
        if (location && mapRef.current) {
          isProgrammaticMoveRef.current = true;
          mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: (WINDOW_WIDTH / WINDOW_HEIGHT) * 0.01,
          });
        }
      }
    });
  }, [
    activeRide?.status,
    activeRide?.pickup,
    centerOnSearching,
    decodedCoords,
    pickup,
    destination,
    mapTopPadding,
  ]);

  useEffect(() => {
    onCenterMap();
  }, [onCenterMap]);

  const mapBottomPadding = IGNORE_MAP_PADDING.includes(tripPhase) ? 0 : bottomPadding;

  return (
    <>
      <Stack.Screen options={{ headerShown: HEADER_SHOWN_PHASES.includes(tripPhase) }} />
      <MapController onInitialLocationDetected={onInitialLocationDetected} mapRef={mapRef}>
        {({ onMapReady }) => (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFillObject}
            provider={PROVIDER_GOOGLE}
            mapPadding={
              isMapReady ? { bottom: mapBottomPadding, top: 20, left: 20, right: 20 } : undefined
            }
            showsUserLocation={true}
            showsMyLocationButton={false}
            userLocationPriority="high"
            userLocationUpdateInterval={5000}
            showsCompass
            followsUserLocation={tripPhase === TripPhase.Home}
            userInterfaceStyle="light"
            rotateEnabled={false}
            onPanDrag={() => {
              mapTouchedRef.current = true;
              isProgrammaticMoveRef.current = false;
            }}
            onRegionChangeComplete={onRegionChangeComplete}
            onMapReady={() => {
              setIsMapReady(true);
              onMapReady();
            }}>
            {activeRide &&
              activeRide.status === RideResponseDtoStatusEnum.Searching &&
              pickup &&
              !showDriverNotFoundModal && (
                <>
                  <PulsingCircles maxRadius={2 * 1000} center={pickup} searching />
                  <Marker
                    coordinate={pickup}
                    tracksViewChanges={false}
                    anchor={{ x: 0.5, y: 1 }}
                    onPress={() => {}}>
                    <PickLocationIcon width={40} height={40} />
                  </Marker>
                </>
              )}

            {isDriverEnroute && activeRide?.pickup && activeRide?.destination && (
              <>
                {tripPhase !== TripPhase.TripInProgress ? (
                  <Marker
                    zIndex={2}
                    coordinate={
                      remainingRoute.length > 0
                        ? remainingRoute[remainingRoute.length - 1]
                        : {
                            latitude: activeRide.pickup.latitude,
                            longitude: activeRide.pickup.longitude,
                          }
                    }
                    anchor={{ x: 0.5, y: 1 }}
                    title={t("common.pickup")}>
                    <PickupMarker loading={profileLoading} avatar={profile?.avatar?.publicUrl} />
                  </Marker>
                ) : (
                  <Marker
                    zIndex={2}
                    coordinate={activeRide.destination}
                    anchor={{ x: 0.5, y: 0.5 }}
                    title={t("common.destination")}>
                    <DestinationMarker />
                  </Marker>
                )}
                {snappedDriverPosition && (
                  <Marker
                    zIndex={1}
                    coordinate={snappedDriverPosition}
                    anchor={{ x: 0.5, y: 0.5 }}
                    title={t("common.driver")}>
                    <CarMarker heading={rideNavigation?.driver.heading || 0} size={40} />
                  </Marker>
                )}
              </>
            )}
            {remainingRoute.length > 0 &&
              (tripPhase === TripPhase.Accepted || tripPhase === TripPhase.TripInProgress) && (
                <Polyline coordinates={remainingRoute} strokeWidth={4} strokeColor="#6828FF" />
              )}

            {pickup &&
              destination &&
              tripPhase !== TripPhase.LocationConfirmation &&
              activeRide?.status !== RideResponseDtoStatusEnum.Searching &&
              !isDriverEnroute && (
                <>
                  <Marker coordinate={pickup} anchor={{ x: 0.5, y: 1 }}>
                    <PickupMarker loading={profileLoading} avatar={profile?.avatar?.publicUrl} />
                  </Marker>
                  <Marker coordinate={destination} anchor={{ x: 0.5, y: 0.5 }}>
                    <DestinationMarker />
                  </Marker>
                  <Marker
                    coordinate={destination}
                    tracksViewChanges={false}
                    anchor={{ x: 0.5, y: 1 }}
                    onPress={() => {}}>
                    <PickLocationIcon width={40} height={40} />
                  </Marker>
                </>
              )}
            {decodedCoords.length > 0 &&
              tripPhase !== TripPhase.LocationConfirmation &&
              activeRide?.status !== RideResponseDtoStatusEnum.Searching &&
              !isDriverEnroute && (
                <Polyline coordinates={decodedCoords} strokeWidth={4} strokeColor="#6828FF" />
              )}
          </MapView>
        )}
      </MapController>
      {tripPhase === TripPhase.LocationConfirmation && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            paddingBottom: bottomPadding,
          }}
          pointerEvents="none">
          <PickLocationIcon width={40} height={40} style={{ marginBottom: 40 }} />
        </View>
      )}
      {tripPhase === TripPhase.Home && (
        <HomePhase
          pickup={pickup?.address}
          destination={destination?.address}
          onSearchPress={() => {
            tripPhasePush(TripPhase.AddressSelection);
          }}
          onRequestRide={() => {
            tripPhasePush(TripPhase.Request);
          }}
        />
      )}
      {tripPhase === TripPhase.Wallet && <WalletPhase />}
      {tripPhase === TripPhase.LocationConfirmation && (
        <LocationConfirmationPhase
          loading={loadingReverseGeocode}
          confirmingLocation={confirmingLocation}
          type={pickingField}
          onConfirm={() => {
            if (confirmingLocation) {
              form.setValue(
                pickingField,
                {
                  latitude: confirmingLocation.latitude,
                  longitude: confirmingLocation.longitude,
                  address: confirmingLocation.address ?? undefined,
                },
                { shouldValidate: true }
              );
            }
            const otherField = pickingField === "pickup" ? "destination" : "pickup";
            const otherLocation = form.getValues(otherField);

            const previousPhase = history[history.length - 1];
            if (
              previousPhase === TripPhase.AddressSelection &&
              otherLocation &&
              confirmingLocation
            ) {
              tripPhasePop(2);
            } else {
              tripPhaseBack();
            }
          }}
          onCancel={() => {
            if (abortControllerRef.current) {
              abortControllerRef.current.abort();
            }
            tripPhaseBack();
          }}
          onCenterMap={onCenterMap}
        />
      )}
      {VISIBLE_PHASES.includes(tripPhase) && (
        <TripBottomSheet
          tripPhase={tripPhase}
          setTripPhase={tripPhasePush}
          onHeightChange={(height) => {
            if (height !== bottomSheetHeight || lastPhaseRef.current !== tripPhase) {
              setBottomSheetHeight(height);
              lastPhaseRef.current = tripPhase;
            }
          }}
          onClose={() => {
            tripPhaseBack();
          }}
          onCenterMap={onCenterMap}
          onAddressSelected={() => {}}
          onMapPress={(targetField) => {
            const targetLocation = form.getValues(targetField);
            const otherField = targetField === "pickup" ? "destination" : "pickup";
            const otherLocation = form.getValues(otherField);

            const locationToAnimate =
              targetLocation || otherLocation || useLocationStore.getState().address;

            tripPhasePush(TripPhase.LocationConfirmation);
            setPickingField(targetField);

            if (locationToAnimate) {
              isProgrammaticMoveRef.current = true;
              mapRef.current?.animateToRegion({
                latitude: locationToAnimate.latitude,
                longitude: locationToAnimate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: (WINDOW_WIDTH / WINDOW_HEIGHT) * 0.01,
              });
              setConfirmingLocation({
                latitude: locationToAnimate.latitude,
                longitude: locationToAnimate.longitude,
                address: locationToAnimate.address || "",
              });
            }
          }}
        />
      )}
      {showDriverNotFoundModal && (
        <Modal
          isVisible={showDriverNotFoundModal}
          hideModalContentWhileAnimating
          useNativeDriver
          backdropTransitionOutTiming={0}
          hasBackdrop
          style={{ margin: 0, paddingTop: insets.top, paddingBottom: insets.bottom }}
          backdropOpacity={0.4}>
          <DriverNotFoundModal
            onTryAgain={handleDriverNotFoundTryAgain}
            onGoBack={handleDriverNotFoundDismiss}
          />
        </Modal>
      )}
      {showInsufficientBalanceModal && (
        <Modal
          isVisible={showInsufficientBalanceModal}
          hideModalContentWhileAnimating
          useNativeDriver
          backdropTransitionOutTiming={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={400}
          animationOutTiming={400}
          hasBackdrop
          style={{ margin: 0, paddingTop: insets.top, paddingBottom: insets.bottom }}
          backdropOpacity={0.4}>
          <InsufficientBalanceModal
            onUseAnotherMethod={handleInsufficientBalanceUseAnotherMethod}
          />
        </Modal>
      )}
      {showRideCancelledModal && (
        <Modal
          isVisible={showRideCancelledModal}
          hideModalContentWhileAnimating
          useNativeDriver
          backdropTransitionOutTiming={0}
          hasBackdrop
          style={{ margin: 0, paddingTop: insets.top, paddingBottom: insets.bottom }}
          backdropOpacity={0.4}>
          <TripStatusModal
            title={t("common.rideCancelled")}
            description={t("common.driverCancelledMessage")}
            image={AssetFiles.images["mascot-ride-not-found"]}
            buttonLabel={t("home.requestRide")}
            onPress={handleRideCancelledDismiss}
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
      <DriverArrivedModal />
    </>
  );
}
