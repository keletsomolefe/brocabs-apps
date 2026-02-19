import { LoginDtoApplicationTypeEnum, VerifyOtpResponseDtoDataNextStepEnum } from "@brocabs/client";
import { LoginScreen } from "@brocabs/ui";
import { router, useLocalSearchParams } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { authApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { useAppStore } from "~/store";

export default function SignInOTP() {
  const { tab } = useLocalSearchParams<{ tab?: string | string[] }>();
  const normalizedTab = Array.isArray(tab) ? tab[0] : tab;

  const userQuery = useUser({ enabled: false });
  const setPreviouslyAuthenticated = useAppStore(
    useShallow((state) => state.setPreviouslyAuthenticated)
  );

  const onLoginSuccess = async () => {
    await userQuery.refetch();
    setPreviouslyAuthenticated(true);
    router.dismissAll();
    router.replace("/(app)");
  };

  const onNavigateToProfile = (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => {
    if (nextStep === VerifyOtpResponseDtoDataNextStepEnum.RegisterUser) {
      router.push("/create-account");
    } else if (nextStep === VerifyOtpResponseDtoDataNextStepEnum.RegisterProfile) {
      router.push("/create-rider-profile");
    } else {
      router.push("/create-account");
    }
  };

  const onForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const onRegister = () => {
    router.push("/(auth)/mobile-number?action=register");
  };

  return (
    <LoginScreen
      authApi={authApi}
      applicationType={LoginDtoApplicationTypeEnum.Rider}
      onLoginSuccess={onLoginSuccess}
      onNavigateToProfile={onNavigateToProfile}
      onForgotPassword={onForgotPassword}
      onRegister={onRegister}
      initialTab={normalizedTab}
    />
  );
}
