/**
 * Geographic utility functions for distance calculations and route snapping
 */

export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the Haversine distance between two coordinates in meters
 * @param a First coordinate
 * @param b Second coordinate
 * @returns Distance in meters
 */
export function haversine(a: Coordinate, b: Coordinate): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
}

/**
 * Find the closest point on a line segment to a given point
 * @param point The point to find the closest position for
 * @param segStart Start of the line segment
 * @param segEnd End of the line segment
 * @returns The closest point on the segment
 */
export function closestPointOnSegment(
  point: Coordinate,
  segStart: Coordinate,
  segEnd: Coordinate,
): Coordinate {
  const dx = segEnd.longitude - segStart.longitude;
  const dy = segEnd.latitude - segStart.latitude;

  if (dx === 0 && dy === 0) {
    return segStart;
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.longitude - segStart.longitude) * dx +
        (point.latitude - segStart.latitude) * dy) /
        (dx * dx + dy * dy),
    ),
  );

  return {
    latitude: segStart.latitude + t * dy,
    longitude: segStart.longitude + t * dx,
  };
}

/**
 * Snap a driver's position to a route and return the remaining route
 * @param coords The full route coordinates
 * @param driverLat Driver's current latitude
 * @param driverLon Driver's current longitude
 * @returns Object containing snapped driver position and remaining route
 */
export function getSnappedDriverRoute(
  coords: Coordinate[],
  driverLat: number | undefined,
  driverLon: number | undefined,
): {
  snappedDriverPosition: Coordinate | null;
  remainingRoute: Coordinate[];
} {
  if (coords.length === 0 || !driverLat || !driverLon) {
    return { snappedDriverPosition: null, remainingRoute: [] };
  }

  const driverPos = { latitude: driverLat, longitude: driverLon };

  let minDist = Infinity;
  let nearestSegmentIndex = 0;
  let snappedPoint = coords[0];

  for (let i = 0; i < coords.length - 1; i++) {
    const closestOnSeg = closestPointOnSegment(
      driverPos,
      coords[i],
      coords[i + 1],
    );
    const d = haversine(driverPos, closestOnSeg);
    if (d < minDist) {
      minDist = d;
      nearestSegmentIndex = i;
      snappedPoint = closestOnSeg;
    }
  }

  const remaining = [snappedPoint, ...coords.slice(nearestSegmentIndex + 1)];

  return {
    snappedDriverPosition: snappedPoint,
    remainingRoute: remaining,
  };
}
