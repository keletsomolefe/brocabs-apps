/**
 * User Detail Page
 *
 * Shows detailed user information including notification preferences.
 */

import type { AdminUserResponseDto } from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  BellOff,
  Calendar,
  Check,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  User,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { Badge, Button } from "../../../components/ui";
import { adminApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/users/$userId")({
  component: UserDetailPage,
});

function formatDate(date: Date | string | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface NotificationSettingItemProps {
  label: string;
  enabled: boolean;
  icon: React.ReactNode;
}

function NotificationSettingItem({
  label,
  enabled,
  icon,
}: NotificationSettingItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${enabled ? "bg-green-100" : "bg-neutral-100"}`}
        >
          {icon}
        </div>
        <span className="text-sm text-neutral-700">{label}</span>
      </div>
      <Badge variant={enabled ? "success" : "default"}>
        {enabled ? (
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3" /> Enabled
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <X className="h-3 w-3" /> Disabled
          </span>
        )}
      </Badge>
    </div>
  );
}

function UserDetailPage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userQuery = useQuery<AdminUserResponseDto>({
    queryKey: ["admin", "user", userId],
    queryFn: () => adminApi.adminControllerGetUserById({ id: userId }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (isActive: boolean) =>
      adminApi.adminControllerUpdateUserStatus({
        id: userId,
        updateUserStatusDto: { isActive },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "user", userId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const user = userQuery.data;

  if (userQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (userQuery.isError || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600">Failed to load user details.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => userQuery.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const notificationSettings = user.notificationSettings;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="outline" size="sm" leftIcon={ArrowLeft}>
              Back to Users
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              User Details
            </h2>
            <p className="text-neutral-500 mt-1">
              View and manage user information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => userQuery.refetch()}
            isLoading={userQuery.isFetching}
          >
            Refresh
          </Button>
          <Button
            variant={user.isActive ? "outline" : "primary"}
            leftIcon={user.isActive ? UserMinus : UserPlus}
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to ${user.isActive ? "deactivate" : "activate"} this user?`,
                )
              ) {
                updateStatusMutation.mutate(!user.isActive);
              }
            }}
            isLoading={updateStatusMutation.isPending}
          >
            {user.isActive ? "Deactivate User" : "Activate User"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Profile Information
          </h3>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-xl font-semibold text-neutral-900">
                  {user.fullName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={
                      user.applicationType === "admin"
                        ? "primary"
                        : user.applicationType === "driver"
                          ? "success"
                          : "default"
                    }
                  >
                    {user.applicationType}
                  </Badge>
                  <Badge variant={user.isActive ? "success" : "danger"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{user.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">
                    Gender: {user.gender || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Joined: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Account Status
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-600">Status</span>
              <Badge variant={user.isActive ? "success" : "danger"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-600">User Type</span>
              <span className="text-sm font-medium text-neutral-900 capitalize">
                {user.applicationType}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="text-sm text-neutral-600">Created</span>
              <span className="text-sm font-medium text-neutral-900">
                {formatDate(user.createdAt)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-neutral-600">Last Updated</span>
              <span className="text-sm font-medium text-neutral-900">
                {formatDate(user.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-neutral-900">
            Notification Preferences
          </h3>
        </div>

        {notificationSettings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
            <NotificationSettingItem
              label="General Updates"
              enabled={notificationSettings.generalUpdates}
              icon={
                <Bell
                  className={`h-4 w-4 ${notificationSettings.generalUpdates ? "text-green-600" : "text-neutral-400"}`}
                />
              }
            />
            <NotificationSettingItem
              label="Safety & Security Alerts"
              enabled={notificationSettings.safetySecurityAlerts}
              icon={
                <Shield
                  className={`h-4 w-4 ${notificationSettings.safetySecurityAlerts ? "text-green-600" : "text-neutral-400"}`}
                />
              }
            />
            <NotificationSettingItem
              label="Ride Status Updates"
              enabled={notificationSettings.rideStatusUpdates}
              icon={
                <Bell
                  className={`h-4 w-4 ${notificationSettings.rideStatusUpdates ? "text-green-600" : "text-neutral-400"}`}
                />
              }
            />
            <NotificationSettingItem
              label="Rating & Reviews"
              enabled={notificationSettings.ratingReviews}
              icon={
                <Bell
                  className={`h-4 w-4 ${notificationSettings.ratingReviews ? "text-green-600" : "text-neutral-400"}`}
                />
              }
            />
            <NotificationSettingItem
              label="App Updates"
              enabled={notificationSettings.appUpdates}
              icon={
                <Bell
                  className={`h-4 w-4 ${notificationSettings.appUpdates ? "text-green-600" : "text-neutral-400"}`}
                />
              }
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 py-4 text-neutral-500">
            <BellOff className="h-5 w-5" />
            <span>
              No notification preferences set (using defaults - all enabled)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
