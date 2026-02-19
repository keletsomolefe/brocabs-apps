import { QueryKeys } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const useAcceptRide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rideId: string) => {
      return ridesApi.ridesControllerAcceptRide({ id: rideId });
    },
    onSuccess: () => {
      // Invalidate ride requests to remove the accepted ride from the list
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_REQUESTS] });
      // Invalidate active ride query to refetch the newly accepted ride
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
    },
  });
};
