import { processApiError, QueryKeys, ResponseError } from "@brocabs/client";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { ModalBox } from "@brocabs/ui/modal-box";
import { configureAuth } from "react-query-auth";
import { authApi } from "~/api";
import { useAppStore } from "~/store";

export const { useUser, useLogout } = configureAuth({
  userFn: async () => {
    try {
      return await authApi.authControllerGetSession();
    } catch (error) {
      if (error instanceof ResponseError && error.response.status === 401) {
        await authApi.authControllerLogout().catch(() => null);
        useAppStore.getState().setPreviouslyAuthenticated(false);
        return null;
      }
      throw await processApiError(error, "Failed to fetch user session");
    }
  },
  logoutFn: async () => {
    try {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Processing..."
            description="Please wait! Your action is under process"
          />
        ),
      });
      await authApi.authControllerLogout();
      useAppStore.getState().setPreviouslyAuthenticated(false);
    } catch (error) {
      throw await processApiError(error, "Failed to logout user");
    } finally {
      ModalBox.hide();
    }
    return null;
  },
  loginFn: async () => {
    return null;
  },
  registerFn: async () => {
    return null;
  },
  userKey: [QueryKeys.AUTHENTICATE_USER],
});
