import { QueryKeys } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const useStartRide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rideId: string) => {
      return ridesApi.ridesControllerStartRide({ id: rideId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });
    },
  });
};
