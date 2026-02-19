import { QueryKeys, RidesControllerGetRideHistoryStatusEnum } from "@brocabs/client";
import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ridesApi } from "~/api";

const RIDE_HISTORY_LIMIT = 10;

export const useRideHistory = (
  status: RidesControllerGetRideHistoryStatusEnum = RidesControllerGetRideHistoryStatusEnum.All
) => {
  return useInfiniteQuery({
    queryKey: [QueryKeys.RIDE_HISTORY, status],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      return ridesApi.ridesControllerGetRideHistory({
        status,
        limit: RIDE_HISTORY_LIMIT,
        cursor: pageParam,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.cursor as string | undefined;
    },
  });
};

export const rideHistoryByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QueryKeys.RIDE_HISTORY_DETAIL, id],
    queryFn: async () => {
      return ridesApi.ridesControllerGetRideDetail({ id });
    },
    enabled: !!id,
  });

export const useRideHistoryById = (id: string) => {
  return useQuery(rideHistoryByIdQueryOptions(id));
};
