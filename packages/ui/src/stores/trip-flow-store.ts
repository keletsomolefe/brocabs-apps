import { create } from "zustand";

interface TripFlowState<T> {
  phase: T;
  history: T[];
  push: (phase: T) => void;
  back: () => void;
  pop: (count?: number) => void;
  reset: () => void;
  getPreviousPhase: () => T | undefined;
}

export const createTripFlowStore = <T>(initialPhase: T) =>
  create<TripFlowState<T>>((set, get) => ({
    phase: initialPhase,
    history: [],

    push: (phase) =>
      set((state) => {
        // Prevent pushing the same phase twice
        if (state.phase === phase) return state;

        return {
          history: [...state.history, state.phase],
          phase,
        };
      }),

    back: () =>
      set((state) => {
        if (state.history.length === 0) return state;

        const newHistory = [...state.history];
        const prev = newHistory.pop();

        return {
          phase: prev!,
          history: newHistory,
        };
      }),

    pop: (count = 1) =>
      set((state) => {
        if (state.history.length === 0) return state;

        const newHistory = [...state.history];
        let prev = state.phase;

        const steps = Math.min(count, newHistory.length);
        for (let i = 0; i < steps; i++) {
          prev = newHistory.pop()!;
        }

        return {
          phase: prev,
          history: newHistory,
        };
      }),

    reset: () =>
      set({
        phase: initialPhase,
        history: [],
      }),

    getPreviousPhase: () => {
      const history = get().history;
      return history[history.length - 1];
    },
  }));
