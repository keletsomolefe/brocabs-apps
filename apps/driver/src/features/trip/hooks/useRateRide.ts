import { useMutation } from "@tanstack/react-query";
import { ridesApi } from "~/api";

interface RateRideParams {
  rideId: string;
  rating: number;
  comment?: string;
}

export const useRateRide = () => {
  return useMutation({
    mutationFn: ({ rideId, rating, comment }: RateRideParams) => {
      return ridesApi.rideRatingsControllerRateRide({
        id: rideId,
        rateRideDto: {
          rating,
          comment,
        },
      });
    },
  });
};
