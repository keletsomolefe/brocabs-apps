/**
 * TanStack Query Configuration
 *
 * Query client setup and query key constants for the admin dashboard.
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Query Keys
 * Centralized query key management for cache invalidation and prefetching
 */
export const QueryKeys = {
  // Auth
  PROFILE: ["profile"] as const,
  SESSION: ["session"] as const,

  // Dashboard Statistics
  DASHBOARD_STATS: ["dashboard", "stats"] as const,
  SYSTEM_OVERVIEW: ["dashboard", "overview"] as const,

  // Users
  USERS: ["users"] as const,
  USER_DETAIL: (id: string) => ["users", id] as const,

  // Rides
  RIDES: ["rides"] as const,
  RIDE_TYPES: ["ride-types"] as const,
  ACTIVE_RIDES: ["rides", "active"] as const,

  // Payments
  TRANSACTIONS: ["transactions"] as const,
  WALLET_BALANCE: ["wallet", "balance"] as const,

  // Drivers
  DRIVERS: ["drivers"] as const,
  DRIVER_DETAIL: (id: string) => ["drivers", id] as const,

  // Vehicles
  VEHICLE_MAKES: ["vehicle-makes"] as const,
  VEHICLE_MODELS: (makeId: string) => ["vehicle-models", makeId] as const,
  VEHICLE_VARIANTS: (modelId: string) => ["vehicle-variants", modelId] as const,
} as const;

/**
 * Mutation Keys
 * For tracking mutation state
 */
export const MutationKeys = {
  LOGIN: ["login"] as const,
  LOGOUT: ["logout"] as const,
  UPDATE_USER: ["update-user"] as const,
  APPROVE_DRIVER: ["approve-driver"] as const,
} as const;

/**
 * Default Query Client Configuration
 */
export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
};
