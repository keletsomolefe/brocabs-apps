import { AuthorizeRideDto, CreateRideDto, QueryKeys, ResponseError } from "@brocabs/client";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export function useCreateRideRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QueryKeys.RIDE],
    mutationFn: async (createRideDto: CreateRideDto) => {
      return ridesApi.ridesControllerCreateRide({ createRideDto });
    },
    onSuccess: (data) => {
      queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], data);
    },
  });
}

export function useAuthorizeRide() {
  return useMutation({
    mutationKey: ["authorize-ride"],
    mutationFn: async (authorizeRideDto: AuthorizeRideDto) => {
      return ridesApi.ridesControllerAuthorizeRide({ authorizeRideDto });
    },
  });
}

export function useCancelRide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cancel-ride"],
    mutationFn: async ({
      id,
      reasonCode,
      otherReasonText,
    }: {
      id: string;
      reasonCode?: string;
      otherReasonText?: string;
    }) => {
      return ridesApi.ridesControllerCancelRide({
        id,
        cancelRideDto: { reasonCode, otherReasonText },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
      queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], null);
    },
  });
}

export const activeRideQueryOptions = queryOptions({
  queryKey: [QueryKeys.ACTIVE_RIDE],
  queryFn: async () => {
    try {
      return await ridesApi.ridesMeControllerGetActiveRide();
    } catch (error) {
      if (error instanceof ResponseError && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },
  retry: false,
});

export function useActiveRide() {
  return useQuery(activeRideQueryOptions);
}

export function useRetryRideRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["retry-ride"],
    mutationFn: async (id: string) => {
      return ridesApi.ridesControllerRetryRide({ id });
    },
    onSuccess: (data) => {
      queryClient.setQueryData([QueryKeys.ACTIVE_RIDE], data);
    },
  });
}
