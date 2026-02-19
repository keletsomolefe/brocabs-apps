import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  RideTypeForm,
  RideTypeFormData,
} from "../../../components/ride-types/RideTypeForm";
import { rideTypesApi, UpdateRideTypeDto } from "../../../lib/api";

export const Route = createFileRoute("/admin/ride-types/$rideTypeId")({
  component: EditRideTypePage,
});

function EditRideTypePage() {
  const { rideTypeId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rideType, isLoading } = useQuery({
    queryKey: ["ride-type", rideTypeId],
    queryFn: async () => {
      return rideTypesApi.rideTypesControllerFindOne({
        id: Number(rideTypeId),
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: RideTypeFormData) => {
      return rideTypesApi.rideTypesControllerUpdate({
        id: Number(rideTypeId),
        updateRideTypeDto: data as unknown as UpdateRideTypeDto,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-types"] });
      queryClient.invalidateQueries({ queryKey: ["ride-type", rideTypeId] });
      toast.success("Ride type updated successfully");
      navigate({ to: "/admin/ride-types" });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update ride type");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Loading ride type...
      </div>
    );
  }

  if (!rideType) {
    return (
      <div className="p-8 text-center text-red-500">Ride type not found</div>
    );
  }

  // Transform API response to form data if necessary
  const initialData: RideTypeFormData = {
    code: rideType.code,
    displayName: rideType.displayName,
    description: rideType.description || undefined,
    capacity: rideType.capacity,
    order: rideType.order,
    dispatchRank: rideType.dispatchRank ?? 1,
    baseFare: Number(rideType.baseFare),
    perMinuteRate: Number(rideType.perMinuteRate),
    perKmRate: Number(rideType.perKmRate),
    minFare: Number(rideType.minFare),
    active: rideType.active,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Ride Type</h1>
        <p className="text-neutral-500">
          Update vehicle class and pricing configuration
        </p>
      </div>

      <RideTypeForm
        title={`Edit ${rideType.displayName}`}
        initialData={initialData}
        onSubmit={async (data) => {
          await updateMutation.mutateAsync(data);
        }}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}
