import { create } from "zustand";
import { driversApi } from "~/api";

interface DriverStatusState {
  isOnline: boolean;
  setOnline: (status: boolean) => void;
  toggleOnline: () => Promise<void>;
  fetchStatus: () => Promise<void>;
}

export const useDriverStatusStore = create<DriverStatusState>((set, get) => ({
  isOnline: false,
  setOnline: (status) => set({ isOnline: status }),
  fetchStatus: async () => {
    try {
      const res = await driversApi.driverStatusControllerGetStatus();
      if (res && res.status) {
        set({ isOnline: res.status === "online" });
      }
    } catch (err) {
      console.error("Failed to fetch driver status", err);
    }
  },
  toggleOnline: async () => {
    const current = get().isOnline;
    const next = !current;
    set({ isOnline: next }); // Optimistic update
    try {
      if (next) {
        await driversApi.driverStatusControllerGoOnline();
      } else {
        await driversApi.driverStatusControllerGoOffline();
      }
    } catch (err) {
      console.error("Failed to toggle driver status", err);
      set({ isOnline: current }); // Revert on failure
    }
  },
}));
