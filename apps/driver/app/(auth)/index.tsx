import { router } from "expo-router";
import React from "react";

import { AuthLanding } from "@brocabs/ui/screens/auth-landing";
import { Button } from "@brocabs/ui/button";
import { AssetFiles } from "~/theme/assets";

export default function Index() {
  const handleCreateAccount = () => {
    router.push("/mobile-number?action=register");
  };

  const handleSignInWithPassword = () => {
    router.push("/login?action=login");
  };

  const handleSignInWithOTP = () => {
    router.push("/mobile-number?action=login");
  };

  return (
    <AuthLanding
      ButtonComponent={Button}
      logoSource={AssetFiles.images["logo-dark"]}
      onCreateAccount={handleCreateAccount}
      onSignInPassword={handleSignInWithPassword}
      onSignInOTP={handleSignInWithOTP}
    />
  );
}
