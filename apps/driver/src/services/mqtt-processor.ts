import { QueryKeys, RideResponseDto } from "@brocabs/client";
import {
  ChatMessagePayload,
  DriverLocationPayload,
  isEnvelopeType,
  MqttEnvelope,
  MqttMessageType,
  RideCancelledPayload,
  RideRequestPayload,
} from "@brocabs/mqtt-envelope";
import PQueue from "p-queue";
import { queryClient } from "~/api";
import { syncChatMessages } from "~/features/chat/chat-sync";
import { useRiderCancelledStore } from "~/features/trip/stores/riderCancelledStore";
import { showForegroundNotification } from "./notification-service";

// Singleton queue with concurrency 1
const queue = new PQueue({ concurrency: 1 });

export function processMqttMessage(message: MqttEnvelope) {
  queue.add(() => handleMessage(message));
}

async function handleMessage(message: MqttEnvelope) {
  try {
    if (isEnvelopeType(message, MqttMessageType.RIDE_REQUEST)) {
      handleRideRequest(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.RIDE_CANCELLED)) {
      handleRideCancelled(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.RIDE_OFFER_EXPIRED)) {
      handleRideRequestExpired(message.data);
      return;
    }

    if (isEnvelopeType(message, MqttMessageType.DRIVER_LOCATION)) {
      handleDriverLocationUpdate(message.data);
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

function handleDriverLocationUpdate(data: DriverLocationPayload) {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_NAVIGATION] });
}

async function handleChatMessage(data: ChatMessagePayload) {
  await syncChatMessages(data.rideId);

  if (data.senderType === "rider") {
    showForegroundNotification({
      title: "New Message",
      body: data.body,
      data: { rideId: data.rideId, messageId: data.id },
    });
  }
}

function handleRideRequest(data: RideRequestPayload) {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_REQUESTS] });

  showForegroundNotification({
    title: "New Ride Request",
    body: "You have a new ride request waiting",
    data: { rideId: data.rideId },
  });
}

function handleRideRequestExpired(data: RideRequestPayload) {
  queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_REQUESTS] });

  showForegroundNotification({
    title: "Ride Offer Expired",
    body: "A ride offer has expired",
    data: { rideId: data.rideId },
  });
}

function handleRideCancelled(data: RideCancelledPayload) {
  console.log("Ride cancelled MQTT received", data);

  queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDE_REQUESTS] });

  const activeRide = queryClient.getQueryData<RideResponseDto>([QueryKeys.ACTIVE_RIDE]);
  if (activeRide) {
    useRiderCancelledStore.getState().showCancelledModal(data);
  }

  showForegroundNotification({
    title: "Ride Cancelled",
    body: data.reason || "The ride has been cancelled",
    data: { rideId: data.rideId },
  });
}
