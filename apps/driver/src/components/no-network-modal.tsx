import { getShadow } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { Container, Fill, Image } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTranslation } from "~/i18n/LocaleContext";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface NoNetworkModalProps {
  visible: boolean;
  onRetry: () => void;
}

const shadow = getShadow(2, "penumbra");

/**
 * NoNetworkModal
 * Full-screen modal shown when the app detects no internet connection.
 * Features the Bro mascot illustration, message, and Retry button.
 */
export function NoNetworkModal({ visible, onRetry }: NoNetworkModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={400}
      animationOutTiming={200}
      backdropColor={"transparent"}
      hideModalContentWhileAnimating
      useNativeDriver
      coverScreen>
      <Fill
        backgroundColor={Platform.OS === "android" ? "white-500" : "transparent"}
        justifyContent="center"
        alignItems="center">
        <BlurView intensity={15} tint="systemThickMaterialLight" style={StyleSheet.absoluteFill} />
        <Container
          style={shadow}
          mx={20}
          py={16}
          px={20}
          borderRadius={32}
          justifyContent="center"
          gap={24}
          backgroundColor="white">
          {/* Illustration */}
          <AnimatedContainer
            entering={FadeInDown.springify()
              .delay(100)
              .duration(300)
              .damping(12)
              .mass(1)
              .stiffness(100)}
            alignItems="center"
            justifyContent="center">
            <Image
              source={require("~/assets/images/no-network-bro.png")}
              style={styles.image}
              contentFit="contain"
            />
          </AnimatedContainer>

          {/* Text */}
          <Container gap={12} alignItems="center" width="100%">
            <Bold fontSize={24} center color="Primary/50">
              {t("common.noNetwork")}
            </Bold>
            <Regular
              fontSize={16}
              center
              color="Primary/50"
              lineHeight={24}
              style={styles.subtitle}>
              {t("common.noNetworkDesc")}
            </Regular>
          </Container>

          {/* Retry Button */}
          <Button
            label={t("common.retry")}
            onPress={onRetry}
            variant="primary"
            radius="rounded"
            size="lg"
          />
        </Container>
      </Fill>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    padding: 0,
  },
  image: {
    width: 220,
    height: 220,
  },
  subtitle: {
    opacity: 0.9,
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 8,
  },
});
