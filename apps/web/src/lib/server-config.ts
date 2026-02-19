import { createServerFn } from "@tanstack/react-start";

/**
 * Server function to get public configuration values.
 * This allows us to access environment variables at runtime (SSR)
 * instead of requiring them at build time.
 */
export const getPublicConfig = createServerFn({ method: "GET" }).handler(
  async () => {
    return {
      googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "",
    };
  },
);
