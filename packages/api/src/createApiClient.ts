import {
  AuthApi,
  BroScholarApi,
  CardsPaymentsApi,
  ChargebeeApi,
  ChatApi,
  Configuration,
  ContentApi,
  DevicesApi,
  DriversApi,
  FavoriteAddressesApi,
  FilesApi,
  InstitutionsApi,
  NotificationsApi,
  NotificationSettingsApi,
  OperatingZonesApi,
  OtpApi,
  PaymentMethodsApi,
  PaymentsApi,
  ProfilesApi,
  RidesApi,
  RideTypesApi,
  SettingsApi,
  SOSContactsApi,
  SubscriptionsApi,
  VehiclesApi,
  WalletApi,
} from "@brocabs/client";

export type ApiClients = {
  otpApi: OtpApi;
  authApi: AuthApi;
  broScholarApi: BroScholarApi;
  chargebeeApi: ChargebeeApi;
  driversApi: DriversApi;
  filesApi: FilesApi;
  rideTypesApi: RideTypesApi;
  walletApi: WalletApi;
  cardsApi: CardsPaymentsApi;
  paymentsApi: PaymentsApi;
  paymentMethodsApi: PaymentMethodsApi;
  profilesApi: ProfilesApi;
  contentApi: ContentApi;
  chatApi: ChatApi;
  devicesApi: DevicesApi;
  institutionsApi: InstitutionsApi;
  operatingZonesApi: OperatingZonesApi;
  ridesApi: RidesApi;
  settingsApi: SettingsApi;
  sosContactsApi: SOSContactsApi;
  subscriptionsApi: SubscriptionsApi;
  notificationSettingsApi: NotificationSettingsApi;
  notificationsApi: NotificationsApi;
  favoriteAddressesApi: FavoriteAddressesApi;
  vehiclesApi: VehiclesApi;
};

export function createApiClients(config: Configuration): ApiClients {
  return {
    otpApi: new OtpApi(config),
    authApi: new AuthApi(config),
    broScholarApi: new BroScholarApi(config),
    chargebeeApi: new ChargebeeApi(config),
    driversApi: new DriversApi(config),
    filesApi: new FilesApi(config),
    rideTypesApi: new RideTypesApi(config),
    walletApi: new WalletApi(config),
    cardsApi: new CardsPaymentsApi(config),
    paymentsApi: new PaymentsApi(config),
    paymentMethodsApi: new PaymentMethodsApi(config),
    profilesApi: new ProfilesApi(config),
    contentApi: new ContentApi(config),
    chatApi: new ChatApi(config),
    devicesApi: new DevicesApi(config),
    institutionsApi: new InstitutionsApi(config),
    operatingZonesApi: new OperatingZonesApi(config),
    ridesApi: new RidesApi(config),
    settingsApi: new SettingsApi(config),
    sosContactsApi: new SOSContactsApi(config),
    subscriptionsApi: new SubscriptionsApi(config),
    notificationSettingsApi: new NotificationSettingsApi(config),
    notificationsApi: new NotificationsApi(config),
    favoriteAddressesApi: new FavoriteAddressesApi(config),
    vehiclesApi: new VehiclesApi(config),
  };
}
