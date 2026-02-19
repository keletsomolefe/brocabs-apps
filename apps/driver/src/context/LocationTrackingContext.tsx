import { useLocationStore } from "@brocabs/ui/stores/location-store";
import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Subscription } from "react-native-background-geolocation";
import { useMqtt } from "~/context/MqttContext";
import { useUser } from "~/hooks/use-auth";
import { locationService, type CurrentLocation } from "~/services/location-service";
import { useDriverStatusStore } from "~/stores/driver-status-store";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

interface LocationTrackingContextProps {
  location: LocationData | null;
  isTracking: boolean;
  error: string | null;
  startTracking: () => Promise<void>;
  stopTracking: () => Promise<void>;
}

const LocationTrackingContext = createContext<LocationTrackingContextProps | null>(null);

const LOCATION_UPDATE_THROTTLE_MS = 2000;

export function LocationTrackingProvider({ children }: PropsWithChildren<unknown>) {
  const mqttContext = useMqtt();
  const mqttClient = mqttContext?.mqttClient;
  const { data: user } = useUser();
  const profileId = user?.profileId;

  const { location, loading, error } = useLocationStore();
  const { setLocation, setLoading, setError } = useLocationStore.getState();

  const subscriptionRef = useRef<Subscription | null>(null);
  const lastLocationUpdateTime = useRef(0);
  const [initialized, setInitialized] = useState(false);

  const publishLocation = useCallback(
    (locationData: LocationData) => {
      const isOnline = useDriverStatusStore.getState().isOnline;
      if (!isOnline) {
        return;
      }

      if (!mqttClient?.connected || !profileId) {
        return;
      }

      const topic = `driver/${profileId}/location-update`;
      const payload = {
        lat: locationData.latitude,
        lng: locationData.longitude,
        heading: locationData.heading ?? undefined,
        speed: locationData.speed ?? undefined,
        accuracy: locationData.accuracy ?? undefined,
      };

      mqttClient.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
        if (err) {
          console.error("Failed to publish location:", err);
        }
      });
    },
    [mqttClient, profileId]
  );

  const startTracking = useCallback(async () => {
    if (subscriptionRef.current) return;

    try {
      setLoading(true);
      setError(null);

      if (!initialized) {
        await locationService.initialize();
        setInitialized(true);
      }

      // Get initial position
      try {
        const { location: initialPos } = await locationService.getInitialPosition();
        setLocation({
          latitude: initialPos.latitude,
          longitude: initialPos.longitude,
        });
      } catch {
        // Initial position may fail, continue with subscription
      }

      subscriptionRef.current = locationService.onLocationChange(
        (current: CurrentLocation) => {
          const now = Date.now();
          if (now - lastLocationUpdateTime.current >= LOCATION_UPDATE_THROTTLE_MS) {
            const locationData: LocationData = {
              latitude: current.location.latitude,
              longitude: current.location.longitude,
            };
            setLocation(locationData);
            publishLocation(locationData);
            lastLocationUpdateTime.current = now;
          }
        },
        (_error) => {
          // Error handled silently
        }
      );

      await locationService.startGpsTracking();
      setLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start tracking");
      setLoading(false);
    }
  }, [initialized, publishLocation, setLocation, setLoading, setError]);

  const stopTracking = useCallback(async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    await locationService.stopGpsTracking();
  }, []);

  // Auto-start tracking when user is authenticated
  useEffect(() => {
    if (profileId) {
      void startTracking();
    }
  }, [profileId, startTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  return (
    <LocationTrackingContext.Provider
      value={{
        location,
        isTracking: !loading && location !== null,
        error,
        startTracking,
        stopTracking,
      }}>
      {children}
    </LocationTrackingContext.Provider>
  );
}

export const useLocationTracking = () => {
  const context = useContext(LocationTrackingContext);
  if (!context) {
    throw new Error("useLocationTracking must be used within a LocationTrackingProvider");
  }
  return context;
};
