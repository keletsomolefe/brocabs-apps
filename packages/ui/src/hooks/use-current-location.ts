import * as Location from "expo-location";
import { useCallback, useEffect, useRef } from "react";

import { useLocationStore } from "../stores/location-store";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface UseCurrentLocationOptions {
  /** Whether to start watching location automatically. Default: true */
  autoStart?: boolean;
  /** Location accuracy for watching. Default: BestForNavigation */
  accuracy?: Location.Accuracy;
  /** Time interval between updates in ms. Default: 50 */
  timeInterval?: number;
  /** Distance interval between updates in meters. Default: 0 */
  distanceInterval?: number;
  /** Callback fired only when watchPositionAsync receives a new location */
  onLocationUpdate?: (location: LocationData) => void;
}

export interface UseCurrentLocationReturn {
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
  startWatching: () => Promise<void>;
  stopWatching: () => void;
}

export function useCurrentLocation(
  options: UseCurrentLocationOptions = {},
): UseCurrentLocationReturn {
  const {
    autoStart = true,
    accuracy = Location.Accuracy.Balanced,
    timeInterval = 3000,
    distanceInterval = 0,
    onLocationUpdate,
  } = options;

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStartingRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const startWatchingRef = useRef<(() => Promise<void>) | undefined>(undefined);
  const onLocationUpdateRef = useRef(onLocationUpdate);
  onLocationUpdateRef.current = onLocationUpdate;

  const { setLocation, setLoading, setError } = useLocationStore.getState();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied");
        return false;
      }
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to request location permission",
      );
      return false;
    }
  }, [setError]);

  const stopWatching = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    retryCountRef.current = 0; // Reset retry count when stopping
  }, []);

  const startWatching = useCallback(async () => {
    // Prevent overlapping starts
    if (isStartingRef.current) return;
    isStartingRef.current = true;

    // CRITICAL: Create a stable retry function that doesn't change
    const retryFunction = async () => {
      if (!isMountedRef.current) return;

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission revoked");
        setLoading(false);
        return;
      }

      // Exponential backoff
      const delay = Math.min(
        2000 * Math.pow(1.5, retryCountRef.current),
        30000,
      );

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      retryTimeoutRef.current = setTimeout(() => {
        retryTimeoutRef.current = null;
        if (isMountedRef.current) {
          retryCountRef.current++;
          startWatchingRef.current?.();
        }
      }, delay);
    };

    try {
      if (!isMountedRef.current) return;

      // Clean up any existing subscription and pending retries
      stopWatching();
      setError(null);
      setLoading(true);

      const hasPermission = await requestPermission();
      if (!hasPermission || !isMountedRef.current) {
        setLoading(false);
        return;
      }

      // Get last known location instantly (cached, may be stale but fast)
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown && isMountedRef.current) {
          setLocation(lastKnown.coords);
        }
      } catch (e) {
        // Silent fail - last known might not be available
      }

      // Get a quick low-accuracy location first
      try {
        const quickLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
        if (isMountedRef.current) {
          setLocation(quickLocation.coords);
          setLoading(false); // Can stop loading if we have initial position
        }
      } catch (e) {
        // Silent fail - quick location might fail
      }

      if (!isMountedRef.current) {
        setLoading(false);
        return;
      }

      // Start watching for more accurate updates
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy,
          timeInterval,
          distanceInterval,
        },
        (newLocation) => {
          retryCountRef.current = 0; // Reset on success
          setLocation(newLocation.coords);
          setLoading(false);
          onLocationUpdateRef.current?.(newLocation.coords);
        },
        async (error: any) => {
          if (!isMountedRef.current) return;

          // Don't retry on permission errors
          if (error.code === "E_LOCATION_PERMISSION_DENIED") {
            setError("Location permission denied or revoked");
            setLoading(false);
            return;
          }

          // Use the stable retry function
          await retryFunction();
        },
      );
    } catch (err: any) {
      if (isMountedRef.current) {
        // Don't retry on permission errors
        if (err?.code === "E_LOCATION_PERMISSION_DENIED") {
          setError("Location permission denied or revoked");
          setLoading(false);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to get current location",
          );
          setLoading(false);
          // Use the stable retry function
          await retryFunction();
        }
      }
    } finally {
      isStartingRef.current = false;
    }
  }, [
    requestPermission,
    stopWatching,
    accuracy,
    timeInterval,
    distanceInterval,
    setError,
    setLoading,
    setLocation,
  ]);

  startWatchingRef.current = startWatching;

  const refreshLocation = useCallback(async () => {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc.coords);
    } catch {
      // ignore
    }
  }, [setLocation]);

  useEffect(() => {
    isMountedRef.current = true;

    if (autoStart) {
      startWatching();
    }

    return () => {
      isMountedRef.current = false;
      stopWatching();

      // Clean up any pending retry
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [autoStart]);

  return {
    requestPermission,
    refreshLocation,
    startWatching,
    stopWatching,
  };
}
