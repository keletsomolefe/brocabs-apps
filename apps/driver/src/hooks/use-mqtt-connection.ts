import { QueryKeys } from "@brocabs/client";
import {
  createEnvelope,
  isEnvelopeType,
  MqttMessageType,
  parseEnvelope,
} from "@brocabs/mqtt-envelope";
import { useQuery } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { MqttClient } from "mqtt";
import { useEffect, useRef, useState } from "react";
import { authApi } from "~/api";
import { processMqttMessage } from "~/services/mqtt-processor";
import { createMqttClient, MqttError, MqttStatus } from "~/services/mqttService";
import { useUser } from "./use-auth";

export { MqttEnvelope } from "@brocabs/mqtt-envelope";

interface UseMqttConnectionOptions {
  onReconnect?: () => void;
}

export function useMqttConnection(doMqttConnection: boolean, options?: UseMqttConnectionOptions) {
  const [mqttStatus, setMqttStatus] = useState<MqttStatus>(MqttStatus.Disconnected);
  const [mqttError, setMqttError] = useState<MqttError | undefined>();
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
  const { data: user } = useUser();
  const onReconnectRef = useRef(options?.onReconnect);
  const mqttQuery = useQuery({
    queryKey: [QueryKeys.MQTT_TOKEN],
    enabled: !!user,
    queryFn: async () => {
      return authApi.authControllerGetMqttToken();
    },
    refetchInterval: 14 * 60 * 1000, // 14 minutes
  });

  const password = mqttQuery.data?.data.token;
  const passwordRef = useRef(password);
  const [isReadyToConnect, setIsReadyToConnect] = useState(false);

  useEffect(() => {
    onReconnectRef.current = options?.onReconnect;
  }, [options?.onReconnect]);

  useEffect(() => {
    passwordRef.current = password;
    if (password && !isReadyToConnect) {
      setIsReadyToConnect(true);
    }
  }, [password, isReadyToConnect]);

  useEffect(() => {
    if (mqttClient && password) {
      mqttClient.options.password = password;
    }
  }, [mqttClient, password]);

  const profileId = user?.profileId;

  useEffect(() => {
    if (!doMqttConnection || !isReadyToConnect || !profileId) return;

    const client = createMqttClient({
      setMqttStatus,
      setMqttError,
      onReconnect: () => onReconnectRef.current?.(),
      onMessage: (_topic, message) => {
        try {
          const stringMsg = Buffer.from(message).toString();
          const jsonMsg = JSON.parse(stringMsg);
          const parsedMsg = parseEnvelope(jsonMsg);

          if (client?.connected && !isEnvelopeType(parsedMsg, MqttMessageType.DRIVER_LOCATION)) {
            const ackEnvelope = createEnvelope(
              Math.random().toString(36).substring(7),
              MqttMessageType.ACK,
              { messageId: parsedMsg.messageId }
            );
            client.publishAsync(`driver/${profileId}/ack`, JSON.stringify(ackEnvelope), { qos: 0 });
          }

          processMqttMessage(parsedMsg);
        } catch (error) {
          console.error("Failed to parse MQTT message", error);
        }
      },
      username: "user",
      password: passwordRef.current!,
    });

    setMqttClient(client);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [doMqttConnection, isReadyToConnect, profileId]);

  return {
    mqttClient,
    mqttStatus,
    mqttError,
    setMqttStatus,
    setMqttError,
  };
}
