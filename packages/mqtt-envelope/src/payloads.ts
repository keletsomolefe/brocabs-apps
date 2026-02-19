import { MqttMessageType } from "./message-types";

/**
 * Payload type definitions for each MQTT message type.
 * Add new payload interfaces here when adding new message types.
 */

export interface RideRequestPayload {
  /** The ride ID - driver app fetches full details from /drivers/active-offers */
  rideId: string;
}

export interface RideAcceptedPayload {
  rideId: string;
  driverId: string;
  driverName: string;
  vehiclePlate: string;
  estimatedArrivalMinutes: number;
}

export interface RideCancelledPayload {
  rideId: string;
  cancelledBy: "rider" | "driver" | "system";
  reason?: string;
}

export interface RideOfferExpiredPayload {
  rideId: string;
  reason?: string;
}

export interface RideStartedPayload {
  rideId: string;
  startedAt: string;
}

export interface RideCompletedPayload {
  rideId: string;
  completedAt: string;
  actualPrice: number;
  currency?: string;
}

export interface DriverNotFoundPayload {
  rideId: string;
  reason?: string;
}

export interface DriverLocationPayload {
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
}

export interface DriverArrivedPayload {
  rideId: string;
  driverId: string;
  arrivedAt: string;
}

export interface ChatMessagePayload {
  id: string;
  rideId: string;
  body: string;
  senderType: "rider" | "driver";
  messageType: "text" | "location" | "image" | "quick_reply";
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

/**
 * Maps each MqttMessageType to its corresponding payload type.
 */
export interface AckPayload {
  messageId: string;
}

export interface MqttPayloadMap {
  [MqttMessageType.RIDE_REQUEST]: RideRequestPayload;
  [MqttMessageType.RIDE_ACCEPTED]: RideAcceptedPayload;
  [MqttMessageType.RIDE_CANCELLED]: RideCancelledPayload;
  [MqttMessageType.RIDE_OFFER_EXPIRED]: RideOfferExpiredPayload;
  [MqttMessageType.RIDE_STARTED]: RideStartedPayload;
  [MqttMessageType.RIDE_COMPLETED]: RideCompletedPayload;
  [MqttMessageType.DRIVER_NOT_FOUND]: DriverNotFoundPayload;
  [MqttMessageType.DRIVER_LOCATION]: DriverLocationPayload;
  [MqttMessageType.DRIVER_ARRIVED]: DriverArrivedPayload;
  [MqttMessageType.CHAT_MESSAGE]: ChatMessagePayload;
  [MqttMessageType.ACK]: AckPayload;
}
