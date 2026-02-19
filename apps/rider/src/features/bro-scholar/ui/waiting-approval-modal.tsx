import { Container, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Animated, { ZoomInDown } from "react-native-reanimated";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export function WaitingApprovalContent({
  onClose,
  onContactSupport,
}: {
  onClose: () => void;
  onContactSupport: () => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
      {/* Backdrop with blur */}
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
          {/* Hourglass Icon */}
          <Container alignItems="center" justifyContent="center" width="100%">
            <Icon name="hourglass" width={70} height={70} color={Colors["Warning/400"]} />
          </Container>

          {/* Text */}
          <Container gap={8} alignItems="center" width="100%">
            <Bold fontSize={24} center color="Primary/50">
              {t("common.waitingForApproval")}
            </Bold>
            <Regular fontSize={16} center color="Primary/50" lineHeight={24}>
              {t("common.waitingApprovalDesc")}
            </Regular>
          </Container>

          {/* Buttons */}
          <Row gap={10} width="100%">
            {/* Contact Support Button (Secondary) */}
            <TouchableOpacity
              flex={1}
              height={56}
              backgroundColor="white"
              borderRadius={20}
              borderWidth={1}
              borderColor="Primary/400"
              alignItems="center"
              justifyContent="center"
              onPress={onContactSupport}>
              <Regular fontSize={18} color="Primary/400">
                {t("common.support")}
              </Regular>
            </TouchableOpacity>

            {/* Close Button (Primary) */}
            <TouchableOpacity
              flex={1}
              height={56}
              backgroundColor="Primary/400"
              borderRadius={20}
              alignItems="center"
              justifyContent="center"
              onPress={onClose}>
              <Bold fontSize={18} color="white">
                {t("common.close")}
              </Bold>
            </TouchableOpacity>
          </Row>
        </AnimatedContainer>
      </Container>
    </>
  );
}

export function WaitingApprovalModal({
  visible,
  onClose,
  onContactSupport,
}: {
  visible: boolean;
  onClose: () => void;
  onContactSupport: () => void;
}) {
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
      backdropOpacity={0.8}>
      <WaitingApprovalContent onClose={onClose} onContactSupport={onContactSupport} />
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
  cardShadow: {
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
