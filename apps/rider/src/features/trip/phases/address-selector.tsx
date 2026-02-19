import { useWatch } from "react-hook-form";
import { useRideForm } from "../context/ride-context";

import { getShadow } from "@brocabs/ui";
import { Container } from "@brocabs/ui/layout";
import { useCallback, useMemo } from "react";
import { Dimensions } from "react-native";
import { AddressSelector } from "../components/address-selector";
import { TripPhase } from "../trip-phase";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.9;

export function AddressSelectorPhase(props: AddressSelectorPhaseProps) {
  const { setTripPhase, initialActiveField, onClose } = props;
  const { form } = useRideForm();
  const pickup = useWatch({ control: form.control, name: "pickup" });
  const destination = useWatch({ control: form.control, name: "destination" });

  const handleAddressSelected = useCallback(
    (address: string, field: "pickup" | "destination") => {
      if (props.onAddressSelected) {
        props.onAddressSelected(address);
      }
    },
    [props]
  );

  const pickupAddress = useMemo(() => {
    if (!pickup) {
      return undefined;
    }

    return {
      latitude: pickup.latitude,
      longitude: pickup.longitude,
      address: pickup.address,
    };
  }, [pickup]);

  const destinationAddress = useMemo(() => {
    if (!destination) {
      return undefined;
    }

    return {
      latitude: destination.latitude,
      longitude: destination.longitude,
      address: destination.address,
    };
  }, [destination]);

  const shadow = getShadow(3, "umbra");

  return (
    <Container
      backgroundColor="Bg Color"
      borderTopLeftRadius={30}
      borderTopRightRadius={30}
      style={shadow}
      height={MODAL_HEIGHT}
      overflow="hidden">
      <AddressSelector
        initialActiveField={initialActiveField}
        pickupAddress={pickupAddress}
        destinationAddress={destinationAddress}
        onAddressSelected={handleAddressSelected}
        onLocationSelected={(location, field) => {
          form.setValue(field, location, { shouldValidate: true });
          const otherField = field === "pickup" ? "destination" : "pickup";
          const otherLocation = form.getValues(otherField);
          if (otherLocation) {
            setTripPhase(TripPhase.Home);
          }
        }}
        onDestinationClear={() => {
          form.setValue("destination", undefined, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
        onPickupClear={() => {
          form.setValue("pickup", undefined, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
        onClose={onClose}
        showTitle={true}
        showCurrentLocationButton={true}
        onMapPress={props.onMapPress}
        isVisible={true}
      />
    </Container>
  );
}

interface AddressSelectorPhaseProps {
  onClose?: () => void;
  onAddressSelected: (address: string) => void;
  onPickupBlur?: () => void;
  onDestinationBlur?: () => void;
  onMapPress?: (field: "pickup" | "destination") => void;
  onDismiss?: () => void;
  setTripPhase: (phase: TripPhase) => void;
  initialActiveField?: "pickup" | "destination" | null;
}
