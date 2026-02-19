import { z } from "zod";
import { MqttMessageType } from "./message-types";
import { MqttPayloadMap } from "./payloads";

export const mqttEnvelopeSchema = z.object({
  messageId: z.string(),
  type: z.nativeEnum(MqttMessageType),
  data: z.unknown(),
});

/**
 * Generic envelope type - use TypedMqttEnvelope for type-safe payloads.
 */
export type MqttEnvelope<T = unknown> = {
  messageId: string;
  type: MqttMessageType;
  data: T;
};

/**
 * Type-safe envelope that enforces the correct payload type for each message type.
 */
export type TypedMqttEnvelope<T extends MqttMessageType> = {
  messageId: string;
  type: T;
  data: MqttPayloadMap[T];
};

/**
 * Creates a type-safe envelope for MQTT messages.
 * The data type is enforced based on the message type.
 *
 * @example
 * createEnvelope(uuid(), MqttMessageType.RIDE_REQUEST, {
 *   rideId: "123",
 *   rideTypeId: 1,
 *   pickupLatitude: -25.7,
 *   pickupLongitude: 28.2,
 *   distanceKm: 1.5,
 * });
 */
export function createEnvelope<T extends MqttMessageType>(
  messageId: string,
  type: T,
  data: MqttPayloadMap[T],
): TypedMqttEnvelope<T> {
  return { messageId, type, data };
}

/**
 * Parses and validates an MQTT envelope from a raw message.
 * Note: This only validates the envelope structure, not the payload shape.
 */
export function parseEnvelope(raw: unknown): MqttEnvelope {
  const parsed = mqttEnvelopeSchema.parse(raw);
  return {
    messageId: parsed.messageId,
    type: parsed.type,
    data: parsed.data,
  };
}

/**
 * Type guard to check if an envelope is of a specific message type.
 * Narrows the data type to the correct payload type.
 *
 * @example
 * if (isEnvelopeType(envelope, MqttMessageType.RIDE_REQUEST)) {
 *   console.log(envelope.data.rideId); // TypeScript knows this is RideRequestPayload
 * }
 */
export function isEnvelopeType<T extends MqttMessageType>(
  envelope: MqttEnvelope,
  type: T,
): envelope is TypedMqttEnvelope<T> {
  return envelope.type === type;
}
