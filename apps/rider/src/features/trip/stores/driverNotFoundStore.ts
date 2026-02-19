import { DriverNotFoundPayload } from "@brocabs/mqtt-envelope";
import { create } from "zustand";

interface DriverNotFoundState {
  /** The driver not found data to show in the modal */
  notFoundData: DriverNotFoundPayload | null;
  /** Whether the modal should be shown */
  shouldShowModal: boolean;
  /** Set the driver not found data and show the modal */
  showModal: (payload: DriverNotFoundPayload) => void;
  /** Hide the modal and clear the data */
  dismissModal: () => void;
}

export const useDriverNotFoundStore = create<DriverNotFoundState>((set) => ({
  notFoundData: null,
  shouldShowModal: false,

  showModal: (payload) =>
    set({
      notFoundData: payload,
      shouldShowModal: true,
    }),

  dismissModal: () =>
    set({
      notFoundData: null,
      shouldShowModal: false,
    }),
}));
