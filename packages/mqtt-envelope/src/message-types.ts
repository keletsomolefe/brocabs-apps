/**
 * MQTT message type constants shared between backend and mobile apps.
 */
export enum MqttMessageType {
  RIDE_REQUEST = "ride-request",
  RIDE_ACCEPTED = "ride-accepted",
  RIDE_CANCELLED = "ride-cancelled",
  RIDE_OFFER_EXPIRED = "ride-offer-expired",
  RIDE_STARTED = "ride-started",
  RIDE_COMPLETED = "ride-completed",
  DRIVER_NOT_FOUND = "driver-not-found",
  DRIVER_LOCATION = "driver-location",
  DRIVER_ARRIVED = "driver-arrived",
  CHAT_MESSAGE = "chat-message",
  ACK = "ack",
}
