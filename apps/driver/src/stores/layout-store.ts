import { create } from "zustand";

interface LayoutState {
  homeHeaderHeight: number;
  setHomeHeaderHeight: (height: number) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  homeHeaderHeight: 0,
  setHomeHeaderHeight: (height) => set({ homeHeaderHeight: height }),
}));
