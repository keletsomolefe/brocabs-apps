import { QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { driversApi } from "~/api";

export const rideRequestsQueryOptions = queryOptions({
  queryKey: [QueryKeys.RIDE_REQUESTS],
  queryFn: async () => {
    return await driversApi.driverOffersControllerGetActiveOffers();
  },
});

export function useRideRequests() {
  return useQuery({ ...rideRequestsQueryOptions }).data!;
}
