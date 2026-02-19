import { UserProfileDtoTypeEnum } from "@brocabs/client";
import { router } from "expo-router";

import { ForgotPasswordScreen } from "@brocabs/ui/features/authentication/forgot-password-screen";
import { otpApi } from "~/api";

export default function ForgotPassword() {
  return (
    <ForgotPasswordScreen
      otpApi={otpApi}
      applicationType={UserProfileDtoTypeEnum.Driver}
      onNavigateToVerification={(identifier) => {
        router.push({
          pathname: "/(auth)/mobile-verification",
          params: { mobileNumber: identifier, flow: "forgot-password" },
        });
      }}
    />
  );
}
