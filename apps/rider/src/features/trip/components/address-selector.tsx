import { FavoriteAddress } from "@brocabs/client";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { debounce } from "lodash";
import { PressableScale } from "pressto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Keyboard, ListRenderItem, StyleSheet, TextInput } from "react-native";
import { KeyboardEvents } from "react-native-keyboard-controller";

import { Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Visible } from "@brocabs/ui/visible";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

import { getShadow } from "@brocabs/ui";
import { MapPin } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { useFavoriteAddresses } from "~/hooks/use-favorite-addresses";
import { LocationPoint } from "../context/ride-context";
import { getMatchedSegments } from "../helpers";
import { useGetPlaceDetails, useGetPlaceSuggestions } from "../hooks/useGetPlaceSuggestions";
import { AddressSearchInput } from "./address-search-input";

const DEBOUNCE_DELAY = 600;

type ActiveField = "pickup" | "destination" | null;

export interface AddressSelectorProps {
  pickupAddress?: LocationPoint;
  destinationAddress?: LocationPoint;
  onAddressSelected?: (address: string, field: "pickup" | "destination") => void;
  onLocationSelected?: (
    location: { latitude: number; longitude: number; address: string },
    field: "pickup" | "destination"
  ) => void;
  showTitle?: boolean;
  onClose?: () => void;
  showCurrentLocationButton?: boolean;
  initialActiveField?: ActiveField;
  onPickupBlur?: () => void;
  onDestinationBlur?: () => void;
  onPickupClear?: () => void;
  onDestinationClear?: () => void;
  onMapPress?: (field: "pickup" | "destination") => void;
  isVisible?: boolean;
}

interface AddressSelectorFormData {
  pickupLocationText: string;
  destinationLocationText: string;
}

export function AddressSelector({
  onAddressSelected,
  onLocationSelected,
  showTitle = true,
  showCurrentLocationButton = true,
  initialActiveField = null,
  onMapPress,
  isVisible = true,
  destinationAddress,
  pickupAddress,
  onClose,
  onPickupClear,
  onDestinationClear,
}: AddressSelectorProps) {
  const { t } = useTranslation();
  const pickupInputRef = useRef<TextInput>(null);
  const destinationInputRef = useRef<TextInput>(null);
  const isSelectingRef = useRef(false);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [hasTyped, setHasTyped] = useState(false);
  const { mutateAsync: getPlaceSuggestions, isPending } = useGetPlaceSuggestions();
  const { mutateAsync: getPlaceDetails } = useGetPlaceDetails();
  const { data: favoriteAddresses } = useFavoriteAddresses();
  const form = useForm<AddressSelectorFormData>({
    defaultValues: {
      pickupLocationText: pickupAddress?.address || "",
      destinationLocationText: destinationAddress?.address || "",
    },
  });
  const destinationAddressText = form.watch("destinationLocationText");
  const pickupAddressText = form.watch("pickupLocationText");
  const [focusedField, setFocusedField] = useState<ActiveField>(initialActiveField);
  const shadow = getShadow(3, "umbra");

  useEffect(() => {
    if (pickupAddress?.address) {
      form.setValue("pickupLocationText", pickupAddress.address);
    }
    if (destinationAddress?.address) {
      form.setValue("destinationLocationText", destinationAddress.address);
    }
  }, [pickupAddress?.address, form, destinationAddress?.address]);

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
    () => debounce(fetchSuggestions, DEBOUNCE_DELAY),
    [fetchSuggestions]
  );

  const handleOnTextChange = useCallback(
    (text: string) => {
      debouncedFetchSuggestions?.cancel();

      setSuggestions([]);
      if (text.length > 0) {
        setHasTyped(true);
        debouncedFetchSuggestions(text);
      } else {
        setHasTyped(false);
      }
    },
    [debouncedFetchSuggestions]
  );

  const handlePickupChange = useCallback(
    (text: string) => {
      form.setValue("pickupLocationText", text);
      setFocusedField("pickup");
      handleOnTextChange(text);
    },
    [form, handleOnTextChange]
  );

  const handleDestinationChange = useCallback(
    (text: string) => {
      form.setValue("destinationLocationText", text);
      setFocusedField("destination");
      handleOnTextChange(text);
    },
    [form, handleOnTextChange]
  );

  const handlePickupClear = () => {
    setSuggestions([]);
    form.setValue("pickupLocationText", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    if (focusedField === "pickup") {
      setFocusedField(null);
    }
    onPickupClear?.();
  };

  const handleDestinationClear = () => {
    setSuggestions([]);
    form.setValue("destinationLocationText", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    if (focusedField === "destination") {
      setFocusedField(null);
    }
    onDestinationClear?.();
  };

  const handlePickupFocus = useCallback(() => {
    setFocusedField("pickup");
  }, []);

  const handleDestinationFocus = useCallback(() => {
    setFocusedField("destination");
  }, []);

  const handlePickupBlur = useCallback(() => {
    // Don't blur if we're in the process of selecting an address
    if (isSelectingRef.current) {
      return;
    }
    // Delay blur to allow suggestion selection
    setTimeout(() => {
      if (!isSelectingRef.current) {
        setFocusedField(null);
      }
    }, 200);
  }, []);

  const handleDestinationBlur = useCallback(() => {
    // Don't blur if we're in the process of selecting an address
    if (isSelectingRef.current) {
      return;
    }
    // Delay blur to allow suggestion selection
    setTimeout(() => {
      if (!isSelectingRef.current) {
        setFocusedField(null);
      }
    }, 200);
  }, []);

  const handleOnSelectAddress = useCallback(
    (selectedAddress: google.maps.places.AutocompleteSuggestion) => {
      const placeId = selectedAddress.placePrediction?.placeId;
      // @ts-ignore - structuredFormat might not be in the type definition yet
      const mainText = selectedAddress.placePrediction?.structuredFormat?.mainText?.text;
      const addressText = mainText || selectedAddress.placePrediction?.text.text || "";

      if (!addressText || !focusedField) return;

      // Mark that we're selecting to prevent blur handlers from interfering
      isSelectingRef.current = true;

      const currentField = focusedField;

      // Clear suggestions first
      setSuggestions([]);

      // Dismiss keyboard
      Keyboard.dismiss();

      // Blur the input
      if (currentField === "pickup") {
        pickupInputRef.current?.blur();
      } else {
        destinationInputRef.current?.blur();
      }

      onAddressSelected?.(addressText, currentField);

      if (placeId) {
        getPlaceDetails(placeId)
          .then((placeDetails) => {
            const fullAddress = placeDetails.address || addressText;

            if (onAddressSelected && fullAddress !== addressText) {
              onAddressSelected(fullAddress, currentField);
            }
            if (onLocationSelected && placeDetails.coordinates) {
              onLocationSelected(
                {
                  latitude: placeDetails.coordinates.latitude,
                  longitude: placeDetails.coordinates.longitude,
                  address: fullAddress,
                },
                currentField
              );
            }
          })
          .catch((error) => {
            console.error("Error getting place details:", error);
          })
          .finally(() => {
            // Clear the selecting flag and focused field after a delay
            setTimeout(() => {
              isSelectingRef.current = false;
              setFocusedField(null);
            }, 300);
          });
      } else {
        // Clear the selecting flag and focused field after a delay
        setTimeout(() => {
          isSelectingRef.current = false;
          setFocusedField(null);
        }, 300);
      }
    },
    [focusedField, getPlaceDetails, onAddressSelected, onLocationSelected]
  );

  //   const handleCurrentLocation = useCallback(async (): Promise<void> => {
  //   const targetField = focusedField;
  //   if (!targetField) {
  //     return;
  //   }

  //   let location = useLocationStore.getState().location;
  //   if (!location) {
  //     await refreshLocation();
  //     location = useLocationStore.getState().location;
  //   }

  //   if (!location) {
  //     console.error("Unable to get current location");
  //     return;
  //   }

  //   try {
  //     const address = await fetchCurrentAddress();

  //     const formField = targetField === "pickup" ? "pickupLocationText" : "destinationLocationText";
  //     form.setValue(formField, address?.address || "");

  //     onAddressSelected?.(address?.address || "", targetField);
  //     onLocationSelected?.(
  //       {
  //         latitude: location.latitude,
  //         longitude: location.longitude,
  //         address: address?.address || "",
  //       },
  //       targetField
  //     );

  //     setSuggestions([]);
  //     setFocusedField(null);
  //   } catch (error) {
  //     const addressText = "Current Location";
  //     const currentField = focusedField;

  //     if (currentField) {
  //       const formField =
  //         currentField === "pickup" ? "pickupLocationText" : "destinationLocationText";
  //       form.setValue(formField, addressText);

  //       onAddressSelected?.(addressText, currentField);
  //       if (location) {
  //         onLocationSelected?.(
  //           {
  //             latitude: location.latitude,
  //             longitude: location.longitude,
  //             address: addressText,
  //           },
  //           currentField
  //         );
  //       }
  //     }
  //     setSuggestions([]);
  //     setFocusedField(null);
  //   }
  // }, [refreshLocation, onAddressSelected, onLocationSelected, form]);

  useEffect(() => {
    const showListener = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      setKeyboardHeight(e.height + 100);
    });

    const hideListener = KeyboardEvents.addListener("keyboardWillHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (initialActiveField === "pickup") {
          pickupInputRef.current?.focus();
          setFocusedField("pickup");
        } else if (initialActiveField === "destination") {
          destinationInputRef.current?.focus();
          setFocusedField("destination");
        } else if (!destinationAddressText) {
          destinationInputRef.current?.focus();
          setFocusedField("destination");
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [destinationAddressText, isVisible, initialActiveField]);

  const renderItem: ListRenderItem<google.maps.places.AutocompleteSuggestion> = useCallback(
    ({ item }) => {
      const { text, matches } = item.placePrediction?.text || {};
      const segments = getMatchedSegments(text || "", matches || []);

      return (
        <PressableScale
          onPress={() => handleOnSelectAddress(item)}
          style={styles.suggestionItem}
          accessibilityLabel={`Select address: ${item.placePrediction?.text || ""}`}>
          <Regular numberOfLines={1}>
            {segments.map((segment, idx) =>
              segment.bold ? (
                <SemiBold key={idx}>{segment.text}</SemiBold>
              ) : (
                <Regular key={idx}>{segment.text}</Regular>
              )
            )}
          </Regular>
        </PressableScale>
      );
    },
    [handleOnSelectAddress]
  );

  const handleSelectFavoriteAddress = useCallback(
    (address: FavoriteAddress) => {
      if (!focusedField) return;

      const currentField = focusedField;

      // Set the label as the search input text
      const formField =
        currentField === "pickup" ? "pickupLocationText" : "destinationLocationText";
      form.setValue(formField, address.label);

      // Mark as typed to show search results instead of favorites
      setHasTyped(true);

      // Trigger search with the address text to get relevant results
      debouncedFetchSuggestions?.cancel();
      fetchSuggestions(address.address);
    },
    [focusedField, form, debouncedFetchSuggestions, fetchSuggestions]
  );

  const renderFavoriteItem: ListRenderItem<FavoriteAddress> = useCallback(
    ({ item }) => {
      return (
        <PressableScale
          onPress={() => handleSelectFavoriteAddress(item)}
          style={styles.suggestionItem}
          accessibilityLabel={`Select favorite address: ${item.label}`}>
          <Row alignItems="center" gap={12}>
            <Container
              width={40}
              height={40}
              borderRadius={20}
              backgroundColor="Primary/950"
              alignItems="center"
              justifyContent="center">
              <MapPin width={20} height={20} color={Colors["Primary/600"]} />
            </Container>
            <Container flex={1}>
              <Medium fontSize={14} color="Primary/50">
                {item.label}
              </Medium>
              <Regular fontSize={12} color="Neutrals/500" numberOfLines={1}>
                {item.address}
              </Regular>
            </Container>
          </Row>
        </PressableScale>
      );
    },
    [handleSelectFavoriteAddress]
  );

  // Determine if we should show favorite addresses
  const showFavoriteAddresses = useMemo(() => {
    return (
      focusedField !== null &&
      !hasTyped &&
      !isPending &&
      suggestions.length === 0 &&
      favoriteAddresses &&
      favoriteAddresses.length > 0
    );
  }, [focusedField, hasTyped, isPending, suggestions.length, favoriteAddresses]);

  const getTitle = (): string => {
    if (focusedField === "pickup") {
      return t("common.setYourPickupLocation");
    }
    return t("common.setYourDestination");
  };

  return (
    <Container backgroundColor="Bg Color" flex={1} gap={10}>
      <Container style={styles.headerContainer}>
        {showTitle && (
          <Row
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderBottomColor={Colors["Neutrals/100"]}
            pb={3}
            px={3}>
            <SemiBold color="black" fontSize={20}>
              {getTitle()}
            </SemiBold>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Container
                width={32}
                height={32}
                backgroundColor="Primary/600"
                borderRadius={16}
                justifyContent="center"
                alignItems="center">
                <Icon name="cross" width={16} height={16} color={Colors.white} />
              </Container>
            </TouchableOpacity>
          </Row>
        )}
        <Container gap={15} px={3}>
          <AddressSearchInput
            ref={pickupInputRef}
            icon="man"
            label={t("common.pickupLocation")}
            placeholder={t("common.whereAreYou")}
            value={pickupAddressText}
            onChange={handlePickupChange}
            onClear={handlePickupClear}
            onFocus={handlePickupFocus}
            onBlur={handlePickupBlur}
            onMapPress={() => onMapPress?.("pickup")}
          />
          <AddressSearchInput
            ref={destinationInputRef}
            icon="direction"
            label={t("common.chooseDestination")}
            placeholder={t("common.whereToGo")}
            value={destinationAddressText}
            onChange={handleDestinationChange}
            onClear={handleDestinationClear}
            onFocus={handleDestinationFocus}
            onBlur={handleDestinationBlur}
            onMapPress={() => onMapPress?.("destination")}
          />
        </Container>
      </Container>
      <Fill backgroundColor="white" borderRadius={30} style={shadow}>
        <Visible if={focusedField !== null}>
          {isPending ? (
            <Container p={3} alignItems="center">
              <Regular color="Neutrals/500">{t("common.searching")}</Regular>
            </Container>
          ) : showFavoriteAddresses ? (
            <FlatList
              data={favoriteAddresses}
              renderItem={renderFavoriteItem}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: keyboardHeight,
                paddingTop: 10,
              }}
              style={styles.suggestionList}
              nestedScrollEnabled={false}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <Container px={4} pb={2} pt={2}>
                  <Medium fontSize={14} color="Neutrals/950">
                    {t("common.favoriteAddresses")}
                  </Medium>
                </Container>
              }
            />
          ) : suggestions.length > 0 ? (
            <FlatList
              data={suggestions}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: keyboardHeight,
                paddingTop: 10,
              }}
              style={styles.suggestionList}
              nestedScrollEnabled={false}
              keyExtractor={(item) =>
                item.placePrediction?.placeId ||
                item.placePrediction?.text.text ||
                Math.random().toString()
              }
            />
          ) : hasTyped ? (
            <Container p={3} alignItems="center">
              <Regular fontSize={16} color="Neutrals/400">
                {t("broScholar.noResultsFor", {
                  query: focusedField === "pickup" ? pickupAddressText : destinationAddressText,
                })}
              </Regular>
            </Container>
          ) : null}
        </Visible>
      </Fill>
    </Container>
  );
}

// function CurrentLocationButton(props: CurrentLocationButtonProps) {
//   const { onPress } = props;
//   const [loading, setLoading] = useState(false);

//   const handlePress = async () => {
//     if (loading) return;
//     setLoading(true);
//     try {
//       await onPress();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PressableScale onPress={handlePress}>
//       <Container gap={15} backgroundColor="white" px={2} py={2} borderRadius={20} mx={2}>
//         <Row gap={10} alignItems="center">
//           <Container
//             width={40}
//             height={40}
//             backgroundColor={"Primary/600"}
//             borderRadius={20}
//             justifyContent="center"
//             alignItems="center">
//             <Icon name="compass" width={20} height={20} color={Colors.white} />
//           </Container>
//           <Container flex={1}>
//             <Regular color="black" fontSize={12}>
//               Your location
//             </Regular>
//             <Regular color="Neutrals/500" fontSize={14}>
//               {loading ? "Getting location..." : "Use current location"}
//             </Regular>
//           </Container>
//           <Visible if={loading}>
//             <ActivityIndicator size="small" color={Colors["Neutrals/500"]} />
//           </Visible>
//         </Row>
//       </Container>
//     </PressableScale>
//   );
// }

// interface CurrentLocationButtonProps {
//   onPress: () => Promise<void>;
// }

const styles = StyleSheet.create({
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors["Neutrals/100"],
  },
  suggestionList: {
    flex: 1,
  },
  headerContainer: {
    gap: 15,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: 15,
  },
});
