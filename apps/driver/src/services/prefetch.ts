import { queryClient } from "~/api";
import { activeRideQueryOptions } from "~/features/trip/hooks/use-ride";
import { paymentMethodsQueryOptions } from "~/hooks/use-payment-methods";
import { plansQueryOptions } from "~/hooks/use-plans";
import { rideNavigationQueryOptions } from "~/hooks/use-ride-navigation";
import { rideTypesQueryOptions } from "~/hooks/use-ride-types";

export async function prefetchAppResources(isReconnect = false) {
  const activeRidePromise = queryClient.fetchQuery(activeRideQueryOptions);

  const otherPromises = !isReconnect
    ? [
        queryClient.prefetchQuery(rideTypesQueryOptions),
        queryClient.prefetchQuery(paymentMethodsQueryOptions),
        queryClient.prefetchQuery(plansQueryOptions),
      ]
    : [];

  const [activeRide] = await Promise.all([activeRidePromise, ...otherPromises]);

  if (activeRide?.id) {
    await queryClient.prefetchQuery(rideNavigationQueryOptions(activeRide.id));
  }
}
