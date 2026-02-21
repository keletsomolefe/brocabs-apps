import { Container, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Animated, { ZoomInDown } from "react-native-reanimated";
import { useTranslation } from "~/i18n/LocaleContext";
import { BroScholarText } from "~/shared/ui/bro-scholar-text";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface BroSclrModalProps {
  visible: boolean;
  onApply: () => void;
  onClose: () => void;
}

export function BroSclrModal({ visible, onApply, onClose }: BroSclrModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={400}
      animationOutTiming={100}
      hideModalContentWhileAnimating
      useNativeDriver
      backdropColor={Colors["white"]}
      backdropOpacity={0.8}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
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
          {/* Mascot / Car Illustration */}
          <Container alignItems="center" justifyContent="center" width="100%">
            <Image
              source={require("~/assets/images/car-big-bro-scholar-white.png")}
              style={styles.illustration}
              contentFit="contain"
            />
          </Container>

          {/* Title + Description */}
          <Container gap={8} alignItems="center" width="100%">
            <Row gap={4} alignItems="center" justifyContent="center">
              <Bold fontSize={24} lineHeight={28}>
                {t("common.applyFor")}
              </Bold>
              <BroScholarText fontSize={24} lineHeight={28} width={120} />
            </Row>
            <Regular fontSize={14} center color="Neutrals/700" lineHeight={22}>
              Some apps chase profit, we chose campus.
            </Regular>
          </Container>

          {/* Apply + Close Buttons */}
          <Row gap={10} width="100%">
            {/* Close Button (Secondary / Outline) */}
            <TouchableOpacity
              flex={1}
              height={52}
              backgroundColor="white"
              borderRadius={20}
              borderWidth={1}
              borderColor="Primary/400"
              alignItems="center"
              justifyContent="center"
              onPress={onClose}>
              <Regular fontSize={16} color="Primary/400">
                {t("common.close")}
              </Regular>
            </TouchableOpacity>

            {/* Apply Button (Primary) */}
            <TouchableOpacity
              flex={1}
              height={52}
              backgroundColor="Primary/400"
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              onPress={onApply}>
              <Bold fontSize={16} color="white">
                Apply
              </Bold>
            </TouchableOpacity>
          </Row>
        </AnimatedContainer>
      </Container>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    padding: 0,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 200,
    height: 150,
  },
  cardShadow: {
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
