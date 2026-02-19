const envConfig = {
  TZ: process.env.EXPO_PUBLIC_TZ ?? "UTC",
  MQTT_HOST: process.env.EXPO_PUBLIC_MQTT_HOST ?? "brocabs-realtime.nativesounds.co.za",
  MQTT_SSL:
    process.env.EXPO_PUBLIC_MQTT_SSL !== undefined
      ? process.env.EXPO_PUBLIC_MQTT_SSL === "true"
      : true,
  MQTT_PORT:
    typeof process.env.EXPO_PUBLIC_MQTT_PORT === "string"
      ? parseInt(process.env.EXPO_PUBLIC_MQTT_PORT)
      : 80,
  MQTT_PORT_SSL:
    typeof process.env.EXPO_PUBLIC_MQTT_PORT_SSL === "string"
      ? parseInt(process.env.EXPO_PUBLIC_MQTT_PORT_SSL)
      : 443,
  MQTT_QOS:
    typeof process.env.EXPO_PUBLIC_MQTT_QOS === "string"
      ? parseInt(process.env.EXPO_PUBLIC_MQTT_QOS)
      : 1,
  EMIT_CONSOLE_LOGS: process.env.EXPO_PUBLIC_EMIT_CONSOLE_LOGS === "true",
};

export { envConfig };
