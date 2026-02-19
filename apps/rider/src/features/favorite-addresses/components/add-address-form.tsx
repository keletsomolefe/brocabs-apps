import { getShadow } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { Container, Fill } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LocationPoint } from "~/features/trip/context/ride-context";
import { getMatchedSegments } from "~/features/trip/helpers";
import {
  useGetPlaceDetails,
  useGetPlaceSuggestions,
} from "~/features/trip/hooks/useGetPlaceSuggestions";
import { useAddFavoriteAddress } from "~/hooks/use-favorite-addresses";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { TextField } from "~/shared/ui/textfield";

const shadow = getShadow(3, "umbra");

export function AddAddressForm() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [addressText, setAddressText] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<LocationPoint | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const mapRef = useRef<MapView>(null);
  const { mutateAsync: getPlaceSuggestions, isPending } = useGetPlaceSuggestions();
  const { mutateAsync: getPlaceDetails } = useGetPlaceDetails();
  const { mutate: addAddress, isPending: isSaving } = useAddFavoriteAddress();

  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (text.length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const newSuggestions = await getPlaceSuggestions(text);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Error fetching place suggestions", error);
        setSuggestions([]);
      }
    },
    [getPlaceSuggestions]
  );

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 600),
    [fetchSuggestions]
  );

  const handleTextChange = useCallback(
    (text: string) => {
      setAddressText(text);
      setSelectedAddress(null);
      debouncedFetchSuggestions?.cancel();
      if (text.length > 0) {
        debouncedFetchSuggestions(text);
      } else {
        setSuggestions([]);
      }
    },
    [debouncedFetchSuggestions]
  );

  const handleSelectAddress = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      const placeId = suggestion.placePrediction?.placeId;
      // @ts-ignore - structuredFormat might not be in the type definition yet
      const mainText = suggestion.placePrediction?.structuredFormat?.mainText?.text;
      const addressText = mainText || suggestion.placePrediction?.text.text || "";

      if (!addressText) return;

      // Clear suggestions first
      setSuggestions([]);
      setIsFocused(false);

      // Set the address text immediately
      setAddressText(addressText);

      if (placeId) {
        try {
          const placeDetails = await getPlaceDetails(placeId);
          const fullAddress = placeDetails.address || addressText;

          const location = {
            latitude: placeDetails.coordinates?.latitude || 0,
            longitude: placeDetails.coordinates?.longitude || 0,
            address: fullAddress,
          };
          setSelectedAddress(location);
          setAddressText(fullAddress);
          inputRef.current?.blur();

          // Center map on selected location
          if (location.latitude && location.longitude && mapRef.current) {
            mapRef.current.animateToRegion(
              {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              500
            );
          }
        } catch (error) {
          console.error("Error getting place details:", error);
          // Even if place details fail, set the address text
          setSelectedAddress({
            latitude: 0,
            longitude: 0,
            address: addressText,
          });
        }
      } else {
        // If no placeId, still allow saving with just the text
        setSelectedAddress({
          latitude: 0,
          longitude: 0,
          address: addressText,
        });
        inputRef.current?.blur();
      }
    },
    [getPlaceDetails]
  );

  const handleSave = () => {
    if (!label.trim() || !selectedAddress) {
      // TODO: Show validation error
      return;
    }

    addAddress(
      {
        label,
        address: selectedAddress.address || "",
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  //   const renderSuggestion = ({ item }: { item: google.maps.places.AutocompleteSuggestion }) => {
  //   const { text, matches } = item.placePrediction?.text || {};
  //   const segments = getMatchedSegments(text || "", matches || []);

  //   return (
  //     <Pressable
  //       onPress={() => handleSelectAddress(item)}
  //       style={({ pressed }) => ({
  //         opacity: pressed ? 0.7 : 1,
  //         paddingHorizontal: 12,
  //         paddingVertical: 12,
  //         borderBottomWidth: 1,
  //         borderBottomColor: Colors["Neutrals/200"],
  //       })}>
  //       <Regular numberOfLines={1}>
  //         {segments.map((segment, idx) =>
  //           segment.bold ? (
  //             <SemiBold key={idx}>{segment.text}</SemiBold>
  //           ) : (
  //             <Regular key={idx}>{segment.text}</Regular>
  //           )
  //         )}
  //       </Regular>
  //     </Pressable>
  //   );
  // };

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Container px={20} pt={20} gap={16}>
          <Container gap={8}>
            <Medium fontSize={16} color="Primary/50">
              {t("common.addressLabel")}
            </Medium>
            <TextField
              value={label}
              onChangeText={setLabel}
              placeholder={t("common.addressLabelPlaceholder")}
              placeholderTextColor={Colors["Neutrals/400"]}
              autoCapitalize="words"
              clearButtonMode="while-editing"
            />
          </Container>

          <Container gap={10}>
            <Medium fontSize={16} color="Primary/50">
              {t("common.searchAddress")}
            </Medium>
            <Container
              backgroundColor="Input Color"
              borderRadius={15}
              px={16}
              height={50}
              borderWidth={1}
              borderColor={
                selectedAddress
                  ? Colors["Primary/600"]
                  : isFocused
                    ? Colors["Primary/400"]
                    : Colors["Input Color"]
              }
              flexDirection="row"
              alignItems="center"
              gap={10}>
              <Icon name="location" width={24} height={24} color={Colors["Primary/400"]} />
              <TextInput
                ref={inputRef}
                value={addressText}
                onChangeText={handleTextChange}
                placeholder={t("common.searchForAddress")}
                placeholderTextColor={Colors["Neutrals/400"]}
                clearButtonMode="while-editing"
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Delay blur to allow suggestion selection
                  setTimeout(() => setIsFocused(false), 200);
                }}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: Colors["Primary/50"],
                }}
              />
              {isPending && <ActivityIndicator size="small" color={Colors["Primary/600"]} />}
            </Container>
            {selectedAddress &&
              selectedAddress.latitude !== 0 &&
              selectedAddress.longitude !== 0 && (
                <Container
                  backgroundColor="white"
                  borderRadius={20}
                  p={2}
                  gap={8}
                  style={[styles.mapContainer, shadow]}>
                  <Container borderRadius={15} overflow="hidden" flex={1}>
                    <MapView
                      ref={mapRef}
                      provider={PROVIDER_GOOGLE}
                      style={styles.map}
                      initialRegion={{
                        latitude: selectedAddress.latitude,
                        longitude: selectedAddress.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      showsUserLocation={false}
                      showsMyLocationButton={false}
                      scrollEnabled={true}
                      zoomEnabled={true}
                      pitchEnabled={false}
                      rotateEnabled={false}>
                      <Marker
                        coordinate={{
                          latitude: selectedAddress.latitude,
                          longitude: selectedAddress.longitude,
                        }}></Marker>
                    </MapView>
                  </Container>
                  <Container px={2} py={1}>
                    <Regular fontSize={16} color="Neutrals/950">
                      {selectedAddress.address}
                    </Regular>
                  </Container>
                </Container>
              )}
          </Container>

          {suggestions.length > 0 && isFocused && (
            <Container
              backgroundColor="white"
              borderRadius={20}
              style={[
                {
                  maxHeight: 300,
                },
                shadow,
              ]}>
              {suggestions.map((item, index) => {
                const { text, matches } = item.placePrediction?.text || {};
                const segments = getMatchedSegments(text || "", matches || []);

                return (
                  <Pressable
                    key={item.placePrediction?.placeId || item.placePrediction?.text.text || index}
                    onPress={() => handleSelectAddress(item)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                      borderBottomColor: Colors["Neutrals/200"],
                    })}>
                    <Regular numberOfLines={1}>
                      {segments.map((segment, idx) =>
                        segment.bold ? (
                          <SemiBold key={idx}>{segment.text}</SemiBold>
                        ) : (
                          <Regular key={idx}>{segment.text}</Regular>
                        )
                      )}
                    </Regular>
                  </Pressable>
                );
              })}
            </Container>
          )}
        </Container>
      </ScrollView>

      <Container
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px={20}
        py={16}
        style={{ paddingBottom: insets.bottom }}>
        <Button
          label={t("common.saveAddress")}
          onPress={handleSave}
          variant="primary"
          radius="rounded"
          disabled={!label.trim() || !selectedAddress || isSaving}
          isLoading={isSaving}
        />
      </Container>
    </Fill>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 250,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    flex: 1,
  },
});
