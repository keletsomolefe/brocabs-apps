import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
  previouslyAuthenticated: boolean;
  isHydrated: boolean;
};

type Actions = {
  setPreviouslyAuthenticated: (value: boolean) => void;
  setIsHydrated: (value: boolean) => void;
};

export const useAppStore = create<State & Actions>()(
  immer(
    persist(
      (set) => ({
        previouslyAuthenticated: false,
        isHydrated: false,
        setPreviouslyAuthenticated: (value) =>
          set((state) => {
            state.previouslyAuthenticated = value;
          }),
        setIsHydrated: (value) =>
          set((state) => {
            state.isHydrated = value;
          }),
      }),
      {
        name: "app-storage",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({ previouslyAuthenticated: state.previouslyAuthenticated }),
        onRehydrateStorage: () => (state) => {
          state?.setIsHydrated(true);
        },
      }
    )
  )
);
