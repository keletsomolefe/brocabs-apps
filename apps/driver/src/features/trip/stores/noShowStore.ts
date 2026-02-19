import { create } from "zustand";

interface NoShowState {
  /** Whether the modal should be shown */
  shouldShowModal: boolean;
  /** Show the modal */
  showModal: () => void;
  /** Hide the modal */
  dismissModal: () => void;
}

export const useNoShowStore = create<NoShowState>((set) => ({
  shouldShowModal: false,

  showModal: () =>
    set({
      shouldShowModal: true,
    }),

  dismissModal: () =>
    set({
      shouldShowModal: false,
    }),
}));
