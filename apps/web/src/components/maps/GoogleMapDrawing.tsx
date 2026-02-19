/**
 * Google Maps Polygon Drawing Component (Client-only)
 *
 * A wrapper component that renders Google Maps with drawing capabilities.
 * Designed to work with TanStack Start SSR by being loaded client-side only.
 * Uses the new functional API from @googlemaps/js-api-loader v2.x
 */

/// <reference types="@types/google.maps" />

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * GeoJSON Polygon type
 */
export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

interface GoogleMapDrawingProps {
  /** Google Maps API Key */
  apiKey: string;
  /** Initial center coordinates [lat, lng] */
  initialCenter?: { lat: number; lng: number };
  /** Initial zoom level */
  initialZoom?: number;
  /** Callback when polygon is completed */
  onPolygonComplete?: (polygon: GeoJsonPolygon) => void;
  /** Callback when polygon is updated */
  onPolygonUpdate?: (polygon: GeoJsonPolygon | null) => void;
  /** Whether drawing is enabled */
  drawingEnabled?: boolean;
  /** Existing polygon to display (for editing) */
  existingPolygon?: GeoJsonPolygon | null;
  /** Height of the map container */
  height?: string;
}

/**
 * Convert Google Maps Path to GeoJSON Polygon
 * GeoJSON uses [lng, lat] format, and requires the polygon to be closed
 */
function pathToGeoJson(
  path: google.maps.MVCArray<google.maps.LatLng>,
): GeoJsonPolygon {
  const coordinates: number[][] = [];

  for (let i = 0; i < path.getLength(); i++) {
    const point = path.getAt(i);
    // GeoJSON format: [longitude, latitude]
    coordinates.push([point.lng(), point.lat()]);
  }

  // Close the polygon by adding the first point at the end
  if (coordinates.length > 0) {
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      coordinates.push([...first]);
    }
  }

  return {
    type: "Polygon",
    coordinates: [coordinates],
  };
}

/**
 * Convert GeoJSON Polygon to Google Maps Path
 * Note: GeoJSON polygons are closed (first point = last point), but Google Maps
 * Polygon doesn't want the closing point duplicated, so we remove it.
 */
function geoJsonToPath(geoJson: GeoJsonPolygon): google.maps.LatLngLiteral[] {
  const ring = geoJson.coordinates[0]; // Exterior ring

  // Remove the closing point if present (GeoJSON requires closed, Google Maps doesn't)
  let points = ring;
  if (ring.length > 1) {
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] === last[0] && first[1] === last[1]) {
      points = ring.slice(0, -1); // Remove last point
    }
  }

  return points.map(([lng, lat]) => ({ lat, lng }));
}

// Track if setOptions has been called
let optionsSet = false;

export function GoogleMapDrawing({
  apiKey,
  initialCenter = { lat: -26.2041, lng: 28.0473 }, // Johannesburg, SA
  initialZoom = 11,
  onPolygonComplete,
  onPolygonUpdate,
  drawingEnabled = true,
  existingPolygon = null,
  height = "500px",
}: GoogleMapDrawingProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager | null>(null);
  const [currentPolygon, setCurrentPolygon] =
    useState<google.maps.Polygon | null>(null);
  const currentPolygonRef = useRef<google.maps.Polygon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const overlayTypeRef = useRef<typeof google.maps.drawing.OverlayType | null>(
    null,
  );

  // Store initial values in refs to prevent re-initialization on parent re-renders
  const initialCenterRef = useRef(initialCenter);
  const initialZoomRef = useRef(initialZoom);
  const apiKeyRef = useRef(apiKey);
  const mapInitializedRef = useRef(false);

  // Store callbacks in refs to avoid stale closures
  const onPolygonCompleteRef = useRef(onPolygonComplete);
  const onPolygonUpdateRef = useRef(onPolygonUpdate);
  onPolygonCompleteRef.current = onPolygonComplete;
  onPolygonUpdateRef.current = onPolygonUpdate;

  // Initialize Google Maps using the new functional API
  useEffect(() => {
    if (!mapRef.current || mapInitializedRef.current) return;

    const initMap = async () => {
      try {
        // Set options only once (subsequent calls are ignored by the library)
        if (!optionsSet) {
          setOptions({ key: apiKeyRef.current, v: "weekly" });
          optionsSet = true;
        }

        // Import required libraries using the new functional API
        const [mapsLib, drawingLib] = await Promise.all([
          importLibrary("maps") as Promise<google.maps.MapsLibrary>,
          importLibrary("drawing") as Promise<google.maps.DrawingLibrary>,
        ]);

        if (!mapRef.current) return;

        // Create the map using the imported library
        const mapInstance = new mapsLib.Map(mapRef.current, {
          center: initialCenterRef.current,
          zoom: initialZoomRef.current,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setMap(mapInstance);
        mapInitializedRef.current = true;

        // Store OverlayType for later use
        overlayTypeRef.current = drawingLib.OverlayType;

        // Create Drawing Manager using the imported library
        const drawingManagerInstance = new drawingLib.DrawingManager({
          drawingMode: drawingEnabled ? drawingLib.OverlayType.POLYGON : null,
          drawingControl: drawingEnabled,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [drawingLib.OverlayType.POLYGON],
          },
          polygonOptions: {
            fillColor: "#5E29FF",
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: "#5E29FF",
            editable: true,
            draggable: true,
          },
        });

        drawingManagerInstance.setMap(mapInstance);
        setDrawingManager(drawingManagerInstance);

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Google Maps:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to load Google Maps: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    initMap();
  }, [drawingEnabled]);

  // Handle polygon completion
  useEffect(() => {
    if (!drawingManager) return;

    const listener = google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      (polygon: google.maps.Polygon) => {
        // Remove previous polygon if exists (use ref to avoid stale closure)
        if (currentPolygonRef.current) {
          currentPolygonRef.current.setMap(null);
        }

        // Store in both ref and state
        currentPolygonRef.current = polygon;
        setCurrentPolygon(polygon);

        // Disable drawing mode after completion
        drawingManager.setDrawingMode(null);

        // Convert to GeoJSON and notify parent using refs for stable callbacks
        const path = polygon.getPath();
        const geoJson = pathToGeoJson(path);
        onPolygonCompleteRef.current?.(geoJson);
        onPolygonUpdateRef.current?.(geoJson);

        // Add listeners for polygon edits
        google.maps.event.addListener(path, "set_at", () => {
          const updatedGeoJson = pathToGeoJson(polygon.getPath());
          onPolygonUpdateRef.current?.(updatedGeoJson);
        });

        google.maps.event.addListener(path, "insert_at", () => {
          const updatedGeoJson = pathToGeoJson(polygon.getPath());
          onPolygonUpdateRef.current?.(updatedGeoJson);
        });

        google.maps.event.addListener(path, "remove_at", () => {
          const updatedGeoJson = pathToGeoJson(polygon.getPath());
          onPolygonUpdateRef.current?.(updatedGeoJson);
        });
      },
    );

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [drawingManager]);

  // Handle existing polygon display
  useEffect(() => {
    if (!map || !existingPolygon) return;

    // Remove current polygon if exists (use ref to avoid stale closure)
    if (currentPolygonRef.current) {
      currentPolygonRef.current.setMap(null);
    }

    // Create new polygon from GeoJSON
    const path = geoJsonToPath(existingPolygon);
    const polygon = new google.maps.Polygon({
      paths: path,
      fillColor: "#5E29FF",
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: "#5E29FF",
      editable: true,
      draggable: true,
    });

    polygon.setMap(map);
    currentPolygonRef.current = polygon;
    setCurrentPolygon(polygon);

    // Fit map bounds to polygon with padding for better visibility
    const bounds = new google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    });

    // Limit the zoom level to match the creation experience
    // fitBounds can zoom in too close for small polygons
    google.maps.event.addListenerOnce(map, "idle", () => {
      const currentZoom = map.getZoom();
      if (currentZoom !== undefined && currentZoom > initialZoomRef.current) {
        map.setZoom(initialZoomRef.current);
      }
    });

    // Add edit listeners
    const polygonPath = polygon.getPath();
    google.maps.event.addListener(polygonPath, "set_at", () => {
      const updatedGeoJson = pathToGeoJson(polygon.getPath());
      onPolygonUpdateRef.current?.(updatedGeoJson);
    });

    google.maps.event.addListener(polygonPath, "insert_at", () => {
      const updatedGeoJson = pathToGeoJson(polygon.getPath());
      onPolygonUpdateRef.current?.(updatedGeoJson);
    });
  }, [map, existingPolygon]);

  // Clear polygon handler
  const handleClearPolygon = useCallback(() => {
    if (currentPolygonRef.current) {
      currentPolygonRef.current.setMap(null);
      currentPolygonRef.current = null;
      setCurrentPolygon(null);
      onPolygonUpdateRef.current?.(null);
    }
    if (drawingManager && drawingEnabled && overlayTypeRef.current) {
      drawingManager.setDrawingMode(overlayTypeRef.current.POLYGON);
    }
  }, [drawingManager, drawingEnabled]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-neutral-100 rounded-xl"
        style={{ height }}
      >
        <div className="text-center p-6">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-neutral-500 text-sm mt-2">
            Please check your Google Maps API key configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-xl z-10"
          style={{ height }}
        >
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
            <p className="text-neutral-500 mt-2">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="rounded-xl overflow-hidden"
        style={{ height }}
      />
      {currentPolygon && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClearPolygon}
            className="bg-white px-4 py-2 rounded-lg shadow-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Clear Polygon
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Client-only wrapper for SSR compatibility
 * Prevents the component from rendering on the server
 */
export function ClientOnlyMap(props: GoogleMapDrawingProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className="flex items-center justify-center bg-neutral-100 rounded-xl"
        style={{ height: props.height || "500px" }}
      >
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
          <p className="text-neutral-500 mt-2">Loading map...</p>
        </div>
      </div>
    );
  }

  return <GoogleMapDrawing {...props} />;
}
