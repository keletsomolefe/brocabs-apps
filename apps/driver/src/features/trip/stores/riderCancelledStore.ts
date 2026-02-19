import { RideCancelledPayload } from "@brocabs/mqtt-envelope";
import { create } from "zustand";

interface RiderCancelledState {
  /** The cancelled ride data to show in the modal */
  cancelledRide: RideCancelledPayload | null;
  /** Whether the modal should be shown */
  shouldShowModal: boolean;
  /** Set the cancelled ride and show the modal */
  showCancelledModal: (payload: RideCancelledPayload) => void;
  /** Hide the modal and clear the data */
  dismissModal: () => void;
}

export const useRiderCancelledStore = create<RiderCancelledState>((set) => ({
  cancelledRide: null,
  shouldShowModal: false,

  showCancelledModal: (payload) =>
    set({
      cancelledRide: payload,
      shouldShowModal: true,
    }),

  dismissModal: () =>
    set({
      cancelledRide: null,
      shouldShowModal: false,
    }),
}));
