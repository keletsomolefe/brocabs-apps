import Constants from "expo-constants";

import type { Config } from "../app.config";

const extra = Constants.expoConfig?.extra;

if (!extra || !extra.google) {
  throw new Error(
    "AppConfig is missing or incomplete. Make sure expoConfig.extra.google is properly configured."
  );
}

export const AppConfig: Config = extra as Config;
