import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationSettingsApi, queryClient } from "~/api";

export interface NotificationSettings {
  id: string;
  userId: string;
  generalUpdates: boolean;
  safetySecurityAlerts: boolean;
  rideStatusUpdates: boolean;
  ratingReviews: boolean;
  appUpdates: boolean;
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      return await notificationSettingsApi.notificationSettingsControllerGetSettings();
    },
  });
}

export function useUpdateNotificationSettings() {
  return useMutation({
    mutationFn: async (data: Partial<NotificationSettings>) => {
      return await notificationSettingsApi.notificationSettingsControllerUpdateSettings({
        updateNotificationSettingsDto: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
  });
}
