import { LatLng } from "react-native-maps";

/**
 * Calculates a new coordinate point given a starting point, bearing, and distance.
 * Uses a simplified calculation suitable for small distances (< 100km).
 *
 * @param start - The starting coordinate { latitude, longitude }
 * @param bearing - The direction in degrees (0-360, where 0 is North)
 * @param distanceKm - The distance in kilometers
 * @returns A new coordinate point
 */
export function calculateDestinationPoint(
  start: LatLng,
  bearing: number,
  distanceKm: number
): LatLng {
  const earthRadiusKm = 6371;

  // Convert to radians
  const lat1 = (start.latitude * Math.PI) / 180;
  const lon1 = (start.longitude * Math.PI) / 180;
  const bearingRad = (bearing * Math.PI) / 180;

  const angularDistance = distanceKm / earthRadiusKm;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );

  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    latitude: (lat2 * 180) / Math.PI,
    longitude: (lon2 * 180) / Math.PI,
  };
}

/**
 * Generates cone polygon coordinates representing the user's field of view / direction.
 *
 * @param center - The user's current location
 * @param heading - The compass heading in degrees (0-360)
 * @param coneAngle - The total cone angle in degrees (default 60°)
 * @param radiusKm - The cone's reach in kilometers (default 0.15km = 150m)
 * @returns Array of LatLng points forming the cone polygon
 */
export function generateConeCoordinates(
  center: LatLng,
  heading: number,
  coneAngle: number = 60,
  radiusKm: number = 0.15
): LatLng[] {
  const halfAngle = coneAngle / 2;

  // Left edge of cone
  const leftBearing = (heading - halfAngle + 360) % 360;
  const leftPoint = calculateDestinationPoint(center, leftBearing, radiusKm);

  // Right edge of cone
  const rightBearing = (heading + halfAngle + 360) % 360;
  const rightPoint = calculateDestinationPoint(center, rightBearing, radiusKm);

  // Return cone as a triangle: center -> left -> right -> center
  return [center, leftPoint, rightPoint, center];
}
