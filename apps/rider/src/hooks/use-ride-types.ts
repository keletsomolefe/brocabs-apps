import { QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { rideTypesApi } from "~/api";

export const rideTypesQueryOptions = queryOptions({
  queryKey: [QueryKeys.RIDER_TYPES],
  queryFn: async () => {
    return await rideTypesApi.rideTypesControllerListAllRideTypes();
  },
});

export function useRideTypes() {
  return useQuery(rideTypesQueryOptions);
}
