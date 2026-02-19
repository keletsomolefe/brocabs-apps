import { useQuery } from "@tanstack/react-query";
import { broScholarApi } from "~/api";

export const useLatestBroSCLRApplication = () => {
  return useQuery({
    queryKey: ["bro-scholar", "latest"],
    queryFn: async () => {
      try {
        const response = await broScholarApi.broScholarControllerGetLatestApplication();
        return response || null;
      } catch {
        // If 404 or other error, return null to indicate no application
        return null;
      }
    },
    retry: false,
  });
};
