import { TripPhase } from "./trip-phase";

export const HEADER_CONTENT_HEIGHT = 62;
export const HEADER_VERTICAL_PADDING = 15;

export const HEADER_HEIGHT_WITHOUT_INSETS = HEADER_CONTENT_HEIGHT + HEADER_VERTICAL_PADDING * 2;

export const PhasePanDownToClose: Record<TripPhase, boolean> = {
  [TripPhase.Wallet]: false,
  [TripPhase.StartTrip]: false,
  [TripPhase.DriverWaiting]: false,
  [TripPhase.DriverWaitingTimeout]: false,
  [TripPhase.DriverEnroute]: false,
  [TripPhase.TripInProgress]: false,
  [TripPhase.RidesList]: false,
  [TripPhase.RidesListMap]: false,
};

export const PhaseDynamicSizing: Record<TripPhase, boolean> = {
  [TripPhase.Wallet]: true,
  [TripPhase.StartTrip]: true,
  [TripPhase.DriverWaiting]: true,
  [TripPhase.DriverWaitingTimeout]: true,
  [TripPhase.DriverEnroute]: true,
  [TripPhase.TripInProgress]: true,
  [TripPhase.RidesList]: false,
  [TripPhase.RidesListMap]: false,
};

export const PhaseEnableContentPanningGesture: Record<TripPhase, boolean> = {
  [TripPhase.StartTrip]: false,
  [TripPhase.DriverWaiting]: true,
  [TripPhase.DriverWaitingTimeout]: false,
  [TripPhase.DriverEnroute]: true,
  [TripPhase.TripInProgress]: true,
  [TripPhase.RidesList]: false,
  [TripPhase.RidesListMap]: true,
  [TripPhase.Wallet]: false,
};

export const PhaseSnapPoints: Partial<Record<TripPhase, (string | number)[]>> = {
  [TripPhase.RidesList]: ["100%"],
  [TripPhase.RidesListMap]: [300],
};
