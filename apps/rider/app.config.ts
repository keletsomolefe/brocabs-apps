import "tsx/cjs";

import type { ConfigContext, ExpoConfig } from "expo/config";
import { z } from "zod";

import eas from "./eas.json";
import pkgJson from "./package.json";
import withIosDeploymentTarget from "./plugins/withIosDeploymentTarget";

const STAGE = (process.env.STAGE || "staging") as keyof typeof eas.build;
type Stage = typeof STAGE;
const buildConfig = z
  .object({
    STAGE: z.enum(["dev", "staging", "prod"]),
    IS_EAS: z.string().optional(),
    MOBILE_DEEP_LINK: z.string().optional(),
    GOOGLE_MAPS_PLACE_DETAILS_URL: z.string(),
    GOOGLE_MAPS_GEOCODE_URL: z.string(),
    GOOGLE_MAPS_AUTOCOMPLETE_URL: z.string(),
    EXPO_PUBLIC_GOOGLE_API_KEY: z.string().optional(),
    EXPO_PUBLIC_API_BASE_PATH: z.string().optional(),
    EXPO_PUBLIC_MQTT_HOST: z.string().optional(),
    EXPO_PUBLIC_MQTT_PORT: z.string().optional(),
    EXPO_PUBLIC_MQTT_PORT_SSL: z.string().optional(),
    EXPO_PUBLIC_MQTT_SSL: z.string().optional(),
    EXPO_PUBLIC_MQTT_QOS: z.string().optional(),
  })
  .strict();

const getConfig = (stage: Stage) => {
  const shared = eas.build.shared as { env: Record<string, unknown> };
  const easBuildEnv = (eas.build[stage] as { env?: Record<string, unknown> }) || {};
  const mergedEnv = {
    ...(shared.env || {}),
    ...(easBuildEnv.env || {}),
  };

  // Allow .env to override EAS variables
  const envOverrides = [
    "EXPO_PUBLIC_API_BASE_PATH",
    "EXPO_PUBLIC_MQTT_HOST",
    "EXPO_PUBLIC_MQTT_PORT",
    "EXPO_PUBLIC_MQTT_PORT_SSL",
    "EXPO_PUBLIC_MQTT_SSL",
    "EXPO_PUBLIC_MQTT_QOS",
  ] as const;

  for (const key of envOverrides) {
    if (process.env[key]) {
      Object.assign(mergedEnv, { [key]: process.env[key] });
    }
  }

  const config = buildConfig.parse(mergedEnv);

  const {
    GOOGLE_MAPS_PLACE_DETAILS_URL,
    GOOGLE_MAPS_GEOCODE_URL,
    GOOGLE_MAPS_AUTOCOMPLETE_URL,
    EXPO_PUBLIC_GOOGLE_API_KEY,
    ...restConfig
  } = config;
  return {
    stage,
    version: pkgJson.version,
    mobileDeepLink: shared.env.MOBILE_DEEP_LINK as string,
    google: {
      apiKey: EXPO_PUBLIC_GOOGLE_API_KEY,
      maps: {
        placeDetailsUrl: GOOGLE_MAPS_PLACE_DETAILS_URL,
        geocodeUrl: GOOGLE_MAPS_GEOCODE_URL,
        autocompleteUrl: GOOGLE_MAPS_AUTOCOMPLETE_URL,
      },
    },
    ...restConfig,
  };
};

const config = getConfig(STAGE);

export type Config = typeof config;

const expoConfig = (context: ConfigContext): Partial<ExpoConfig> => {
  const { android, ios, extra } = context.config;

  const appId = config.STAGE === "prod" ? "com.brocabs.vr" : `za.co.brocabs.${config.STAGE}`;

  const [major, minor, patch] = pkgJson.version
    .split("-")[0]
    .split(".")
    .map((part) => Number.parseInt(part, 10));
  let versionCode = major * 1000000 + minor * 10000 + patch * 100;

  if (pkgJson.version.includes("-")) {
    const buildNumber = Number.parseInt(pkgJson.version.split(".").pop() ?? "0", 10);
    if (!isNaN(buildNumber)) {
      versionCode += buildNumber;
    }
  }

  const infoPlist = {
    ...ios?.infoPlist,
    CFBundleVersion: String(versionCode),
  };

  const iosUpdated = {
    ...ios,
    bundleIdentifier: appId,
    infoPlist,
    entitlements: {
      ...ios?.entitlements,
      "aps-environment": config.IS_EAS ? "production" : "development",
    },
  };

  const androidUpdated = {
    ...android,
    package: appId,
    versionCode,
  };

  const updatedConfig: Partial<ExpoConfig> = {
    ...context.config,
    android: androidUpdated,
    ios: iosUpdated,
    version: pkgJson.version,
    extra: {
      ...config,
      ...extra,
    },
  };

  return withIosDeploymentTarget(updatedConfig as ExpoConfig, {
    deploymentTarget: "15.1",
  });
};

export default expoConfig;
