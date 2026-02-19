import { queryClient } from "~/api";
import { activeRideQueryOptions } from "~/features/trip/hooks/use-ride";
import { paymentMethodsQueryOptions } from "~/hooks/use-payment-methods";
import { rideNavigationQueryOptions } from "~/hooks/use-ride-navigation";
import { rideTypesQueryOptions } from "~/hooks/use-ride-types";
import { riderProfileQueryOptions } from "~/hooks/use-rider-profile";

export async function prefetchAppResources(isReconnect = false) {
  const activeRidePromise = queryClient.fetchQuery(activeRideQueryOptions);

  const otherPromises = !isReconnect
    ? [
        queryClient.prefetchQuery(riderProfileQueryOptions),
        queryClient.prefetchQuery(rideTypesQueryOptions),
        queryClient.prefetchQuery(paymentMethodsQueryOptions),
      ]
    : [];

  const [activeRide] = await Promise.all([activeRidePromise, ...otherPromises]);

  if (activeRide?.id) {
    await queryClient.prefetchQuery(rideNavigationQueryOptions(activeRide.id));
  }
}
