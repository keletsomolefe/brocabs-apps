/**
 * Authentication Store
 *
 * Manages admin authentication state using Zustand with persistence.
 * Uses FusionAuth via the API's /auth/login endpoint.
 */

import type { UserProfileDto } from "@brocabs/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "./api";

export interface AuthState {
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          // Call API login endpoint with admin application type
          await authApi.loginControllerLogin({
            loginDto: {
              identifierType: "email",
              identifier: email,
              password,
              applicationType: "admin",
            },
          });

          // Fetch user profile after successful login
          const profileResponse = await authApi.authControllerGetProfile();

          // Verify user is admin
          if (profileResponse.data.type !== "admin") {
            set({
              isLoading: false,
              error: "Access denied. Admin privileges required.",
              isAuthenticated: false,
              user: null,
            });
            // Logout if not admin
            await authApi.authControllerLogout();
            return false;
          }

          set({
            user: profileResponse.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (err) {
          let errorMessage = "Login failed. Please check your credentials.";

          if (err instanceof Error) {
            errorMessage = err.message;
          }

          // Handle fetch/response errors
          if (err && typeof err === "object" && "response" in err) {
            const response = (err as { response: Response }).response;
            try {
              const body = await response.json();
              errorMessage = body.message || body.error || errorMessage;
            } catch {
              errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });

          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authApi.authControllerLogout();
        } catch {
          // Ignore logout errors - session may already be expired
        } finally {
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });

        try {
          const profileResponse = await authApi.authControllerGetProfile();

          // Only allow admin users
          if (profileResponse.data.type !== "admin") {
            set({
              ...initialState,
              isLoading: false,
            });
            return;
          }

          set({
            user: profileResponse.data,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          // Not authenticated or session expired
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "brocabs-admin-auth",
      partialize: (state) => ({
        // Only persist user data, not loading/error states
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

/**
 * Hook to get current user with type safety
 */
export function useCurrentUser() {
  return useAuthStore((state) => state.user);
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated);
}
