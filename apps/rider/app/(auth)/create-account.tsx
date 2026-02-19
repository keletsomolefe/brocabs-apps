import { CreateAccountScreen } from "@brocabs/ui";
import { router } from "expo-router";
import { authApi, filesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { prefetchAppResources } from "~/services/prefetch";
import { useAppStore } from "~/store";

export default function CreateAccountPage() {
  const userQuery = useUser({ enabled: false });
  const setPreviouslyAuthenticated = useAppStore((state) => state.setPreviouslyAuthenticated);

  const onSuccess = async () => {
    await userQuery.refetch();
    setPreviouslyAuthenticated(true);

    await prefetchAppResources();

    router.dismissAll();
    router.replace("/(app)");
  };

  return <CreateAccountScreen authApi={authApi} filesApi={filesApi} onSuccess={onSuccess} />;
}
