import { QueryKeys } from "@brocabs/client";
import {
  ChatMessagePayload,
  DriverLocationPayload,
  DriverNotFoundPayload,
  isEnvelopeType,
  MqttEnvelope,
  MqttMessageType,
  RideAcceptedPayload,
  RideCancelledPayload,
  RideCompletedPayload,
} from "@brocabs/mqtt-envelope";
import PQueue from "p-queue";
import { queryClient } from "~/api";
import { syncChatMessages } from "~/features/chat/chat-sync";
import { useDriverArrivedStore } from "~/features/trip/stores/driverArrivedStore";
import { useDriverNotFoundStore } from "~/features/trip/stores/driverNotFoundStore";
import { useRideCancelledStore } from "~/features/trip/stores/rideCancelledStore";
import { useRideCompletedStore } from "~/features/trip/stores/rideCompletedStore";
import { showForegroundNotification } from "./notification-service";

// Singleton queue with concurrency 1
const queue = new PQueue({ concurrency: 1 });

export function processMqttMessage(message: MqttEnvelope) {
  queue.add(() => handleMessage(message));
}

async function handleMessage(message: MqttEnvelope) {
  try {
    if (isEnvelopeType(message, MqttMessageType.RIDE_ACCEPTED)) {
      handleRideAccepted(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.DRIVER_NOT_FOUND)) {
      handleDriverNotFound(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.RIDE_CANCELLED)) {
      handleRideCancelled(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.DRIVER_LOCATION)) {
      handleDriverLocationUpdate(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.DRIVER_ARRIVED)) {
      handleDriverArrived();
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.RIDE_STARTED)) {
      handleRideStarted();
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.RIDE_COMPLETED)) {
      handleRideCompleted(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.CHAT_MESSAGE)) {
      await handleChatMessage(message.data);
      return;
    }

    console.log("Unhandled MQTT message type:", message.type);
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
}

function handleRideAccepted(data: RideAcceptedPayload) {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });

  showForegroundNotification({
    title: "Driver Found!",
    body: `${data.driverName} is on the way. ETA: ${data.estimatedArrivalMinutes} min`,
    data: { rideId: data.rideId },
  });
}

function handleDriverNotFound(data: DriverNotFoundPayload) {
  useDriverNotFoundStore.getState().showModal(data);

  showForegroundNotification({
    title: "No Drivers Available",
    body: data.reason || "We couldn't find a driver for your ride",
    data: { rideId: data.rideId },
  });
}

function handleDriverLocationUpdate(data: DriverLocationPayload) {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_NAVIGATION] });
}

function handleDriverArrived() {
  useDriverArrivedStore.getState().showModal();
  queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });

  showForegroundNotification({
    title: "Driver Arrived",
    body: "Your driver has arrived at the pickup location",
  });
}

function handleRideStarted() {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTIVE_RIDE] });

  showForegroundNotification({
    title: "Ride Started",
    body: "Your trip is now in progress",
  });
}

function handleRideCompleted(data: RideCompletedPayload) {
  // Don't invalidate active ride query here - let the rating modal handle it
  // This matches the pattern used in handleRideCancelled
  useRideCompletedStore.getState().showModal(data);

  const price = data.actualPrice ?? 0;
  showForegroundNotification({
    title: "Ride Completed",
    body: `Trip finished. Total: ${data.currency || "BWP"} ${price.toFixed(2)}`,
    data: { rideId: data.rideId },
  });
}

async function handleChatMessage(data: ChatMessagePayload) {
  await syncChatMessages(data.rideId);

  if (data.senderType === "driver") {
    showForegroundNotification({
      title: "New Message from Driver",
      body: data.body,
      data: { rideId: data.rideId, messageId: data.id },
    });
  }
}

function handleRideCancelled(data: RideCancelledPayload) {
  useRideCancelledStore.getState().showModal(data);

  showForegroundNotification({
    title: "Ride Cancelled",
    body: data.reason || "Your ride has been cancelled",
    data: { rideId: data.rideId },
  });
}
