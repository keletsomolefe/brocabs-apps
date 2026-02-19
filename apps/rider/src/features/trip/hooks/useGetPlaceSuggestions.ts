import { useMutation } from "@tanstack/react-query";

import { getAutocompletePredictions, getPlaceDetails } from "~/services/map";

export function useGetPlaceSuggestions() {
  return useMutation({
    mutationKey: ["getPlaceSuggestions"],
    mutationFn: getAutocompletePredictions,
  });
}

export function useGetPlaceDetails() {
  return useMutation({
    mutationKey: ["getPlaceDetails"],
    mutationFn: getPlaceDetails,
  });
}
