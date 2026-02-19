import { Redirect } from "expo-router";
import { useUser } from "~/hooks/use-auth";
import { getSessionRedirectPath } from "~/utils/session-navigation";

export default function Index() {
  const userQuery = useUser();

  if (userQuery.isLoading) {
    return null;
  }

  if (userQuery.data) {
    const href = getSessionRedirectPath(userQuery.data);
    // @ts-ignore
    return <Redirect href={href} />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
