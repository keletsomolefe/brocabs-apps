import { CompleteRideDto } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ridesApi } from "~/api";
import { useRideCompletedStore } from "~/features/trip/stores/rideCompletedStore";

interface EndTripPayload {
  rideId: string;
  reasonCode?: string;
  otherReasonText?: string;
}

export const useEndTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rideId, reasonCode, otherReasonText }: EndTripPayload) => {
      const completeRideDto: CompleteRideDto = {};
      if (reasonCode) {
        completeRideDto.reasonCode = reasonCode;
      }
      if (otherReasonText) {
        completeRideDto.otherReasonText = otherReasonText;
      }
      return ridesApi.ridesControllerCompleteRide({ id: rideId, completeRideDto });
    },
    onSuccess: (data) => {
      // Show rating modal instead of invalidating query immediately
      // The modal will handle query invalidation when dismissed
      const price = typeof data.actualPrice === "number" ? data.actualPrice : 0;
      useRideCompletedStore.getState().showModal({
        rideId: data.id,
        completedAt: new Date().toISOString(),
        actualPrice: price,
      });
    },
  });
};
