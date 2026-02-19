import { BlurView } from "@sbaiahmed1/react-native-blur";
import LottieView from "lottie-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Lottie as LottieFiles } from "@brocabs/ui/animations";
import { Bold, Medium } from "@brocabs/ui/text";

import { usePressAnimation } from "@brocabs/ui/hooks/use-pressanimation";
import { Container } from "@brocabs/ui/layout";
import { useLocale } from "~/i18n/LocaleContext";
import { OnboardingCarouselData } from "../constants";
import { OnboardingCarouselItem } from "../types";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export function OnboardingContent({
  item,
  insets,
  carouselRef,
  currentIndex,
  onComplete,
}: {
  item: OnboardingCarouselItem;
  insets: ReturnType<typeof useSafeAreaInsets>;
  carouselRef: React.RefObject<ICarouselInstance | null>;
  currentIndex: number;
  onComplete: () => void;
}) {
  const { t } = useLocale();
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();
  const contentHeight = Math.min(WINDOW_HEIGHT * 0.25, 205);
  const width = WINDOW_WIDTH - 40;
  const radius = 23;

  const isLastSlide = currentIndex === OnboardingCarouselData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      carouselRef.current?.scrollTo({
        count: 1,
        animated: true,
      });
    }
  };

  const CustomButton = ({
    label,
    onPress,
    variant = "white",
    height = 40,
  }: {
    label: string;
    onPress: () => void;
    variant?: "white" | "transparent";
    height?: number;
  }) => {
    const { handleOnPressIn, handleOnPressOut, animatedStyle } = usePressAnimation({ scale: 0.97 });
    const isWhite = variant === "white";

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
        style={{ width: "100%" }}>
        <AnimatedContainer
          style={[
            animatedStyle,
            isWhite && {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
          height={height}
          width="100%"
          backgroundColor={isWhite ? "white" : "transparent"}
          borderRadius={100}
          justifyContent="center"
          alignItems="center">
          <Bold color={isWhite ? "Primary/50" : "Primary/950"} fontSize={16}>
            {label}
          </Bold>
        </AnimatedContainer>
      </Pressable>
    );
  };

  return (
    <Container
      key={item.id}
      width={width}
      height={contentHeight}
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      borderRadius={radius}
      style={{ paddingVertical: 30 }}>
      <LottieView
        source={LottieFiles.blob}
        autoPlay
        loop
        style={{ width: "600%", height: "600%", position: "absolute", opacity: 0.5 }}
      />

      {Platform.OS === "android" ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        />
      ) : (
        <BlurView
          blurAmount={40}
          blurType="systemMaterialDark"
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <Container width="100%" padding={24} gap={12}>
        <AnimatedContainer entering={ZoomIn.springify()} gap={8}>
          <Bold color="Primary/950" fontSize={24} center>
            {item.title}
          </Bold>
          <Medium color="Primary/950" fontSize={12} center>
            {item.description}
          </Medium>
        </AnimatedContainer>
        <AnimatedContainer gap={8}>
          <CustomButton
            label={isLastSlide ? t("onboarding.getStarted") : t("common.next")}
            variant="white"
            onPress={handleNext}
            height={40}
          />
          <CustomButton
            label={t("common.skip")}
            variant="transparent"
            onPress={onComplete}
            height={24}
          />
        </AnimatedContainer>
      </Container>
    </Container>
  );
}
