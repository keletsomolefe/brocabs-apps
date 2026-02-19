import { RideCompletedPayload } from "@brocabs/mqtt-envelope";
import { create } from "zustand";

interface RideCompletedState {
  /** The ride completed data to show in the modal */
  completedData: RideCompletedPayload | null;
  /** Whether the modal should be shown */
  shouldShowModal: boolean;
  /** Set the ride completed data and show the modal */
  showModal: (payload: RideCompletedPayload) => void;
  /** Hide the modal and clear the data */
  dismissModal: () => void;
}

export const useRideCompletedStore = create<RideCompletedState>((set) => ({
  completedData: null,
  shouldShowModal: false,

  showModal: (payload) =>
    set({
      completedData: payload,
      shouldShowModal: true,
    }),

  dismissModal: () =>
    set({
      completedData: null,
      shouldShowModal: false,
    }),
}));
