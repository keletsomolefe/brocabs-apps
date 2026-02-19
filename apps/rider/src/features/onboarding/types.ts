import { TranslationKey } from "~/i18n";

export interface OnboardingCarouselItem {
  id: number;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  video: string;
}
