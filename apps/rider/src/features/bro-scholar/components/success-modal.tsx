import { Container, Image, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Animated, { ZoomInDown } from "react-native-reanimated";
import { useTranslation } from "~/i18n/LocaleContext";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface SuccessModalProps {
  visible: boolean;
  onBookRide: () => void;
}

export function SuccessModal({ visible, onBookRide }: SuccessModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      isVisible={visible}
      style={{ margin: 0, padding: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={400}
      animationOutTiming={100}
      hideModalContentWhileAnimating
      useNativeDriver
      backdropColor={Colors["white"]}
      backdropOpacity={0.8}>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      <Container mx={16} style={styles.backdrop}>
        <AnimatedContainer
          entering={ZoomInDown.springify()
            .delay(100)
            .duration(200)
            .damping(10)
            .mass(1)
            .stiffness(100)}
          backgroundColor="white"
          borderRadius={30}
          px={20}
          py={30}
          gap={20}
          width="100%"
          maxWidth={390}
          alignItems="center"
          style={styles.cardShadow}>
          {/* Success Illustration */}
          <Container alignItems="center" justifyContent="center" width="100%">
            <Image
              source={require("~/assets/images/bro-scholar-accepted.png")}
              style={{ width: 220, height: 220 }}
              contentFit="contain"
            />
          </Container>

          {/* Text */}
          <Container gap={8} alignItems="center" width="100%">
            <Bold fontSize={24} center color="Primary/50">
              {t("common.allSet")}
            </Bold>
            <Regular fontSize={16} center color="Primary/50" lineHeight={24}>
              {t("common.statusApproved")}
            </Regular>
          </Container>

          {/* Book first Ride Button */}
          <TouchableOpacity
            width="100%"
            height={56}
            backgroundColor="Primary/400"
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            onPress={onBookRide}>
            <Bold fontSize={18} color="white">
              {t("common.bookFirstRide")}
            </Bold>
          </TouchableOpacity>
        </AnimatedContainer>
      </Container>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardShadow: {
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
