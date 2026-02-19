import { QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const rideNavigationQueryOptions = (rideId?: string) =>
  queryOptions({
    queryKey: [QueryKeys.RIDE_NAVIGATION, rideId],
    queryFn: async () => {
      return await ridesApi.ridesControllerGetRideNavigation({ id: rideId! });
    },
    enabled: !!rideId,
  });

export function useRideNavigation(rideId?: string) {
  return useQuery(rideNavigationQueryOptions(rideId));
}
