import { useRouter } from "expo-router";
import { OnboardingCarousel } from "~/features/onboarding/components/onboarding-carousel";

export default function OnboardingScreen() {
  const router = useRouter();

  return <OnboardingCarousel onComplete={() => router.replace("/(auth)")} />;
}
