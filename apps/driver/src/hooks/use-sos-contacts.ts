import { CreateSosContactDto, QueryKeys } from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sosContactsApi } from "~/api";

export const useSosContacts = () => {
  return useQuery({
    queryKey: [QueryKeys.SOS_CONTACTS],
    queryFn: () => sosContactsApi.sosContactsControllerFindAll(),
  });
};

export const useAddSosContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createSosContactDto: CreateSosContactDto) =>
      sosContactsApi.sosContactsControllerCreate({ createSosContactDto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SOS_CONTACTS] });
    },
  });
};

export const useRemoveSosContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sosContactsApi.sosContactsControllerRemove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SOS_CONTACTS] });
    },
  });
};
