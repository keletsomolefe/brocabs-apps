import {
  RideActionReasonsControllerListReasonsActionTypeEnum,
  RideActionReasonsControllerListReasonsActorRoleEnum,
} from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const useCancellationReasons = () => {
  return useQuery({
    queryKey: [
      "ride-action-reasons",
      RideActionReasonsControllerListReasonsActionTypeEnum.CancelRide,
      RideActionReasonsControllerListReasonsActorRoleEnum.Driver,
    ],
    queryFn: () =>
      ridesApi.rideActionReasonsControllerListReasons({
        actionType: RideActionReasonsControllerListReasonsActionTypeEnum.CancelRide,
        actorRole: RideActionReasonsControllerListReasonsActorRoleEnum.Driver,
      }),
  });
};
