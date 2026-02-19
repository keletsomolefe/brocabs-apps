import { CreateFavoriteAddressDto, QueryKeys, UpdateFavoriteAddressDto } from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { favoriteAddressesApi } from "~/api";

export const useFavoriteAddresses = () => {
  return useQuery({
    queryKey: [QueryKeys.FAVORITE_ADDRESSES],
    queryFn: () => favoriteAddressesApi.favoriteAddressesControllerFindAll(),
  });
};

export const useAddFavoriteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (createFavoriteAddressDto: CreateFavoriteAddressDto) =>
      favoriteAddressesApi.favoriteAddressesControllerCreate({ createFavoriteAddressDto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FAVORITE_ADDRESSES] });
    },
  });
};

export const useUpdateFavoriteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateFavoriteAddressDto }) =>
      favoriteAddressesApi.favoriteAddressesControllerUpdate({ id, updateFavoriteAddressDto: dto }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FAVORITE_ADDRESSES] });
    },
  });
};

export const useRemoveFavoriteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => favoriteAddressesApi.favoriteAddressesControllerRemove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FAVORITE_ADDRESSES] });
    },
  });
};
