import { useCurrentAddress as useCurrentAddressBase } from "@brocabs/ui/hooks/use-current-address";
import { useLocationStore } from "@brocabs/ui/stores/location-store";
import { queryClient } from "~/api";
import { reverseGeocode } from "~/services/map";

// Re-export the shared store and types
export {
  useLocationStore,
  type LocationData,
  type LocationPoint,
} from "@brocabs/ui/stores/location-store";

/**
 * Hook that returns the current address based on the user's location.
 * Uses the shared hook from @brocabs/ui with the app-specific reverseGeocode function.
 */
export const useCurrentAddress = () => useCurrentAddressBase(reverseGeocode);

/**
 * Fetches the current address based on the location in the store
 * and updates the store with the result
 */
export async function fetchCurrentAddress() {
  const { location, setAddress, setLoadingAddress } = useLocationStore.getState();
  if (!location) return;

  setLoadingAddress(true);

  try {
    const address = await queryClient.fetchQuery({
      queryKey: ["reverseGeocode", location.latitude, location.longitude],
      queryFn: () => reverseGeocode(location.latitude, location.longitude),
      staleTime: Infinity,
    });

    const locationPoint = {
      address: address,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    setAddress(locationPoint);
    return locationPoint;
  } finally {
    setLoadingAddress(false);
  }
}
