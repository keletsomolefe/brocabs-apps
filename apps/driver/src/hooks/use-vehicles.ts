import { useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "~/api";

export function useVehicleMakes(search?: string) {
  return useQuery({
    queryKey: ["vehicle-makes", search],
    queryFn: () =>
      vehiclesApi.vehiclesControllerSearchMakes({
        search: search || undefined,
        limit: 100,
      }),
  });
}

export function useVehicleModels(makeId?: string, search?: string) {
  return useQuery({
    queryKey: ["vehicle-models", makeId, search],
    queryFn: () =>
      vehiclesApi.vehiclesControllerSearchModels({
        makeId: makeId!,
        search: search || undefined,
        limit: 100,
      }),
    enabled: !!makeId,
  });
}
