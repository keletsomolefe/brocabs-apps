import { Asset } from "expo-asset";

export const Videos = {
  "onboarding-video-01": require("../assets/videos/onboarding-video-01.mp4"),
  "onboarding-video-02": require("../assets/videos/onboarding-video-02.mp4"),
  "onboarding-video-03": require("../assets/videos/onboarding-video-03.mp4"),
} as Record<string, Asset["uri"]>;
