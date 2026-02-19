import type {
  NotificationListResponseDto,
  NotificationsControllerGetNotificationsFilterEnum,
} from "@brocabs/client";
import {
  NotificationsControllerGetNotificationsProfileTypeEnum,
  NotificationsControllerMarkAllAsReadProfileTypeEnum,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "~/api";

export const NOTIFICATIONS_QUERY_KEY = "notifications";
const GET_PROFILE_TYPE = NotificationsControllerGetNotificationsProfileTypeEnum.Driver;
const MARK_ALL_PROFILE_TYPE = NotificationsControllerMarkAllAsReadProfileTypeEnum.Driver;

export function useNotifications(
  filter?: NotificationsControllerGetNotificationsFilterEnum,
  cursor?: string,
  limit?: number
) {
  return useQuery<NotificationListResponseDto>({
    queryKey: [NOTIFICATIONS_QUERY_KEY, GET_PROFILE_TYPE, filter, cursor, limit],
    queryFn: async () => {
      return await notificationsApi.notificationsControllerGetNotifications({
        profileType: GET_PROFILE_TYPE,
        filter,
        cursor,
        limit,
      });
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await notificationsApi.notificationsControllerMarkAsRead({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await notificationsApi.notificationsControllerMarkAllAsRead({
        profileType: MARK_ALL_PROFILE_TYPE,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await notificationsApi.notificationsControllerDeleteNotification({
        id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
}
