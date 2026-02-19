import { Asset } from "expo-asset";

export const AssetFiles = {
  images: {
    wallet: require("~/assets/images/wallet.png"),
    "logo-light": require("~/assets/images/logo-light.png"),
    "logo-dark": require("~/assets/images/logo-dark.png"),
    "logo-black": require("~/assets/images/logo-black.png"),
    mascot: require("~/assets/images/mascot.png"),
    "car-medium-white": require("~/assets/images/car-medium-white.png"),
    "car-big-bro-white": require("~/assets/images/car-big-bro-white.png"),
    "car-big-bro-scholar-white": require("~/assets/images/car-big-bro-scholar-white.png"),
    "car-big-bro-plus-white": require("~/assets/images/car-big-bro-plus-white.png"),
    "car-bro-fam-white": require("~/assets/images/car-bro-fam-white.png"),
    "car-super-bro-white": require("~/assets/images/car-super-bro-white.png"),
    "logo-navbar": require("~/assets/images/logo-navbar.png"),
    card: require("~/assets/images/card.png"),
    "approved-icon": require("~/assets/images/approved-icon.png"),
    "approved-mascot": require("~/assets/images/approved-mascot.png"),
    "rejected-mascot": require("~/assets/images/rejected-mascot.png"),
    "car-icon": require("~/assets/images/car-icon.png"),
    "congrats-icon": require("~/assets/images/congrats-icon.png"),
    "free-trial-icon": require("~/assets/images/free-trial-icon.png"),
    "low-balance-icon": require("~/assets/images/low-balance-icon.png"),
    "request-submitted-icon": require("~/assets/images/mascot.png"),
    "google-maps": require("~/assets/images/google-maps.png"),
    waze: require("~/assets/images/waze.png"),
    "mascot-ride-cancelled": require("~/assets/images/mascot-ride-cancelled.png"),
    "mascot-warning": require("~/assets/images/mascot-warning.png"),
    "placeholder-avatar": require("~/assets/images/placeholder-avatar.png"),
    "subscription-failed": require("~/assets/images/subscription-failed.png"),
  },
  videos: {
    "onboarding-video-01": require("~/assets/videos/onboarding-video-01.mp4"),
    "onboarding-video-02": require("~/assets/videos/onboarding-video-02.mp4"),
    "onboarding-video-03": require("~/assets/videos/onboarding-video-03.mp4"),
  } as Record<string, Asset["uri"]>,
};

export const LocalCachedFiles = [...Object.values(AssetFiles.images)].flat();
