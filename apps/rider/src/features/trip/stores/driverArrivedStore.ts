import { create } from "zustand";

interface DriverArrivedState {
  isVisible: boolean;
  showModal: () => void;
  dismissModal: () => void;
}

export const useDriverArrivedStore = create<DriverArrivedState>((set) => ({
  isVisible: false,
  showModal: () => set({ isVisible: true }),
  dismissModal: () => set({ isVisible: false }),
}));
