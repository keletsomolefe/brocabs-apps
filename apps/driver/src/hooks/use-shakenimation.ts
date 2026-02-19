import { useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

const TIME = 120;
const OFFSET = 5;

/**
 * Use the shake animation hook.
 * @returns {Object} The shake animation hook.
 */
export function useShakeAnimation() {
  const shakeOffset = useSharedValue(0);

  const shake = () => {
    shakeOffset.value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME / 2 }), 3, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  return { shake, shakeOffset };
}
