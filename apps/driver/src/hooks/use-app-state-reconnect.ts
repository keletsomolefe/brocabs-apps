import { MqttClient } from "mqtt";
import { RefObject, useEffect, useRef } from "react";
import { AppState } from "react-native";

export function useAppStateBackground(
  mqttClient: MqttClient | null,
  onReconnect?: () => void,
  skipNextReconnect?: RefObject<boolean>
) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        mqttClient
      ) {
        if (skipNextReconnect) {
          skipNextReconnect.current = true;
        }
        mqttClient.reconnect();
        onReconnect?.();
      } else if (mqttClient) {
        mqttClient.end();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [mqttClient, onReconnect, skipNextReconnect]);

  return appState.current;
}
