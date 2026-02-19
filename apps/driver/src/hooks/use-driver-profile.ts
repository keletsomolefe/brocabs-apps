import { QueryKeys, UpdateProfileDto } from "@brocabs/client";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { authApi, profilesApi, queryClient } from "~/api";

export const driverProfileQueryOptions = queryOptions({
  queryKey: [QueryKeys.DRIVER_PROFILE],
  queryFn: async () => {
    return (await profilesApi.driverProfileControllerGetDriverProfile()).data;
  },
});

export function useDriverProfile() {
  return useQuery(driverProfileQueryOptions);
}

export function useUpdateDriverProfile() {
  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      return (await authApi.authControllerUpdateProfile({ updateProfileDto: data })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.DRIVER_PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
  });
}
