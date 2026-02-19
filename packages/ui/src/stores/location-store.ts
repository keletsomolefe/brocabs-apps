import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LocationPoint {
  address?: string | null;
  latitude: number;
  longitude: number;
}

interface LocationState {
  location: LocationData | null;
  address: LocationPoint | null;
  loading: boolean;
  loadingAddress: boolean;
  error: string | null;
  setLocation: (location: LocationData | null) => void;
  setAddress: (address: LocationPoint | null) => void;
  setLoadingAddress: (loading: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLocationStore = create<LocationState>()(
  subscribeWithSelector(
    immer((set) => ({
      location: null,
      address: null,
      loading: true,
      loadingAddress: false,
      error: null,
      setLocation: (location) =>
        set((state) => {
          state.location = location;
        }),
      setAddress: (address) =>
        set((state) => {
          state.address = address;
        }),
      setLoadingAddress: (loadingAddress) =>
        set((state) => {
          state.loadingAddress = loadingAddress;
        }),
      setLoading: (loading) =>
        set((state) => {
          state.loading = loading;
        }),
      setError: (error) =>
        set((state) => {
          state.error = error;
        }),
    })),
  ),
);
