import { useCurrentAddress as useCurrentAddressBase } from "@brocabs/ui/hooks/use-current-address";
import { useLocationStore, type LocationData } from "@brocabs/ui/stores/location-store";
import { reverseGeocode } from "~/services/map";

export { useLocationStore, type LocationData };

/**
 * Hook that returns the current address based on the user's location.
 * Uses the shared hook from @brocabs/ui with the app-specific reverseGeocode function.
 */
export const useCurrentAddress = () => useCurrentAddressBase(reverseGeocode);
