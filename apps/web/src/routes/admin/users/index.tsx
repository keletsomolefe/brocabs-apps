/**
 * Admin Users Page
 *
 * User management interface with real API integration.
 */

import type {
  AdminUserListResponseDto,
  AdminUserResponseDto,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Search, UserMinus, UserPlus, Users } from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { adminApi } from "../../../lib/api";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

/**
 * Extended user type for DataTable compatibility
 */
type UserData = AdminUserResponseDto & { [key: string]: unknown };

function AdminUsersPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const usersQuery = useQuery<AdminUserListResponseDto>({
    queryKey: ["admin", "users", page, searchQuery, statusFilter],
    queryFn: async () => {
      const response = await adminApi.adminControllerListUsers({
        page: String(page),
        limit: String(limit),
        search: searchQuery || undefined,
        isActive: statusFilter === "" ? undefined : statusFilter,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      return response;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (params: { userId: string; isActive: boolean }) =>
      adminApi.adminControllerUpdateUserStatus({
        id: params.userId,
        updateUserStatusDto: { isActive: params.isActive },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const users = (usersQuery.data?.data ?? []) as UserData[];
  const total = usersQuery.data?.total ?? 0;

  const columns = [
    {
      key: "fullName",
      header: "Name",
      sortable: true,
      render: (value: unknown, row: UserData) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {String(value || "")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?"}
            </span>
          </div>
          <div>
            <p className="font-medium text-neutral-900">
              {String(value || "Unknown")}
            </p>
            <p className="text-xs text-neutral-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "Phone",
      render: (value: unknown) => String(value || "N/A"),
    },
    {
      key: "applicationType",
      header: "Type",
      render: (value: unknown) => (
        <Badge
          variant={
            value === "admin"
              ? "primary"
              : value === "driver"
                ? "success"
                : "default"
          }
        >
          {String(value || "Unknown")}
        </Badge>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      render: (value: unknown) =>
        value
          ? new Date(String(value)).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_value: unknown, row: UserData) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant={row.isActive ? "outline" : "primary"}
            size="sm"
            leftIcon={row.isActive ? UserMinus : UserPlus}
            onClick={() => {
              if (
                confirm(
                  `Are you sure you want to ${row.isActive ? "deactivate" : "activate"} this user?`,
                )
              ) {
                updateStatusMutation.mutate({
                  userId: row.id,
                  isActive: !row.isActive,
                });
              }
            }}
            isLoading={updateStatusMutation.isPending}
          >
            {row.isActive ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Users</h2>
          <p className="text-neutral-500 mt-1">
            Manage all platform users. Total: {total}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => usersQuery.refetch()}
            isLoading={usersQuery.isFetching}
          >
            Refresh
          </Button>
          <Button variant="primary" leftIcon={UserPlus}>
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
          />
        </div>
        <select
          title="Filter by status"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select-custom py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 min-w-[150px]"
        >
          <option value="">All Users</option>
          <option value="true">Active</option>
          <option value="false">Inactive / Deleted</option>
        </select>
      </div>

      {/* Users Table or Empty State */}
      {users.length === 0 && !usersQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={Users}
            title="No users found"
            description={
              searchQuery
                ? "No users match your search criteria."
                : "No users have been registered yet."
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            data={users}
            columns={columns}
            keyField="id"
            isLoading={usersQuery.isLoading}
            emptyMessage="No users match your search"
            onRowClick={(user) => {
              navigate({
                to: "/admin/users/$userId",
                params: { userId: String(user.id) },
              });
            }}
          />

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-neutral-600">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
