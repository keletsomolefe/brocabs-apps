/**
 * Edit Operating Zone Page
 *
 * Admin interface for editing existing operating zones.
 */

import type {
  OperatingZoneResponseDto,
  UpdateOperatingZoneDto,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MapPin, Save } from "lucide-react";
import { useEffect, useState } from "react";

import {
  ClientOnlyMap,
  type GeoJsonPolygon,
} from "../../../../components/maps";
import { Button, Input } from "../../../../components/ui";
import { operatingZonesApi } from "../../../../lib/api";
import { getPublicConfig } from "../../../../lib/server-config";

export const Route = createFileRoute("/admin/zones/$zoneId/edit")({
  component: EditZonePage,
  loader: async () => {
    const config = await getPublicConfig();
    return { googleMapsApiKey: config.googleMapsApiKey };
  },
});

function EditZonePage() {
  const { googleMapsApiKey } = Route.useLoaderData();
  const { zoneId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [polygon, setPolygon] = useState<GeoJsonPolygon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch zone data using generated API client
  const {
    data: zone,
    isLoading,
    isError,
  } = useQuery<OperatingZoneResponseDto>({
    queryKey: ["operating-zone", zoneId],
    queryFn: () =>
      operatingZonesApi.operatingZonesControllerFindOne({ id: zoneId }),
  });

  // Initialize form with zone data
  useEffect(() => {
    if (zone && !isInitialized) {
      setName(zone.name);
      setDescription(zone.description ? String(zone.description) : "");
      setIsActive(zone.isActive);
      setPolygon(zone.boundary as GeoJsonPolygon);
      setIsInitialized(true);
    }
  }, [zone, isInitialized]);

  // Update mutation using generated API client
  const updateMutation = useMutation({
    mutationFn: (dto: UpdateOperatingZoneDto) =>
      operatingZonesApi.operatingZonesControllerUpdate({
        id: zoneId,
        updateOperatingZoneDto: dto,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operating-zones"] });
      queryClient.invalidateQueries({ queryKey: ["operating-zone", zoneId] });
      navigate({ to: "/admin/zones" });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Zone name is required");
      return;
    }

    if (!polygon) {
      setError("Please draw a polygon boundary on the map");
      return;
    }

    if (polygon.coordinates[0].length < 4) {
      setError("Polygon must have at least 3 points");
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      boundary: polygon,
      isActive,
    });
  };

  const handlePolygonUpdate = (updatedPolygon: GeoJsonPolygon | null) => {
    setPolygon(updatedPolygon);
    if (error && updatedPolygon) {
      setError(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary-600" />
          <p className="text-neutral-500 mt-4">Loading zone...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !zone) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/admin/zones" })}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">
            Edit Operating Zone
          </h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">
            Failed to load zone. It may have been deleted.
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate({ to: "/admin/zones" })}
            className="mt-4"
          >
            Back to Zones
          </Button>
        </div>
      </div>
    );
  }

  // API key check
  if (!googleMapsApiKey) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/admin/zones" })}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <h1 className="text-2xl font-bold text-neutral-900">
            Edit Operating Zone
          </h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="font-semibold text-red-800">
            Google Maps API Key Required
          </h3>
          <p className="text-red-600 mt-2">
            Please set the{" "}
            <code className="bg-red-100 px-1 rounded">
              VITE_GOOGLE_MAPS_API_KEY
            </code>{" "}
            environment variable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: "/admin/zones" })}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Edit Operating Zone
          </h1>
          <p className="text-neutral-500 mt-1">
            Modify zone details and boundary
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
              <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                Zone Details
              </h2>

              <div className="space-y-4">
                <Input
                  label="Zone Name"
                  placeholder="e.g., Johannesburg CBD"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Description (optional)
                  </label>
                  <textarea
                    placeholder="Brief description of this operating zone..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="block w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-primary-500 focus:ring-primary-200"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700">
                    Zone is active
                  </span>
                </label>
              </div>

              {/* Polygon Status */}
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">
                  Boundary Status
                </h3>
                {polygon ? (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Polygon defined
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {polygon.coordinates[0].length - 1} points
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-700 font-medium">
                      ⚠ No polygon
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Draw a polygon on the map
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  fullWidth
                  leftIcon={Save}
                  isLoading={updateMutation.isPending}
                  disabled={!polygon || !name.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h2 className="font-semibold text-neutral-900 mb-4">
                Edit Zone Boundary
              </h2>
              <ClientOnlyMap
                apiKey={googleMapsApiKey}
                initialCenter={{ lat: -26.2041, lng: 28.0473 }}
                initialZoom={11}
                onPolygonUpdate={handlePolygonUpdate}
                drawingEnabled={true}
                existingPolygon={zone.boundary as GeoJsonPolygon}
                height="600px"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
