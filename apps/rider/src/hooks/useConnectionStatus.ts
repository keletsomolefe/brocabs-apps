import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useMqtt } from "~/context/MqttContext";
import { MqttStatus } from "~/services/mqttService";

export function useConnectionStatus() {
  const context = useMqtt();
  const isConnected = context?.mqttStatus === MqttStatus.Connected;
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === "active");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsAppActive(nextAppState === "active");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    isConnected,
    isBannerVisible: !isConnected && isAppActive,
  };
}
