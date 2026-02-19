import { processApiError } from "@brocabs/client";
import { useMutation } from "@tanstack/react-query";
import { authApi, queryClient } from "~/api";

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async (password: string) => {
      try {
        return await authApi.authControllerDeleteAccount({
          deleteAccountDto: { password },
        });
      } catch (error) {
        throw await processApiError(error, "Failed to delete account");
      }
    },
    onSuccess: () => {
      // Clear all cached queries
      queryClient.clear();
    },
  });
}
