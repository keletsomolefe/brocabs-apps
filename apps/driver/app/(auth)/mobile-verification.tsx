import { VerifyOtpResponseDtoDataNextStepEnum } from "@brocabs/client";
import { OtpVerificationScreen } from "@brocabs/ui/features/authentication/otp-verification-screen";
import { router, useLocalSearchParams } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import { otpApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { useAppStore } from "~/store";
import { navigateBasedOnSession } from "~/utils/session-navigation";

const getParamValue = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);

export default function MobileVerification() {
  const params = useLocalSearchParams<{
    mobileNumber?: string | string[];
    flow?: string | string[];
  }>();
  const mobileNumber = getParamValue(params.mobileNumber);
  const flowParam = getParamValue(params.flow);
  const isForgotPasswordFlow = flowParam === "forgot-password";
  const userQuery = useUser({ enabled: false });
  const setPreviouslyAuthenticated = useAppStore(
    useShallow((state) => state.setPreviouslyAuthenticated)
  );

  const onNavigateToResetPassword = (mobileNumber?: string) => {
    const resetParams: Record<string, string> = { flow: "forgot-password" };
    if (mobileNumber) {
      resetParams.mobileNumber = mobileNumber;
    }
    router.push({
      pathname: "/(auth)/reset-password",
      params: resetParams,
    });
  };

  const onNavigateToProfile = (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => {
    if (nextStep === VerifyOtpResponseDtoDataNextStepEnum.RegisterUser) {
      router.push("/create-account");
    } else if (nextStep === VerifyOtpResponseDtoDataNextStepEnum.RegisterProfile) {
      router.push("/create-driver-profile");
    } else {
      router.push("/create-account");
    }
  };

  const onNavigateToDashboard = async () => {
    // Force a fresh session fetch
    const { data: session } = await userQuery.refetch();

    setPreviouslyAuthenticated(true);
    router.dismissAll();

    if (session) {
      navigateBasedOnSession(session);
    }
  };

  return (
    <OtpVerificationScreen
      otpApi={otpApi}
      identifier={mobileNumber}
      applicationType="Driver"
      isForgotPasswordFlow={isForgotPasswordFlow}
      onNavigateToResetPassword={onNavigateToResetPassword}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToDashboard={onNavigateToDashboard}
      onNavigateToSignIn={() => router.push("/(auth)/login")}
    />
  );
}
