import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

export function usePressAnimation({ scale = 0.97 }: { scale?: number }) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handleOnPress = () => {
    scaleValue.value = withSequence(withSpring(scale), withSpring(1));
  };

  const handleOnPressIn = () => {
    scaleValue.value = withSpring(scale);
  };

  const handleOnPressOut = () => {
    scaleValue.value = withSpring(1);
  };

  return {
    animatedStyle,
    handleOnPress,
    handleOnPressIn,
    handleOnPressOut,
  };
}
