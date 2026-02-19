/**
 * API communications with google maps services
 */
import { find } from "lodash";
import { z } from "zod";

import { AppConfig } from "~/config";

const {
  apiKey,
  maps: { autocompleteUrl, placeDetailsUrl, geocodeUrl },
} = AppConfig.google;

/**
 * Gets the postal code of address
 *
 * @param addressComponents - contains the address names
 * @returns The postal code of the address
 */
export const getPostalCode = (addressComponents: any[]) => {
  const addressComponent = find(addressComponents, (comp) =>
    comp.types.some((t: string) => t === "postal_code")
  );
  let postalCode: string | undefined = undefined;
  if (addressComponent) {
    postalCode =
      addressComponent.shortText ||
      addressComponent.longText ||
      addressComponent.short_name ||
      addressComponent.long_name ||
      undefined;
  }

  return postalCode;
};

/**
 * Gets the address details given a placeId
 *
 * @param placeId - ID of the the place
 * @returns Details of the address
 */
export const getPlaceDetails = (placeId: string) =>
  fetch(`${placeDetailsUrl}/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey ?? "",
      "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents,types",
    },
  })
    .then((res) => res.json() as Promise<google.maps.places.Place>)
    .then((data) => {
      const { location, formattedAddress, addressComponents, displayName, types } = data;

      let address = formattedAddress;
      // @ts-ignore - Handle potential snake_case from different API versions
      const components = addressComponents || data.address_components;

      if (components) {
        const getComponent = (type: string) => {
          const comp = components.find((c: any) => c.types.includes(type));
          return comp?.longText || comp?.shortText || comp?.long_name || comp?.short_name;
        };

        const streetNumber = getComponent("street_number");
        const route = getComponent("route");

        if (streetNumber && route) {
          address = `${streetNumber} ${route}`;
        } else if (route) {
          address = route;
        }
      }

      // If it's a business/POI (not just a street address), prefer the display name
      const isAddress = types?.some((t) =>
        ["street_address", "route", "premise", "subpremise", "intersection"].includes(t)
      );

      // @ts-ignore - displayName is an object in Places API v1
      const nameText = displayName?.text || displayName;

      if (!isAddress && nameText) {
        address = nameText;
      } else if ((!address || address === "Unnamed Road") && nameText) {
        // Fallback to display name if address construction failed or is generic
        address = nameText;
      }

      return {
        address,
        coordinates: location as unknown as Coordinates,
        placeId,
        postalCode: getPostalCode(components ?? []),
      } as PlaceDetails;
    });

/**
 * Get address from coordinates using Google Geocoding API
 *
 * @param latitude
 * @param longitude
 * @returns Formatted address
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal
): Promise<string> {
  const url = `${geocodeUrl}?latlng=${latitude},${longitude}&key=${apiKey}`;

  const response = await fetch(url, { signal });
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const result = data.results[0];
    const components = result.address_components as {
      long_name: string;
      short_name: string;
      types: string[];
    }[];

    const streetNumber = components.find((c) => c.types.includes("street_number"))?.long_name;
    const route = components.find((c) => c.types.includes("route"))?.long_name;

    // Priority 1: Street number + route (e.g., "123 Main Street")
    if (streetNumber && route) {
      return `${streetNumber} ${route}`;
    }

    // Priority 2: Just route name
    if (route) {
      return route;
    }

    // Priority 3: Point of interest / establishment name (e.g., "Starbucks", "Mall of Africa")
    const pointOfInterest = components.find(
      (c) => c.types.includes("point_of_interest") || c.types.includes("establishment")
    )?.long_name;

    if (pointOfInterest) {
      return pointOfInterest;
    }

    // Priority 4: Premise name (building/complex name)
    const premise = components.find((c) => c.types.includes("premise"))?.long_name;

    if (premise) {
      return premise;
    }

    // Priority 5: Neighborhood or sublocality
    const neighborhood =
      components.find((c) => c.types.includes("neighborhood"))?.long_name ||
      components.find((c) => c.types.includes("sublocality"))?.long_name;

    if (neighborhood) {
      return neighborhood;
    }

    // Fallback: Use first result's name if available, otherwise formatted address
    // Extract just the first part of formatted address (before the first comma)
    const formattedAddress = result.formatted_address;
    const shortAddress = formattedAddress.split(",")[0].trim();

    return shortAddress || formattedAddress;
  }

  return "Unknown Location";
}

/**
 * Get the predictions of address wanted
 *
 * @param searchText - Input needed for predictions
 * @returns Predictions of address wanted
 */
export async function getAutocompletePredictions(searchText: string) {
  if (!searchText) {
    return [];
  }

  return fetch(autocompleteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey ?? "",
    },
    body: JSON.stringify({
      input: searchText,
      regionCode: "ZA",
    }),
  })
    .then(
      (res) =>
        res.json() as Promise<{
          suggestions: google.maps.places.AutocompleteSuggestion[];
        }>
    )
    .then((data) => data.suggestions);
}

export const CoordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const PlaceDetailsSchema = z.object({
  address: z.string(),
  coordinates: CoordinatesSchema,
  placeId: z.string(),
  postalCode: z.string().optional(),
});

/** Google type definitions */
export type PlaceDetails = z.infer<typeof PlaceDetailsSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
