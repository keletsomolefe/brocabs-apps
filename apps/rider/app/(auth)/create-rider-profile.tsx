import { CreateRiderScreen } from "@brocabs/ui";
import { router } from "expo-router";
import { authApi, filesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { prefetchAppResources } from "~/services/prefetch";
import { useAppStore } from "~/store";

export default function CreateRiderProfilePage() {
  const userQuery = useUser({ enabled: false });
  const setPreviouslyAuthenticated = useAppStore((state) => state.setPreviouslyAuthenticated);

  const onSuccess = async () => {
    await userQuery.refetch();
    setPreviouslyAuthenticated(true);

    await prefetchAppResources();

    router.dismissAll();
    router.replace("/(app)");
  };

  return <CreateRiderScreen authApi={authApi} filesApi={filesApi} onSuccess={onSuccess} />;
}
