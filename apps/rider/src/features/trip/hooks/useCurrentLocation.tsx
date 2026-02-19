import {
  useCurrentLocation as useSharedCurrentLocation,
  type LocationData,
} from "@brocabs/ui/hooks/use-current-location";
import { useEffect } from "react";
import { useLocationStore } from "../stores/locationStore";

export { type LocationData };

interface UseCurrentLocationReturn {
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export function useCurrentLocation(): UseCurrentLocationReturn {
  const setLocation = useLocationStore((state) => state.setLocation);
  const setLoading = useLocationStore((state) => state.setLoading);
  const setError = useLocationStore((state) => state.setError);
  const { location, loading, error } = useLocationStore();

  const { requestPermission, refreshLocation: sharedRefreshLocation } = useSharedCurrentLocation();

  // Sync shared hook state to the store
  useEffect(() => {
    if (location) {
      setLocation(location);
    }
  }, [location, setLocation]);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  const refreshLocation = async () => {
    await sharedRefreshLocation();
  };

  return {
    requestPermission,
    refreshLocation,
  };
}
