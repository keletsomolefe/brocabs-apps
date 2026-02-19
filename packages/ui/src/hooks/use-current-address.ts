import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { useLocationStore, type LocationData } from "../stores/location-store";

const DISTANCE_THRESHOLD_METERS = 150;

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type ReverseGeocodeFn = (
  latitude: number,
  longitude: number,
) => Promise<string>;

/**
 * Hook that returns the current address based on the user's location.
 * Only triggers a new reverse geocode when the user moves more than 150 meters.
 *
 * @param reverseGeocode - Function to convert coordinates to an address string
 */
export const useCurrentAddress = (reverseGeocode: ReverseGeocodeFn) => {
  const [geocodeKey, setGeocodeKey] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null,
  );
  const lastGeocodedLocation = useRef<LocationData | null>(null);

  useEffect(() => {
    const initialLocation = useLocationStore.getState().location;
    if (initialLocation) {
      lastGeocodedLocation.current = initialLocation;
      setCurrentLocation(initialLocation);
      setGeocodeKey(1);
    }

    const unsubscribe = useLocationStore.subscribe((state) => {
      const location = state.location;
      if (!location) return;

      const last = lastGeocodedLocation.current;
      if (!last) {
        lastGeocodedLocation.current = location;
        setCurrentLocation(location);
        setGeocodeKey((k) => k + 1);
        return;
      }

      const distance = haversineDistance(
        last.latitude,
        last.longitude,
        location.latitude,
        location.longitude,
      );

      if (distance >= DISTANCE_THRESHOLD_METERS) {
        lastGeocodedLocation.current = location;
        setCurrentLocation(location);
        setGeocodeKey((k) => k + 1);
      }
    });

    return unsubscribe;
  }, []);

  return useQuery({
    queryKey: ["reverseGeocode", geocodeKey],
    queryFn: () =>
      reverseGeocode(currentLocation!.latitude, currentLocation!.longitude),
    enabled: !!currentLocation && geocodeKey > 0,
  });
};
