import { RideRequestPayload } from "@brocabs/mqtt-envelope";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface TripRequest extends RideRequestPayload {
  /** Estimated time to pickup (formatted string) */
  estimatedTime: string;
  /** Distance from driver to pickup (formatted string) */
  distance: string;
  /** Timestamp when the request was received locally */
  receivedAt: number;
}

type State = {
  tripRequests: TripRequest[];
};

type Actions = {
  addTripRequest: (payload: RideRequestPayload) => void;
  removeTripRequest: (rideId: string) => void;
  clearTripRequests: () => void;
};

export const useTripRequestStore = create<State & Actions>()(
  immer((set) => ({
    tripRequests: [],

    addTripRequest: (payload) =>
      set((state) => {
        // Avoid duplicates
        if (state.tripRequests.some((r) => r.rideId === payload.rideId)) {
          return;
        }

        const tripRequest: TripRequest = {
          ...payload,
          // Format display values from payload data
          estimatedTime: `${Math.ceil(payload.distanceKm * 2)} min`,
          distance: `${payload.distanceKm.toFixed(1)} km`,
          receivedAt: Date.now(),
        };

        state.tripRequests.unshift(tripRequest);
      }),

    removeTripRequest: (rideId) =>
      set((state) => {
        state.tripRequests = state.tripRequests.filter((r) => r.rideId !== rideId);
      }),

    clearTripRequests: () =>
      set((state) => {
        state.tripRequests = [];
      }),
  }))
);
