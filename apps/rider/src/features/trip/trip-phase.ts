import { Dimensions } from "react-native";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

export enum TripPhase {
  Home = "home",
  AddressSelection = "address-selection",
  LocationConfirmation = "location-confirmation",
  Request = "request",
  Confirm = "confirm",
  Payment = "payment",
  Complete = "complete",
  Accepted = "accepted",
  Searching = "searching",
  DriverWaiting = "driver-waiting",
  TripInProgress = "trip-in-progress",
  Wallet = "wallet",
}

export const PhaseSnapPoints = {
  [TripPhase.Home]: [WINDOW_HEIGHT * 0.9],
  [TripPhase.Wallet]: [WINDOW_HEIGHT * 0.9],
  [TripPhase.AddressSelection]: [WINDOW_HEIGHT * 0.9],
  [TripPhase.LocationConfirmation]: [150],
  [TripPhase.Request]: undefined,
  [TripPhase.Confirm]: [300, 600],
  [TripPhase.Payment]: [300, 600],
  [TripPhase.Complete]: [300, 600],
  [TripPhase.Accepted]: undefined,
  [TripPhase.Searching]: undefined,
  [TripPhase.DriverWaiting]: undefined,
  [TripPhase.TripInProgress]: undefined,
};

export const VISIBLE_PHASES = [
  TripPhase.Request,
  TripPhase.AddressSelection,
  TripPhase.Accepted,
  TripPhase.Searching,
  TripPhase.DriverWaiting,
  TripPhase.TripInProgress,
];

export const PhaseDynamicSizing = {
  [TripPhase.Home]: false,
  [TripPhase.AddressSelection]: true,
  [TripPhase.LocationConfirmation]: true,
  [TripPhase.Request]: true,
  [TripPhase.Confirm]: false,
  [TripPhase.Payment]: false,
  [TripPhase.Complete]: false,
  [TripPhase.Accepted]: true,
  [TripPhase.Searching]: true,
  [TripPhase.DriverWaiting]: true,
  [TripPhase.TripInProgress]: true,
  [TripPhase.Wallet]: false,
};

export const PhasePanDownToClose = {
  [TripPhase.Home]: false,
  [TripPhase.AddressSelection]: false,
  [TripPhase.LocationConfirmation]: false,
  [TripPhase.Request]: false,
  [TripPhase.Confirm]: false,
  [TripPhase.Payment]: false,
  [TripPhase.Complete]: false,
  [TripPhase.Accepted]: false,
  [TripPhase.Searching]: false,
  [TripPhase.DriverWaiting]: false,
  [TripPhase.TripInProgress]: false,
  [TripPhase.Wallet]: false,
};

export const PhaseIndex = {
  [TripPhase.Home]: 0,
  [TripPhase.AddressSelection]: 0,
  [TripPhase.LocationConfirmation]: 0,
  [TripPhase.Request]: 0,
  [TripPhase.Confirm]: 0,
  [TripPhase.Payment]: 0,
  [TripPhase.Complete]: 0,
  [TripPhase.Accepted]: 0,
  [TripPhase.Searching]: 0,
  [TripPhase.DriverWaiting]: 0,
  [TripPhase.TripInProgress]: 0,
  [TripPhase.Wallet]: 0,
};
