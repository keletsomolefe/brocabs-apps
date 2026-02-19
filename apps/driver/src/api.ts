import { createApiClients, createNativeConfiguration, createQueryClient } from "@brocabs/api";
import { AppConfig } from "./config";

const basePath = AppConfig.EXPO_PUBLIC_API_BASE_PATH ?? "http://localhost:3042/api";

export const queryClient = createQueryClient();

const configuration = createNativeConfiguration(basePath);

export const {
  authApi,
  cardsApi,
  chargebeeApi,
  chatApi,
  contentApi,
  devicesApi,
  driversApi,
  filesApi,
  notificationSettingsApi,
  notificationsApi,
  otpApi,
  operatingZonesApi,
  paymentsApi,
  paymentMethodsApi,
  profilesApi,
  rideTypesApi,
  ridesApi,
  settingsApi,
  subscriptionsApi,
  walletApi,
  favoriteAddressesApi,
  sosContactsApi,
  vehiclesApi,
} = createApiClients(configuration);
