/**
 * Admin Zones List Page
 *
 * List and manage operating zones with search functionality.
 */

import type { OperatingZoneResponseDto } from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Edit,
  MapPin,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { operatingZonesApi } from "../../../lib/api";
import { Colors } from "../../../lib/theme";

export const Route = createFileRoute("/admin/zones/")({
  component: AdminZonesPage,
});

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

type ZoneData = OperatingZoneResponseDto & { [key: string]: unknown };

function AdminZonesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const queryClient = useQueryClient();

  // Fetch zones using generated API client
  const {
    data: zones = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["operating-zones", showActiveOnly],
    queryFn: () =>
      operatingZonesApi.operatingZonesControllerFindAll({
        activeOnly: showActiveOnly,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      operatingZonesApi.operatingZonesControllerRemove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operating-zones"] });
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      operatingZonesApi.operatingZonesControllerUpdate({
        id,
        updateOperatingZoneDto: { isActive },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operating-zones"] });
    },
  });

  // Filter zones based on search
  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // DataTable columns - using render(value, row, index) signature
  const columns = [
    {
      key: "name" as const,
      header: "Zone Name",
      render: (_value: unknown, zone: ZoneData) => (
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${Colors.primary[500]}15` }}
          >
            <MapPin
              className="h-4 w-4"
              style={{ color: Colors.primary[500] }}
            />
          </div>
          <div>
            <p className="font-medium text-neutral-900">{zone.name}</p>
            {zone.description && (
              <p className="text-xs text-neutral-500 truncate max-w-[200px]">
                {String(zone.description)}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "isActive" as const,
      header: "Status",
      render: (_value: unknown, zone: ZoneData) => (
        <Badge variant={zone.isActive ? "success" : "default"}>
          {zone.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "boundary" as const,
      header: "Boundary Points",
      render: (_value: unknown, zone: ZoneData) => {
        const boundary = zone.boundary as
          | { coordinates?: number[][][] }
          | undefined;
        const pointCount = boundary?.coordinates?.[0]?.length ?? 0;
        return (
          <span className="text-neutral-600">
            {pointCount > 0 ? `${pointCount - 1} points` : "No boundary"}
          </span>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Created",
      render: (_value: unknown, zone: ZoneData) => (
        <span className="text-neutral-600">
          {formatDate(String(zone.createdAt))}
        </span>
      ),
    },
    {
      key: "actions" as const,
      header: "Actions",
      render: (_value: unknown, zone: ZoneData) => (
        <div className="flex items-center gap-2">
          <Link
            to="/admin/zones/$zoneId/edit"
            params={{ zoneId: zone.id }}
            className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit zone"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() =>
              toggleActiveMutation.mutate({
                id: zone.id,
                isActive: !zone.isActive,
              })
            }
            className={`p-2 rounded-lg transition-colors ${
              zone.isActive
                ? "text-neutral-500 hover:text-orange-600 hover:bg-orange-50"
                : "text-neutral-500 hover:text-green-600 hover:bg-green-50"
            }`}
            title={zone.isActive ? "Deactivate zone" : "Activate zone"}
          >
            {zone.isActive ? (
              <PowerOff className="h-4 w-4" />
            ) : (
              <Power className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${zone.name}"?`)) {
                deleteMutation.mutate(zone.id);
              }
            }}
            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete zone"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Operating Zones
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage driver operating areas by drawing polygon boundaries
          </p>
        </div>
        <Link to="/admin/zones/create">
          <Button leftIcon={Plus}>Create Zone</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search zones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            />
          </div>

          {/* Filter Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-600">Active only</span>
          </label>

          {/* Refresh */}
          <Button
            variant="secondary"
            leftIcon={RefreshCw}
            onClick={() => refetch()}
            isLoading={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Zones Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
        {isError ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Failed to load zones</p>
            <Button
              variant="secondary"
              onClick={() => refetch()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : filteredZones.length === 0 && !isLoading ? (
          <EmptyState
            icon={MapPin}
            title="No zones found"
            description={
              searchQuery
                ? "No zones match your search criteria"
                : "Get started by creating your first operating zone"
            }
          />
        ) : (
          <DataTable
            data={filteredZones as ZoneData[]}
            columns={columns}
            keyField="id"
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
