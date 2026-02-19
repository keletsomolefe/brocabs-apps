/**
 * Create Operating Zone Page
 *
 * Admin interface for creating new operating zones by drawing polygon boundaries on Google Maps.
 */

import type { CreateOperatingZoneDto } from "@brocabs/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { useState } from "react";

import { ClientOnlyMap, type GeoJsonPolygon } from "../../../components/maps";
import { Button, Input } from "../../../components/ui";
import { operatingZonesApi } from "../../../lib/api";
import { getPublicConfig } from "../../../lib/server-config";

export const Route = createFileRoute("/admin/zones/create")({
  component: CreateZonePage,
  loader: async () => {
    const config = await getPublicConfig();
    return { googleMapsApiKey: config.googleMapsApiKey };
  },
});

function CreateZonePage() {
  const { googleMapsApiKey } = Route.useLoaderData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [polygon, setPolygon] = useState<GeoJsonPolygon | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create mutation using generated API client
  const createMutation = useMutation({
    mutationFn: (dto: CreateOperatingZoneDto) =>
      operatingZonesApi.operatingZonesControllerCreate({
        createOperatingZoneDto: dto,
      }),
    onSuccess: () => {
      // Invalidate the zones list cache so it refetches with the new zone
      queryClient.invalidateQueries({ queryKey: ["operating-zones"] });
      navigate({ to: "/admin/zones" });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!name.trim()) {
      setError("Zone name is required");
      return;
    }

    if (!polygon) {
      setError("Please draw a polygon boundary on the map");
      return;
    }

    // Validate polygon has enough points
    if (polygon.coordinates[0].length < 4) {
      setError(
        "Polygon must have at least 3 points (4 coordinates including closing point)",
      );
      return;
    }

    createMutation.mutate({
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

  // Check if API key is configured
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
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Create Operating Zone
            </h1>
            <p className="text-neutral-500 mt-1">
              Draw polygon boundaries on the map
            </p>
          </div>
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
            environment variable in your root{" "}
            <code className="bg-red-100 px-1 rounded">.env</code> file.
          </p>
          <p className="text-red-600 mt-2 text-sm">
            You can copy the key from the mobile app's eas.json configuration:
            <br />
            <code className="bg-red-100 px-1 rounded text-xs">
              EXPO_PUBLIC_GOOGLE_API_KEY
            </code>
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
            Create Operating Zone
          </h1>
          <p className="text-neutral-500 mt-1">
            Draw polygon boundaries on the map
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
                      ✓ Polygon drawn
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {polygon.coordinates[0].length - 1} points defined
                    </p>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-sm text-amber-700 font-medium">
                      ⚠ No polygon
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Draw a polygon on the map to define the zone boundary
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
                  isLoading={createMutation.isPending}
                  disabled={!polygon || !name.trim()}
                >
                  Create Zone
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-medium text-neutral-900 mb-3">
                How to draw a zone
              </h3>
              <ol className="space-y-2 text-sm text-neutral-600">
                <li className="flex gap-2">
                  <span className="font-medium text-primary-600">1.</span>
                  Click on the map to start drawing
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-primary-600">2.</span>
                  Click to add each corner point
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-primary-600">3.</span>
                  Click on the first point to close the polygon
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-primary-600">4.</span>
                  Drag points to adjust the boundary
                </li>
              </ol>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
              <h2 className="font-semibold text-neutral-900 mb-4">
                Draw Zone Boundary
              </h2>
              <ClientOnlyMap
                apiKey={googleMapsApiKey}
                initialCenter={{ lat: -26.2041, lng: 28.0473 }} // Johannesburg
                initialZoom={11}
                onPolygonUpdate={handlePolygonUpdate}
                drawingEnabled={true}
                height="600px"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
