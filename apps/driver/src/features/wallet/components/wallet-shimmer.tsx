import { Colors } from "@brocabs/ui/theme/colors";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Column, Container, Fill, Row } from "@brocabs/ui/layout";

/**
 * Shimmer effect component for loading states
 */
function ShimmerBox({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    shimmerValue.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
  }, [shimmerValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: Colors["Neutrals/200"],
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * WalletShimmer Component
 *
 * Shows a skeleton loading state while wallet data is being fetched.
 * Prevents the glitchy flash of content during initial load.
 */
export function WalletShimmer() {
  const { width } = useWindowDimensions();
  const cardHeight = width * 0.5714;
  const carouselCardWidth = width * 0.86;

  return (
    <Fill backgroundColor="Bg Color">
      <Column gap={20} pt={20}>
        {/* Balance Card Shimmer */}
        <Container
          mx={20}
          backgroundColor="white"
          borderRadius={20}
          p={20}
          alignItems="center"
          height={190}>
          <Column alignItems="center" gap={20}>
            <Column alignItems="center" gap={10}>
              <ShimmerBox width={120} height={20} borderRadius={4} />
              <Row gap={10} alignItems="center">
                <ShimmerBox width={160} height={40} borderRadius={8} />
                <ShimmerBox width={24} height={24} borderRadius={12} />
              </Row>
            </Column>
            <ShimmerBox width={214} height={56} borderRadius={10} />
          </Column>
        </Container>

        {/* Cards Section Shimmer */}
        <Column gap={20}>
          <Row alignItems="center" justifyContent="space-between" px={20}>
            <ShimmerBox width={80} height={24} borderRadius={4} />
            <ShimmerBox width={100} height={20} borderRadius={4} />
          </Row>

          {/* Card Carousel Shimmer */}
          <Row justifyContent="center">
            <ShimmerBox width={carouselCardWidth} height={cardHeight} borderRadius={20} />
          </Row>
        </Column>

        {/* Transactions Section Shimmer */}
        <Column gap={16} px={20}>
          <Row alignItems="center" justifyContent="space-between">
            <ShimmerBox width={160} height={24} borderRadius={4} />
            <ShimmerBox width={60} height={20} borderRadius={4} />
          </Row>

          {/* Transaction Items Shimmer */}
          <Column gap={16}>
            <TransactionItemShimmer />
            <TransactionItemShimmer />
            <TransactionItemShimmer />
          </Column>
        </Column>
      </Column>
    </Fill>
  );
}

/**
 * Single transaction item shimmer
 */
function TransactionItemShimmer() {
  return (
    <Container
      backgroundColor="white"
      borderRadius={20}
      p={20}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center">
      <Row gap={10} alignItems="center" flex={1}>
        <ShimmerBox width={24} height={24} borderRadius={12} />
        <Column gap={4} flex={1}>
          <ShimmerBox width={120} height={12} borderRadius={4} />
          <ShimmerBox width={150} height={14} borderRadius={4} />
        </Column>
      </Row>
      <ShimmerBox width={70} height={14} borderRadius={4} />
    </Container>
  );
}
