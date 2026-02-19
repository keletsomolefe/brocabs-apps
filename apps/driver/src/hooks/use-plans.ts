import { QueryKeys } from "@brocabs/client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { subscriptionsApi } from "~/api";

export const plansQueryOptions = queryOptions({
  queryKey: [QueryKeys.PLANS],
  queryFn: () => subscriptionsApi.subscriptionControllerGetPlans(),
});

export function usePlans() {
  return useQuery(plansQueryOptions);
}
