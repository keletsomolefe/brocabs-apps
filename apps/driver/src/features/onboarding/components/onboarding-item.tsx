import { useVideoPlayer, VideoView } from "expo-video";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";

import React, { useEffect } from "react";
import { usePressAnimation } from "@brocabs/ui/hooks/use-pressanimation";
import { Container, Pressable } from "@brocabs/ui/layout";
import { OnboardingCarouselItem } from "../types";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const WINDOW_WIDTH = Dimensions.get("window").width;

export function OnboardingItem({
  item,
  isActive,
  height,
}: {
  item: OnboardingCarouselItem;
  isActive: boolean;
  height: number;
}) {
  const player = useVideoPlayer(item.video, (player) => {
    player.loop = true;
    player.volume = 0;
  });

  const { handleOnPressIn, handleOnPressOut, animatedStyle } = usePressAnimation({ scale: 0.97 });

  useEffect(() => {
    const handlePlayerState = async () => {
      try {
        if (isActive) {
          player.currentTime = 0;
          await player.play();
        } else {
          await player.pause();
          player.currentTime = 0;
        }
      } catch (error) {
        console.warn("Video player error:", error);
      }
    };

    handlePlayerState();
  }, [isActive, player]);

  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [player]);

  return (
    <Pressable onPressIn={handleOnPressIn} onPressOut={handleOnPressOut} width={WINDOW_WIDTH}>
      <Container width={WINDOW_WIDTH} alignItems="center">
        <AnimatedContainer
          width={WINDOW_WIDTH - 40}
          height={height}
          borderRadius={20}
          overflow="hidden"
          style={animatedStyle}>
          <VideoView
            style={[{ position: "absolute", width: "100%", height: "100%" }]}
            player={player}
            nativeControls={false}
            contentFit="cover"
          />
        </AnimatedContainer>
      </Container>
    </Pressable>
  );
}
