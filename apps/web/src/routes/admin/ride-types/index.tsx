import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, Edit } from "lucide-react";
import { Badge, DataTable, EmptyState } from "../../../components/ui";
import {
  RideTypeListResponseDto,
  RideTypeResponseDto,
  rideTypesApi,
} from "../../../lib/api";

export const Route = createFileRoute("/admin/ride-types/")({
  component: RideTypesListPage,
});

function RideTypesListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["ride-types"],
    queryFn: async () => {
      const response = await rideTypesApi.rideTypesControllerListAllRideTypes();
      return response as RideTypeListResponseDto;
    },
  });

  const rideTypes = data?.data || [];

  const columns = [
    {
      key: "displayName",
      header: "Name",
      render: (value: unknown, row: unknown) => (
        <div className="flex flex-col">
          <span className="font-medium text-neutral-900">
            {value as string}
          </span>
          <span className="text-xs text-neutral-500">
            {(row as RideTypeResponseDto).code}
          </span>
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      render: (value: unknown) => (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
          {value as number}
        </span>
      ),
    },
    {
      key: "dispatchRank",
      header: "Rank",
      render: (value: unknown) => (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {(value as number) ?? 1}
        </span>
      ),
    },
    {
      key: "baseFare",
      header: "Base Fare",
      render: (value: unknown) => `R${Number(value).toFixed(2)}`,
    },
    {
      key: "perKmRate",
      header: "Rate / km",
      render: (value: unknown) => `R${Number(value).toFixed(2)}`,
    },
    {
      key: "perMinuteRate",
      header: "Rate / min",
      render: (value: unknown) => `R${Number(value).toFixed(2)}`,
    },
    {
      key: "minFare",
      header: "Min Fare",
      render: (value: unknown) => `R${Number(value).toFixed(2)}`,
    },
    {
      key: "active",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={value ? "success" : "default"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (_: unknown, row: unknown) => (
        <div className="flex justify-end">
          <Link
            to="/admin/ride-types/$rideTypeId"
            params={{ rideTypeId: String((row as RideTypeResponseDto).id) }}
            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Loading ride types...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Ride Types</h1>
          <p className="text-neutral-500">Manage vehicle classes and pricing</p>
        </div>
      </div>

      {rideTypes.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No ride types found"
          description="Contact support to initialize ride types."
        />
      ) : (
        <DataTable data={rideTypes as any} columns={columns} keyField="id" />
      )}
    </div>
  );
}
