import { useEffect, useRef, useState } from "react";
import type { Subscription } from "react-native-background-geolocation";
import { useLocationStore } from "@brocabs/ui/stores/location-store";
import { locationService, type CurrentLocation } from "~/services/location-service";

const LOCATION_UPDATE_THROTTLE_MS = 2000;

export function useLocationSubscription() {
  const lastLocationUpdateTime = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const { setLocation } = useLocationStore.getState();

  useEffect(() => {
    let locationSubscription: Subscription | null = null;

    setIsLoading(true);
    locationService.initialize().then(() => {
      locationSubscription = locationService.onLocationChange(
        (current: CurrentLocation) => {
          const now = Date.now();
          if (now - lastLocationUpdateTime.current >= LOCATION_UPDATE_THROTTLE_MS) {
            setLocation({
              latitude: current.location.latitude,
              longitude: current.location.longitude,
            });
            lastLocationUpdateTime.current = now;
          }
        },
        (_error) => {
          // Error handled silently
        }
      );
      setIsLoading(false);
    });

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return { isLoading };
}
