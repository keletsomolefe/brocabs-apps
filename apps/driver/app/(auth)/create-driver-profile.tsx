import { CreateDriverScreen } from "@brocabs/ui";
import { authApi, filesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { useAppStore } from "~/store";
import { navigateBasedOnSession } from "~/utils/session-navigation";

export default function CreateDriverProfilePage() {
  const { refetch } = useUser({ enabled: false });

  const onSuccess = async () => {
    const { data } = await refetch();
    useAppStore.getState().setPreviouslyAuthenticated(true);
    navigateBasedOnSession(data);
  };

  return <CreateDriverScreen authApi={authApi} filesApi={filesApi} onSuccess={onSuccess} />;
}
