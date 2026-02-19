import { AssetFiles } from "@brocabs/ui/theme/assets";
import { OnboardingCarouselItem } from "./types";

export const OnboardingCarouselData: OnboardingCarouselItem[] = [
  {
    id: 1,
    titleKey: "onboarding.bookCabs",
    descriptionKey: "onboarding.bookCabsDesc",
    video: AssetFiles.videos["onboarding-video-01"],
  },
  {
    id: 2,
    titleKey: "onboarding.tapPayDone",
    descriptionKey: "onboarding.tapPayDoneDesc",
    video: AssetFiles.videos["onboarding-video-02"],
  },
  {
    id: 3,
    titleKey: "onboarding.sosButton",
    descriptionKey: "onboarding.sosButtonDesc",
    video: AssetFiles.videos["onboarding-video-03"],
  },
];
