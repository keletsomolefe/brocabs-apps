import { AssetFiles } from "~/theme/assets";
import { OnboardingCarouselItem } from "./types";

export const OnboardingCarouselData: OnboardingCarouselItem[] = [
  {
    id: 1,
    title: "Book Cabs in Minutes",
    description: " Set your pickup, choose your ride, and get moving in just a few taps.",
    video: AssetFiles.videos["onboarding-video-01"],
  },
  {
    id: 2,
    title: "Tap, Pay, Done",
    description: "Skip the hassle, add funds once and enjoy fast, secure payments every ride.",
    video: AssetFiles.videos["onboarding-video-02"],
  },
  {
    id: 3,
    title: "SOS Safety Button",
    description: "Stay protected with our instant SOS, we are here when it matters most.",
    video: AssetFiles.videos["onboarding-video-03"],
  },
];
