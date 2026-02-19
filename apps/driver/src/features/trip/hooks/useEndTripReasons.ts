import {
  RideActionReasonsControllerListReasonsActionTypeEnum,
  RideActionReasonsControllerListReasonsActorRoleEnum,
} from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { ridesApi } from "~/api";

export const useEndTripReasons = () => {
  return useQuery({
    queryKey: [
      "ride-action-reasons",
      RideActionReasonsControllerListReasonsActionTypeEnum.EndTrip,
      RideActionReasonsControllerListReasonsActorRoleEnum.Driver,
    ],
    queryFn: () =>
      ridesApi.rideActionReasonsControllerListReasons({
        actionType: RideActionReasonsControllerListReasonsActionTypeEnum.EndTrip,
        actorRole: RideActionReasonsControllerListReasonsActorRoleEnum.Driver,
      }),
  });
};
