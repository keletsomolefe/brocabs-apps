import { create } from "zustand";

interface InsufficientBalanceState {
  /** Whether the modal should be shown */
  shouldShowModal: boolean;
  /** Show the modal */
  showModal: () => void;
  /** Hide the modal */
  dismissModal: () => void;
}

export const useInsufficientBalanceStore = create<InsufficientBalanceState>((set) => ({
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
