import { create } from "zustand";

interface ReconnectState {
  shouldRefresh: boolean;
  triggerReconnect: () => void;
  reset: () => void;
}

export const useReconnectStore = create<ReconnectState>((set) => ({
  shouldRefresh: false,
  triggerReconnect: () => set({ shouldRefresh: true }),
  reset: () => set({ shouldRefresh: false }),
}));
