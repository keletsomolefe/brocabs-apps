import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "~/api";

export const useVehicleConfig = () => {
  return useQuery({
    queryKey: ["vehicle-config"],
    queryFn: () => settingsApi.settingsControllerGetVehicleConfig(),
    staleTime: 1000 * 60 * 60, // 1 hour - this data rarely changes
  });
};

export const useBankingConfig = () => {
  return useQuery({
    queryKey: ["banking-config"],
    queryFn: () => settingsApi.settingsControllerGetBankingConfig(),
    staleTime: 1000 * 60 * 60, // 1 hour - this data rarely changes
  });
};
