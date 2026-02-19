import { createApiClients, createNativeConfiguration, createQueryClient } from "@brocabs/api";
import { AppConfig } from "./config";

const basePath = AppConfig.EXPO_PUBLIC_API_BASE_PATH ?? "http://localhost:3042/api";

export const queryClient = createQueryClient();

const configuration = createNativeConfiguration(basePath);

export const {
  authApi,
  broScholarApi,
  cardsApi,
  chatApi,
  contentApi,
  devicesApi,
  filesApi,
  institutionsApi,
  notificationSettingsApi,
  notificationsApi,
  otpApi,
  paymentMethodsApi,
  profilesApi,
  rideTypesApi,
  ridesApi,
  walletApi,
  favoriteAddressesApi,
  sosContactsApi,
} = createApiClients(configuration);
