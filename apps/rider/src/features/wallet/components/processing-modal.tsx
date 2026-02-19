import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

import { Column, Container } from "@brocabs/ui/layout";
import { useTranslation } from "~/i18n/LocaleContext";

interface ProcessingModalProps {
  visible: boolean;
  message?: string;
}

const AnimatedG = Animated.createAnimatedComponent(G);

/**
 * ProcessingModal
 *
 * A modal overlay with blur backdrop showing a spinning loader
 * and processing message. Used during payment processing,
 * card authorization, etc.
 */
export function ProcessingModal({
  visible,
  message,
}: ProcessingModalProps) {
  const { t } = useTranslation();
  const displayMessage = message || t("common.pleaseWait");
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1200, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = 0;
    }
  }, [visible, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      {/* Backdrop with blur */}
      <View style={styles.backdrop}>
        <BlurView intensity={23} style={StyleSheet.absoluteFill} tint="dark" />
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />

        {/* Centered Card */}
        <Animated.View entering={FadeIn.duration(200)} style={styles.centeredContainer}>
          <Container
            backgroundColor="white"
            borderRadius={20}
            p={30}
            width="90%"
            maxWidth={340}
            alignItems="center"
            gap={20}
            style={styles.cardShadow}>
            {/* Spinning Loader */}
            <Animated.View style={[styles.loaderContainer, animatedStyle]}>
              <Svg width={60} height={60} viewBox="0 0 60 60">
                {/* Background circle (gray track) */}
                <Circle cx={30} cy={30} r={26} stroke="#E5E5E5" strokeWidth={4} fill="none" />
                {/* Animated arc (green) */}
                <AnimatedG origin="30, 30">
                  <Circle
                    cx={30}
                    cy={30}
                    r={26}
                    stroke={Colors["Success/400"]}
                    strokeWidth={4}
                    fill="none"
                    strokeDasharray="60 103.67"
                    strokeLinecap="round"
                  />
                </AnimatedG>
              </Svg>
            </Animated.View>

            {/* Text */}
            <Column alignItems="center" gap={8} width="100%">
              <Medium fontSize={20} style={styles.title}>
                {t("common.processing")}
              </Medium>
              <Regular fontSize={14} style={styles.subtitle}>
                {displayMessage}
              </Regular>
            </Column>
          </Container>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(10, 2, 26, 0.3)",
  },
  centeredContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  loaderContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    color: "#0A021A",
    lineHeight: 26,
  },
  subtitle: {
    textAlign: "center",
    color: "#0A021A",
    opacity: 0.7,
    lineHeight: 20,
  },
});
