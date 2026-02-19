import { QueryKeys } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const useRejectRide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rideId: string) => {
      return ridesApi.ridesControllerRejectRide({ id: rideId });
    },
    onSuccess: () => {
      // Invalidate ride requests to refetch the updated list
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_REQUESTS] });
    },
  });
};
