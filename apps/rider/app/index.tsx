import { Redirect } from "expo-router";
import { useUser } from "~/hooks/use-auth";

export default function Index() {
  const userQuery = useUser();
  const userAuthenticated = userQuery.data?.authenticated && userQuery.data?.state?.canAccessApp;

  if (userQuery.isLoading) {
    return null;
  }

  if (userAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
