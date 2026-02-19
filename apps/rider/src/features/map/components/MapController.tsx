import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import MapView from "react-native-maps";
import { LocationPoint } from "~/features/trip/context/ride-context";
import { useCurrentLocation } from "~/features/trip/hooks/useCurrentLocation";
import {
  fetchCurrentAddress,
  LocationData,
  useLocationStore,
} from "../../trip/stores/locationStore";

const { height, width } = Dimensions.get("window");

interface MapControllerRenderProps {
  onMapReady: () => void;
}

interface Props {
  children: (props: MapControllerRenderProps) => React.ReactNode;
  onInitialLocationDetected?: (location: LocationPoint) => void;
  mapRef?: React.RefObject<MapView | null>;
}

export function MapController({ children, onInitialLocationDetected, mapRef }: Props) {
  useCurrentLocation();
  const [mapReady, setMapReady] = useState(false);
  const initialLocationSet = useRef(false);

  /** Initial Location → Map */
  useEffect(() => {
    if (!mapReady) return;

    const handleLocation = (location: LocationData | null) => {
      if (!location || initialLocationSet.current) return;

      const latitudeDelta = 0.01;
      const longitudeDelta = (width / height) * latitudeDelta;

      mapRef?.current?.setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta,
        longitudeDelta,
      });

      initialLocationSet.current = true;

      fetchCurrentAddress().then((address) => {
        if (onInitialLocationDetected && address) {
          onInitialLocationDetected(address);
        }
      });
    };

    const currentLocation = useLocationStore.getState().location;
    handleLocation(currentLocation);

    const unsubscribe = useLocationStore.subscribe((state) => {
      handleLocation(state.location);
    });

    return unsubscribe;
  }, [mapReady, onInitialLocationDetected, mapRef]);

  const onMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  return (
    <>
      {children({
        onMapReady,
      })}
    </>
  );
}
