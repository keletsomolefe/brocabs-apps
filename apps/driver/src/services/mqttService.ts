import mqtt, { IClientOptions, IPublishPacket } from "mqtt";
import { envConfig } from "src/config/environment";
import { emitStateError } from "./errorHandler";

export enum MqttStatus {
  Disconnected = "Disconnected",
  Offline = "Offline",
  Error = "Error",
  Reconnecting = "Reconnecting",
  Connected = "Connected",
}

export interface MqttError {
  type: string;
  msg: string;
}

interface CreateMqttClientProps {
  setMqttStatus: (status: MqttStatus) => void;
  setMqttError: (error: MqttError) => void;
  onMessage: (topic: string, message: Buffer, packet?: IPublishPacket) => void;
  onReconnect?: () => void;
  username: string;
  password: string;
}

export function createMqttClient({
  setMqttStatus,
  setMqttError,
  onMessage,
  onReconnect,
  password,
  username,
}: CreateMqttClientProps) {
  const ssl = envConfig.MQTT_SSL;
  const host = envConfig.MQTT_HOST;
  const path = "/";
  let port = envConfig.MQTT_PORT;
  let protocol: IClientOptions["protocol"] = "ws";

  if (ssl) {
    port = envConfig.MQTT_PORT_SSL;
    protocol = "wss";
  }

  let wasReconnecting = false;

  const client = mqtt
    .connect({
      protocol,
      host,
      port,
      path,
      protocolVersion: 4,
      username,
      password,
      reconnectPeriod: 5000,
      queueQoSZero: true,
      resubscribe: true,
      clean: true,
      keepalive: 30,
      properties: undefined,
      forceNativeWebSocket: true,
    })
    .on("connect", () => {
      setMqttStatus(MqttStatus.Connected);
      if (wasReconnecting) {
        wasReconnecting = false;
        onReconnect?.();
      }
    })
    .on("error", (error) => {
      setMqttStatus(MqttStatus.Error);
      emitStateError(setMqttError, "MqttGeneral", error);
    })
    .on("disconnect", (packet) => {
      setMqttStatus(MqttStatus.Disconnected);
    })
    .on("offline", () => {
      setMqttStatus(MqttStatus.Offline);
    })
    .on("reconnect", () => {
      wasReconnecting = true;
      setMqttStatus(MqttStatus.Reconnecting);
    })
    .on("close", () => {
      setMqttStatus(MqttStatus.Disconnected);
    })
    .on("message", (topic, message, packet) => {
      onMessage(topic, message);
    });

  return client;
}
