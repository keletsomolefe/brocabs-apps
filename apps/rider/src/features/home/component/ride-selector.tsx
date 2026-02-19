import { Button } from "@brocabs/ui/button";
import { Container, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { render } from "micromustache";
import React, { useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useRideForm } from "~/features/trip/context/ride-context";
import { useRideTypes } from "~/hooks/use-ride-types";
import { useTranslation } from "~/i18n/LocaleContext";

import { RIDE_TYPE_ICONS } from "../constants";

interface Props {
  onRequestRide: () => void;
}

export function RideSelector({ onRequestRide }: Props) {
  const { t } = useTranslation();
  const { form } = useRideForm();
  const { data: rideTypesResponse } = useRideTypes();

  const rideTypes = useMemo(() => rideTypesResponse?.data || [], [rideTypesResponse]);
  const selectedRideId = useWatch({ control: form.control, name: "rideType" });

  useEffect(() => {
    if (rideTypes.length > 0 && !selectedRideId) {
      form.setValue("rideType", rideTypes[0].id, { shouldValidate: true });
    }
  }, [rideTypes, selectedRideId, form]);

  const handleRequestRide = () => {
    onRequestRide();
  };

  if (rideTypes.length <= 0) {
    return null;
  }

  const selectedRide = rideTypes.find((ride) => ride.id === selectedRideId) || rideTypes[0]!;
  const activeRideId = selectedRide.id;

  const template = selectedRide.description || "";

  const seatCount = selectedRide.seatCount || 4;
  const capacity = seatCount.toString().padStart(2, "0");
  const delimiter = "___HIGHLIGHT___";

  const renderedText = render(template, {
    capacity_seater: `${delimiter}${capacity}-seater${delimiter}`,
    capacity_plus_seater: `${delimiter}${capacity}+ seater${delimiter}`,
  });
  const parts = renderedText.split(delimiter);

  return (
    <Container backgroundColor="white" borderRadius={20} px={15} py={15} gap={24}>
      <Container gap={10}>
        <Row justifyContent="space-between" alignItems="center" gap={10}>
          <Container flex={1}>
            <Medium fontSize={20} lineHeight={36} color="Primary/50">
              {selectedRide.displayName}
            </Medium>
            <Regular fontSize={12} lineHeight={16} color="Neutrals/700">
              {parts.map((part, index) => {
                if (index % 2 === 1) {
                  return (
                    <Bold key={index} fontSize={12} color="Primary/400">
                      {part}
                    </Bold>
                  );
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
              })}
            </Regular>
          </Container>
          <Container
            backgroundColor="Input Color"
            borderRadius={20}
            px={20}
            py={10}
            borderWidth={1}
            borderColor="rgba(85, 0, 255, 0.4)">
            <Regular fontSize={12} color="Primary/50">
              56 {t("home.nearby")}
            </Regular>
          </Container>
        </Row>
        <Container alignItems="center">
          <Image
            source={RIDE_TYPE_ICONS[selectedRide.code]}
            contentFit="contain"
            width={250}
            height={250}
          />
        </Container>
        <Row gap={10} flexWrap="wrap" justifyContent="space-between">
          {rideTypes.map((ride) => {
            const isSelected = ride.id === activeRideId;

            return (
              <TouchableOpacity
                key={ride.id}
                activeOpacity={0.8}
                onPress={() => form.setValue("rideType", ride.id, { shouldValidate: true })}
                width="48%"
                backgroundColor={isSelected ? "Primary/400" : "Bg Color"}
                borderRadius={20}
                py={10}
                px={20}
                mb={0}
                alignItems="center"
                justifyContent="center"
                borderWidth={isSelected ? 1 : 0}
                borderColor="rgba(85, 0, 255, 0.4)">
                <SemiBold fontSize={12} color={isSelected ? "white" : "Primary/50"}>
                  {ride.displayName}
                </SemiBold>
              </TouchableOpacity>
            );
          })}
        </Row>
      </Container>
      <Button
        label={t("home.requestRide")}
        variant="primary"
        radius="rounded"
        size="md"
        disabled={!form.formState.isValid}
        onPress={handleRequestRide}
      />
    </Container>
  );
}
