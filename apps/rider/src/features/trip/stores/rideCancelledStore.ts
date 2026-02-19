import { RideCancelledPayload } from "@brocabs/mqtt-envelope";
import { create } from "zustand";

interface RideCancelledState {
  /** The ride cancelled data to show in the modal */
  cancelledData: RideCancelledPayload | null;
  /** Whether the modal should be shown */
  shouldShowModal: boolean;
  /** Set the ride cancelled data and show the modal */
  showModal: (payload: RideCancelledPayload) => void;
  /** Hide the modal and clear the data */
  dismissModal: () => void;
}

export const useRideCancelledStore = create<RideCancelledState>((set) => ({
  cancelledData: null,
  shouldShowModal: false,

  showModal: (payload) =>
    set({
      cancelledData: payload,
      shouldShowModal: true,
    }),

  dismissModal: () =>
    set({
      cancelledData: null,
      shouldShowModal: false,
    }),
}));
