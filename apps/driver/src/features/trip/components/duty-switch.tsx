import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Rect,
} from "react-native-svg";
import { Icon } from "~/shared/ui/icons";

interface DutySwitchProps {
  isOnline: boolean;
  onToggle: (status: boolean) => void;
}

// Dimensions from Figma (Node 3443:19673)
const TRACK_WIDTH = 70;
const TRACK_HEIGHT = 36;
const KNOB_SIZE = 26;
const PADDING = 5;
const TRAVEL_DIST = TRACK_WIDTH - KNOB_SIZE - PADDING * 2;

// Track color is ALWAYS Primary/900 (#D3D4FF) per Figma spec
const TRACK_COLOR = "#D3D4FF";

// Track SVG with inset shadow: box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25) inset
function TrackSvg({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.trackContainer}>
      <Svg
        width={TRACK_WIDTH}
        height={TRACK_HEIGHT}
        viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_HEIGHT}`}
        style={StyleSheet.absoluteFill}>
        <Defs>
          <Filter
            id="trackInsetShadow"
            x="0"
            y="0"
            width={TRACK_WIDTH}
            height={TRACK_HEIGHT}
            filterUnits="userSpaceOnUse">
            <FeFlood floodOpacity="0" result="BackgroundImageFix" />
            <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            {/* Inset shadow: 0 2px 4px 0 rgba(0,0,0,0.25) */}
            <FeColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <FeOffset dy="2" />
            <FeGaussianBlur stdDeviation="2" />
            <FeComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <FeBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          </Filter>
        </Defs>
        <G filter="url(#trackInsetShadow)">
          <Rect
            x="0"
            y="0"
            width={TRACK_WIDTH}
            height={TRACK_HEIGHT}
            rx="18"
            ry="18"
            fill={TRACK_COLOR}
          />
        </G>
      </Svg>
      {children}
    </View>
  );
}

export function DutySwitch({ isOnline, onToggle }: DutySwitchProps) {
  const animValue = useRef(new Animated.Value(isOnline ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isOnline ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOnline, animValue]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [PADDING, PADDING + TRAVEL_DIST],
  });

  return (
    <Pressable onPress={() => onToggle(!isOnline)}>
      {/* Track with SVG inset shadow */}
      <TrackSvg>
        {/* Knob with neomorph SVG */}
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [{ translateX }],
            },
          ]}>
          <Icon name="knob" width={KNOB_SIZE} height={KNOB_SIZE} />
        </Animated.View>
      </TrackSvg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trackContainer: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    justifyContent: "center",
  },
  knob: {
    position: "absolute",
    width: KNOB_SIZE,
    height: KNOB_SIZE,
  },
});
