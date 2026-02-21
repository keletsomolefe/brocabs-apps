import {
  RideTypeResponseDtoCodeEnum,
  type RideTypeResponseDto,
} from "@brocabs/client";
import { Button } from "@brocabs/ui/button";
import { Container, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { render } from "micromustache";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, type ViewStyle } from "react-native";
import { useWatch } from "react-hook-form";
import { useRideForm } from "~/features/trip/context/ride-context";
import { useRideTypes } from "~/hooks/use-ride-types";
import { useTranslation } from "~/i18n/LocaleContext";

import { RIDE_TYPE_ICONS } from "../constants";
import { BroSclrModal } from "./bro-sclr-modal";

/**
 * Gradient colors: pink/salmon → lavender/purple → mint/teal
 * Duplicated to create a seamless loop when rotating.
 */
const GLOW_GRADIENT_COLORS = [
  "#F09AE1",
  "#B48CFF",
  "#82D9C4",
  "#F09AE1",
  "#B48CFF",
  "#82D9C4",
] as const;
/** Middle purple used for the outer shadow glow */
const GLOW_SHADOW_COLOR = "#B48CFF";
/** Gradient border thickness */
const GRADIENT_BORDER_WIDTH = 2.5;
/** Size of the rotating gradient square (must be larger than the button) */
const GRADIENT_SIZE = 300;

/** Fallback Bro SCLR ride type shown when the API doesn't return it */
const BRO_SCLR_FALLBACK: RideTypeResponseDto = {
  id: -1,
  code: RideTypeResponseDtoCodeEnum.BroScholar,
  displayName: "Bro SCLR",
  description: "Affordable student rides in a {{capacity_seater}} vehicle",
  capacity: 4,
  seatCount: 4,
  order: 6,
  dispatchRank: 6,
  baseFare: 0,
  perMinuteRate: 0,
  perKmRate: 0,
  minFare: 0,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function GlowingButton({
  isSelected,
  onPress,
  displayName,
}: {
  isSelected: boolean;
  onPress: () => void;
  displayName: string;
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Continuous rotation for the gradient border
  useEffect(() => {
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotation.start();
    return () => rotation.stop();
  }, [rotateAnim]);

  // Pulsing shadow glow
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 14],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  const elevation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 10],
  });

  const animatedShadow: Animated.AnimatedProps<ViewStyle> = Platform.select({
    ios: {
      shadowColor: GLOW_SHADOW_COLOR,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: shadowOpacity as unknown as number,
      shadowRadius: shadowRadius as unknown as number,
    },
    android: {
      elevation: elevation as unknown as number,
      shadowColor: GLOW_SHADOW_COLOR,
    },
    default: {
      shadowColor: GLOW_SHADOW_COLOR,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: shadowOpacity as unknown as number,
      shadowRadius: shadowRadius as unknown as number,
    },
  })!;

  return (
    <Animated.View style={[glowStyles.outerWrapper, animatedShadow]}>
      {/* Clipped container that reveals only the border-sized ring of gradient */}
      <Animated.View style={glowStyles.clipContainer}>
        {/* Oversized gradient that rotates to create the animated border effect */}
        <Animated.View
          style={[
            glowStyles.spinningGradientWrapper,
            { transform: [{ rotate: spin }] },
          ]}>
          <LinearGradient
            colors={[...GLOW_GRADIENT_COLORS]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={glowStyles.spinningGradient}
          />
        </Animated.View>

        {/* Inner button sits on top, creating the border gap */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          style={glowStyles.innerButton}
          backgroundColor={isSelected ? "Primary/400" : "Bg Color"}
          alignItems="center"
          justifyContent="center">
          <SemiBold fontSize={12} color={isSelected ? "white" : "Primary/50"}>
            {displayName}
          </SemiBold>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const glowStyles = StyleSheet.create({
  outerWrapper: {
    width: "48%",
    borderRadius: 20,
    marginBottom: 0,
  },
  clipContainer: {
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  spinningGradientWrapper: {
    position: "absolute",
    width: GRADIENT_SIZE,
    height: GRADIENT_SIZE,
  },
  spinningGradient: {
    width: "100%",
    height: "100%",
  },
  innerButton: {
    borderRadius: 20 - GRADIENT_BORDER_WIDTH,
    margin: GRADIENT_BORDER_WIDTH,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // Ensure inner button fills width so the gradient only shows as a border
    alignSelf: "stretch",
  },
});

interface Props {
  onRequestRide: () => void;
}

export function RideSelector({ onRequestRide }: Props) {
  const { t } = useTranslation();
  const { form } = useRideForm();
  const { data: rideTypesResponse } = useRideTypes();
  const [broSclrModalVisible, setBroSclrModalVisible] = useState(false);

  const rideTypes = useMemo(() => {
    const apiTypes = rideTypesResponse?.data || [];
    const hasBroSclr = apiTypes.some(
      (rt) => rt.code === RideTypeResponseDtoCodeEnum.BroScholar,
    );
    if (!hasBroSclr) {
      return [...apiTypes, BRO_SCLR_FALLBACK];
    }
    return apiTypes;
  }, [rideTypesResponse]);
  const selectedRideId = useWatch({ control: form.control, name: "rideType" });

  useEffect(() => {
    if (rideTypes.length > 0 && !selectedRideId) {
      form.setValue("rideType", rideTypes[0].id, { shouldValidate: true });
    }
  }, [rideTypes, selectedRideId, form]);

  const handleRequestRide = () => {
    onRequestRide();
  };

  const handleBroSclrPress = useCallback(() => {
    setBroSclrModalVisible(true);
  }, []);

  const handleBroSclrApply = useCallback(() => {
    setBroSclrModalVisible(false);
    router.push("/bro-scholar/create-application");
  }, []);

  const handleBroSclrClose = useCallback(() => {
    setBroSclrModalVisible(false);
  }, []);

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
            const isBroSclr = ride.code === RideTypeResponseDtoCodeEnum.BroScholar;

            if (isBroSclr) {
              return (
                <GlowingButton
                  key={ride.id}
                  isSelected={isSelected}
                  onPress={handleBroSclrPress}
                  displayName={ride.displayName}
                />
              );
            }

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

      {/* Bro SCLR application popup */}
      <BroSclrModal
        visible={broSclrModalVisible}
        onApply={handleBroSclrApply}
        onClose={handleBroSclrClose}
      />
    </Container>
  );
}
