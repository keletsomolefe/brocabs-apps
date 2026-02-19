import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Extrapolation, interpolate, useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AssetFiles } from "~/theme/assets";

import { Container, Fill, Image } from "@brocabs/ui/layout";
import { Colors } from "@brocabs/ui/theme/colors";
import { useLocale } from "~/i18n/LocaleContext";
import { OnboardingCarouselItem } from "../types";
import { OnboardingContent } from "./onboarding-content";
import { OnboardingItem } from "./onboarding-item";

export function OnboardingCarousel({ onComplete }: { onComplete: () => void }) {
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = useWindowDimensions();
  const ref = useRef<ICarouselInstance>(null);

  const OnboardingData: OnboardingCarouselItem[] = [
    {
      id: 1,
      title: t("onboarding.getMoreRiders"),
      description: t("onboarding.getMoreRidersDesc"),
      video: AssetFiles.videos["onboarding-video-01"],
    },
    {
      id: 2,
      title: t("onboarding.driveWhatYouOwn"),
      description: t("onboarding.driveWhatYouOwnDesc"),
      video: AssetFiles.videos["onboarding-video-02"],
    },
    {
      id: 3,
      title: t("onboarding.sosButton"),
      description: t("onboarding.sosButtonDesc"),
      video: AssetFiles.videos["onboarding-video-03"],
    },
  ];

  const progress = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const videoHeight = Math.min(WINDOW_HEIGHT * 0.35, 328.147);
  const contentHeight = Math.min(WINDOW_HEIGHT * 0.25, 205);

  const renderItem = ({ item, index }: { item: OnboardingCarouselItem; index: number }) => {
    const isActive = index === currentIndex;
    return <OnboardingItem item={item} isActive={isActive} height={videoHeight} />;
  };

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <Fill>
      <LinearGradient
        style={StyleSheet.absoluteFillObject}
        {...(fromCSS(
          `background: linear-gradient(180deg, ${Colors["Primary/600"]} 0%, ${Colors["Primary/200"]} 100%);`
        ) as unknown as LinearGradientProps)}
      />
      <Fill
        pb={insets.bottom}
        alignItems="center"
        gap={Math.min((WINDOW_HEIGHT - insets.top - insets.bottom) * 0.042918, 40)}>
        <Container width="100%" height={insets.top} />
        <Container alignItems="center" justifyContent="center">
          <Image
            source={AssetFiles.images["logo-light"]}
            width={149}
            height={56}
            contentFit="contain"
          />
        </Container>
        <Container alignItems="center" justifyContent="center" height={videoHeight}>
          <Carousel
            ref={ref}
            width={WINDOW_WIDTH}
            height={videoHeight}
            data={OnboardingData}
            onProgressChange={progress}
            renderItem={renderItem}
            onSnapToItem={(index) => {
              setCurrentIndex(index);
            }}
            loop={false}
          />
        </Container>
        <Container height={20} justifyContent="center">
          <Pagination.Custom<{ id: string }>
            progress={progress}
            data={OnboardingData.map((item) => ({ id: item.id.toString() }))}
            dotStyle={{
              width: 5,
              height: 16,
              backgroundColor: Colors["Primary/950"],
              borderRadius: 2.5,
            }}
            activeDotStyle={{
              width: 5,
              height: 30,
              backgroundColor: Colors["Primary/950"],
            }}
            containerStyle={{
              gap: 10,
              alignItems: "center",
            }}
            horizontal
            onPress={onPressPagination}
            customReanimatedStyle={(progress, index, length) => {
              let val = Math.abs(progress - index);
              if (index === 0 && progress > length - 1) {
                val = Math.abs(progress - length);
              }
              return {
                opacity: interpolate(val, [0, 1], [1, 0.5], Extrapolation.CLAMP),
              };
            }}
          />
        </Container>

        <Container
          height={contentHeight}
          justifyContent="flex-end"
          width="100%"
          alignItems="center"
          mb={16}>
          <OnboardingContent
            item={OnboardingData[currentIndex]}
            insets={insets}
            carouselRef={ref}
            currentIndex={currentIndex}
            onComplete={onComplete}
          />
        </Container>
      </Fill>
    </Fill>
  );
}
