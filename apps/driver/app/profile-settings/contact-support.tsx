import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useState } from "react";
import { Alert, Platform, StyleSheet, TextInput, View } from "react-native";
import { CircleCheckBig, X } from "lucide-react-native";
import { Column, Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { useLocale } from "~/i18n/LocaleContext";
import { DropdownField } from "~/shared/ui/dropdown";
import { BlurView } from "expo-blur";
import Modal from "react-native-modal";
import Animated, { ZoomInDown } from "react-native-reanimated";
import * as Linking from "expo-linking";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const PROBLEM_OPTIONS = [
  { label: "Payment", value: "payment" },
  { label: "App issue", value: "app_issue" },
  { label: "Driver abusive", value: "driver_abusive" },
  { label: "Lost my item", value: "lost_item" },
];

const SUPPORT_EMAIL = "supports@brocabs.zohodesk.com";

export default function ContactSupportScreen() {
  const { t } = useLocale();
  const [problem, setProblem] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedProblemLabel =
    PROBLEM_OPTIONS.find((opt) => opt.value === problem)?.label ?? "";

  const handleSubmit = async () => {
    if (!problem) {
      Alert.alert("Error", "Please select a problem.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please describe your problem.");
      return;
    }

    setIsSubmitting(true);

    const subject = `Support Request: ${selectedProblemLabel}`;
    const body = `Problem: ${selectedProblemLabel}\n\nDescription:\n${description}`;
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      await Linking.openURL(mailto);
      setIsSubmitting(false);
      setShowSuccess(true);
    } catch {
      setIsSubmitting(false);
      Alert.alert(
        "Unable to open email",
        "No email app was found on your device. Please send your complaint manually to supports@brocabs.zohodesk.com"
      );
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setProblem("");
    setDescription("");
  };

  return (
    <Fill backgroundColor="Bg Color" px={20} pt={10}>
      <Column gap={14}>
        {/* Select Problem */}
        <Column gap={14}>
          <Regular fontSize={16} color="Primary/50">
            {t("profile.selectProblem")}
          </Regular>
          <DropdownField
            value={problem}
            placeholder={t("profile.selectProblem")}
            data={PROBLEM_OPTIONS}
            onChange={(value) => setProblem(String(value))}
          />
        </Column>

        {/* Description */}
        <Column gap={14}>
          <Regular fontSize={16} color="Primary/50">
            {t("profile.explainProblem")}
          </Regular>
          <Container backgroundColor="Input Color" borderRadius={20} h={241} p={20}>
            <TextInput
              placeholder={t("profile.explainProblem")}
              placeholderTextColor={Colors["Neutrals/400"]}
              multiline
              textAlignVertical="top"
              style={{
                flex: 1,
                fontFamily: "BRHendrix-Regular",
                fontSize: 14,
                color: Colors["Primary/50"],
              }}
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />
          </Container>
          <Regular
            fontSize={12}
            color="Neutrals/400"
            style={{ alignSelf: "flex-end", fontStyle: "italic", fontFamily: undefined }}>
            {t("profile.charLimit")}
          </Regular>
        </Column>
      </Column>

      {/* Submit Button */}
      <TouchableOpacity
        backgroundColor="Primary/600"
        borderRadius={20}
        h={66}
        justifyContent="center"
        alignItems="center"
        mt={30}
        activeOpacity={0.8}
        disabled={isSubmitting}
        onPress={handleSubmit}
        style={isSubmitting ? { opacity: 0.6 } : undefined}>
        <Regular fontSize={18} color="Primary/950">
          {isSubmitting ? t("common.processing") : t("common.submit")}
        </Regular>
      </TouchableOpacity>

      {/* Success Modal */}
      <SuccessModal visible={showSuccess} onClose={handleClose} />
    </Fill>
  );
}

function SuccessModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
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
      backdropColor="rgba(10, 2, 26, 0.4)"
      backdropOpacity={1}>
      <View style={styles.modalBackdrop}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        <AnimatedContainer
          entering={ZoomInDown.springify()
            .delay(100)
            .duration(200)
            .damping(10)
            .mass(1)
            .stiffness(100)}
          backgroundColor="white"
          borderRadius={30}
          px={30}
          py={40}
          gap={24}
          alignItems="center"
          style={styles.modalCard}>
          {/* Checkmark Icon */}
          <Container
            width={80}
            height={80}
            borderRadius={40}
            backgroundColor="Success/50"
            alignItems="center"
            justifyContent="center">
            <CircleCheckBig size={48} color={Colors["Success/600"]} />
          </Container>

          {/* Text */}
          <Column gap={12} alignItems="center">
            <SemiBold fontSize={22} color="Primary/50" textAlign="center">
              Complaint submitted
            </SemiBold>
            <Regular fontSize={14} color="Neutrals/500" textAlign="center" lineHeight={20}>
              Your complaint has been received. Our support team will get back to you shortly.
            </Regular>
          </Column>

          {/* Close Button */}
          <TouchableOpacity
            width="100%"
            height={56}
            backgroundColor="Primary/600"
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            activeOpacity={0.8}
            onPress={onClose}>
            <SemiBold fontSize={18} color="Primary/950">
              Close
            </SemiBold>
          </TouchableOpacity>
        </AnimatedContainer>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    maxWidth: 350,
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
