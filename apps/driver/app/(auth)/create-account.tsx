import { CreateAccountScreen } from "@brocabs/ui";
import { authApi, filesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { useAppStore } from "~/store";
import { navigateBasedOnSession } from "~/utils/session-navigation";

export default function CreateAccountPage() {
  const { refetch } = useUser({ enabled: false });

  const onSuccess = async () => {
    const { data } = await refetch();
    useAppStore.getState().setPreviouslyAuthenticated(true);
    navigateBasedOnSession(data);
  };

  return (
    <CreateAccountScreen
      authApi={authApi}
      filesApi={filesApi}
      avatarRequired
      onSuccess={onSuccess}
    />
  );
}
