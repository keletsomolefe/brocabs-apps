import { router } from "expo-router";

import { ResetPasswordScreen } from "@brocabs/ui/features/authentication/reset-password-screen";
import { authApi } from "~/api";

export default function ResetPassword() {
  return (
    <ResetPasswordScreen
      authApi={authApi}
      onNavigateToSuccess={() => {
        router.dismissAll();
        router.replace("/(auth)");
      }}
    />
  );
}
