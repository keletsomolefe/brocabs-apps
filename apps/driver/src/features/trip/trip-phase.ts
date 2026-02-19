export enum TripPhase {
  StartTrip = "start-trip",
  DriverWaiting = "driver-waiting",
  DriverWaitingTimeout = "driver-waiting-timeout",
  DriverEnroute = "driver-enroute",
  TripInProgress = "trip-inprogress",
  RidesList = "rides-list",
  RidesListMap = "rides-list-map",
  Wallet = "wallet",
}

export const HOME_PHASES = [TripPhase.RidesList, TripPhase.Wallet];
