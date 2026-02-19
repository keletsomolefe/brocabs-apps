import { QueryKeys } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const useEndTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rideId: string) => {
      return ridesApi.ridesControllerCompleteRide({ id: rideId, completeRideDto: {} });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
    },
  });
};
