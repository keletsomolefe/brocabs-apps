import { MqttClient } from "mqtt";
import React, { PropsWithChildren, useContext, useRef, useState } from "react";
import { useMqttConnection } from "~/hooks/use-mqtt-connection";
import { emitStateError } from "~/services/errorHandler";
import { MqttError, MqttStatus } from "~/services/mqttService";

interface MqttContextProps {
  mqttError: MqttError | undefined;
  mqttStatus: MqttStatus;
  setMqttStatus: (status: MqttStatus) => void;
  mqttClient: MqttClient | null;
  setDoMqttConnection: (doConnect: boolean) => void;
  subscribeToTopic: (topic: string) => void;
  setOnReconnect: (callback: (() => void) | undefined) => void;
  skipNextReconnect: React.RefObject<boolean>;
}
const MqttContext = React.createContext<MqttContextProps | null>(null);

export function MqttProvider({ children }: PropsWithChildren<unknown>) {
  const [doMqttConnection, setDoMqttConnection] = useState(true);
  const [onReconnect, setOnReconnect] = useState<(() => void) | undefined>();
  const skipNextReconnect = useRef(false);
  const { mqttClient, mqttError, mqttStatus, setMqttError, setMqttStatus } = useMqttConnection(
    doMqttConnection,
    {
      onReconnect: () => {
        if (skipNextReconnect.current) {
          skipNextReconnect.current = false;
          return;
        }
        onReconnect?.();
      },
    }
  );

  const subscribeToTopic = (topic: string) => {
    if (!mqttClient) return;
    mqttClient.subscribe(topic, { qos: 1 }, (error, granted) => {
      if (error) {
        setMqttStatus(MqttStatus.Error);
        emitStateError(setMqttError, "MqttTopic", error);
      }
    });
  };

  return (
    <MqttContext.Provider
      value={{
        mqttError,
        mqttStatus,
        setMqttStatus,
        mqttClient,
        setDoMqttConnection,
        subscribeToTopic,
        setOnReconnect,
        skipNextReconnect,
      }}>
      {children}
    </MqttContext.Provider>
  );
}

export const useMqtt = () => useContext(MqttContext);
