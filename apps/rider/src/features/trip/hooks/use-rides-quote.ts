import { CreateRideQuoteDto, QueryKeys } from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { ridesApi } from "~/api";

interface UseRidesQuoteParams {
  startLat?: number;
  startLng?: number;
  startAddress?: string;
  endLat?: number;
  endLng?: number;
  endAddress?: string;
  enabled?: boolean;
}

export function useRidesQuote({
  startLat,
  startLng,
  startAddress,
  endLat,
  endLng,
  endAddress,
  enabled: enabledProp = true,
}: UseRidesQuoteParams) {
  const enabled = Boolean(startLat && startLng && endLat && endLng) && enabledProp;

  const request: CreateRideQuoteDto | null = enabled
    ? {
        start: {
          latitude: startLat!,
          longitude: startLng!,
          address: startAddress ?? "",
        },
        end: {
          latitude: endLat!,
          longitude: endLng!,
          address: endAddress ?? "",
        },
      }
    : null;

  return useQuery({
    queryKey: [QueryKeys.RIDES_QUOTE, startLat, startLng, startAddress, endLat, endLng, endAddress],
    queryFn: () =>
      ridesApi.rideQuotesControllerCreateRideQuote({
        createRideQuoteDto: request!,
      }),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
