/**
 * API Client Configuration
 *
 * Centralized API client setup using the generated @brocabs/client SDK.
 * This mirrors the mobile app's pattern for consistency.
 */

import {
  AdminApi,
  AdminSubscriptionsApi,
  AuthApi,
  BroScholarApi,
  CardsPaymentsApi,
  Configuration,
  ContentApi,
  FilesApi,
  OperatingZonesApi,
  OtpApi,
  PaymentsApi,
  RideTypesApi,
  SettingsApi,
  VehiclesApi,
  WalletApi,
} from "@brocabs/client";

/**
 * Server-side base path for API calls
 * In SSR context, we need the full URL
 */
const getBasePath = (): string => {
  // During SSR, use the internal service URL
  // During client-side, use relative path
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || "http://localhost:3042/api";
  }
  return "/api";
};

/**
 * API Configuration with cookie credentials
 * The admin dashboard uses session-based auth via FusionAuth
 */
const createConfiguration = (): Configuration => {
  return new Configuration({
    basePath: getBasePath(),
    credentials: "include", // Include cookies for session auth
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Singleton configuration instance
const configuration = createConfiguration();

// API Client Instances
export const adminApi = new AdminApi(configuration);
export const adminSubscriptionsApi = new AdminSubscriptionsApi(configuration);
export const authApi = new AuthApi(configuration);
export const broScholarApi = new BroScholarApi(configuration);
export const contentApi = new ContentApi(configuration);
export const operatingZonesApi = new OperatingZonesApi(configuration);
export const otpApi = new OtpApi(configuration);
export const filesApi = new FilesApi(configuration);
export const rideTypesApi = new RideTypesApi(configuration);
export const walletApi = new WalletApi(configuration);
export const cardsApi = new CardsPaymentsApi(configuration);
export const paymentsApi = new PaymentsApi(configuration);
export const settingsApi = new SettingsApi(configuration);
export const vehiclesApi = new VehiclesApi(configuration);

// Re-export types for convenience
export type {
  AdminDriverListResponseDto,
  AdminDriverResponseDto,
  AdminPaymentListResponseDto,
  AdminPaymentResponseDto,
  AdminPlanListResponseDto,
  AdminPlanResponseDto,
  AdminRideListResponseDto,
  AdminRideResponseDto,
  AdminStatsResponseDto,
  AdminSubscriptionListResponseDto,
  AdminSubscriptionResponseDto,
  AdminSubscriptionStatsDto,
  AdminUserListResponseDto,
  AdminUserResponseDto,
  BulkApproveSubscriptionsDto,
  ContentListResponseDto,
  ContentResponseDto,
  CreateContentDto,
  CreateOperatingZoneDto,
  CreatePlanDto,
  ExtendSubscriptionDto,
  LoginDto,
  LoginResponseDto,
  OperatingZoneResponseDto,
  PaymentListResponseDto,
  PaymentResponseDto,
  ProfileResponseDto,
  RideTypeListResponseDto,
  RideTypeResponseDto,
  UpdateContentDto,
  UpdateOperatingZoneDto,
  UpdatePlanDto,
  UpdateRideTypeDto,
  UpdateSubscriptionStatusDto,
  VehicleMakeResponseDto,
  VehicleModelResponseDto,
  VehicleVariantResponseDto,
  PaginatedMakesResponseDto,
  PaginatedModelsResponseDto,
  WalletBalanceDto,
} from "@brocabs/client";
