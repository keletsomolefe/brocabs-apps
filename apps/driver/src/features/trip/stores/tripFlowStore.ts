import { createTripFlowStore } from "@brocabs/ui";
import { TripPhase } from "../trip-phase";

export const useTripFlow = createTripFlowStore<TripPhase>(TripPhase.RidesListMap);
