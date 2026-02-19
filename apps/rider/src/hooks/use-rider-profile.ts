import { QueryKeys, UpdateProfileDto } from "@brocabs/client";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { authApi, profilesApi, queryClient } from "~/api";

export const riderProfileQueryOptions = queryOptions({
  queryKey: [QueryKeys.RIDER_PROFILE],
  queryFn: async () => {
    return (await profilesApi.riderProfileControllerGetRiderProfile()).data;
  },
});

export function useRiderProfile() {
  return useQuery(riderProfileQueryOptions);
}

export function useUpdateRiderProfile() {
  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      return (await authApi.authControllerUpdateProfile({ updateProfileDto: data })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RIDER_PROFILE] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
    },
  });
}
