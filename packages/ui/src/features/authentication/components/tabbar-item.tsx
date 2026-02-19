import { memo, useEffect } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Medium, SemiBold } from "../../../text";
import { Colors } from "../../../theme/colors";

import { usePressAnimation } from "../../../hooks/use-pressanimation";
import { Container, Pressable } from "../../../layout";

type TabBarItemProps = {
  title: string;
  isActive: boolean;
  onPress: () => void;
};

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const ACTIVE_VALUE = 1;
const INACTIVE_VALUE = 0;

export const TabBarItem = memo(
  ({ title, isActive, onPress }: TabBarItemProps) => {
    const progress = useSharedValue(isActive ? ACTIVE_VALUE : INACTIVE_VALUE);
    const { handleOnPressIn, handleOnPressOut, animatedStyle } =
      usePressAnimation({
        scale: 0.98,
      });

    useEffect(() => {
      progress.value = withSpring(isActive ? ACTIVE_VALUE : INACTIVE_VALUE);
    }, [isActive, progress]);

    const containerStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        progress.value,
        [INACTIVE_VALUE, ACTIVE_VALUE],
        ["rgba(255, 255, 255, 0.04)", Colors["Primary/600"]],
      ),
    }));

    return (
      <Pressable
        flex={1}
        onPress={onPress}
        onPressIn={handleOnPressIn}
        onPressOut={handleOnPressOut}
      >
        <AnimatedContainer
          borderRadius={10000}
          flex={1}
          px={10}
          height={45}
          justifyContent="center"
          alignItems="center"
          borderWidth={1}
          borderColor={Colors["Primary/600"]}
          style={[containerStyle, animatedStyle]}
        >
          {isActive ? (
            <SemiBold fontSize={18} color="white">
              {title}
            </SemiBold>
          ) : (
            <Medium fontSize={18} color="Primary/600">
              {title}
            </Medium>
          )}
        </AnimatedContainer>
      </Pressable>
    );
  },
);

TabBarItem.displayName = "TabBarItem";
