import { Button } from "@brocabs/ui/button";
import { Column, Fill, Image, Row } from "@brocabs/ui/layout";
import { Bold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { BroScholarText } from "~/shared/ui/bro-scholar-text";
import { SuccessModal } from "./success-modal";

export function ApplicationStateView() {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleCreateApplication = () => {
    router.push("/bro-scholar/create-application");
  };

  const handleBookRide = () => {
    setShowSuccessModal(false);
    router.push("/(app)/home");
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Column flex={1} paddingHorizontal={20} paddingBottom={20 + bottom}>
        {/* Main Content */}
        <Column
          flex={1}
          justifyContent="center"
          alignItems="center"
          gap={30}
          style={styles.content}>
          {/* Car Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require("~/assets/images/car-big-bro-scholar-white.png")}
              style={styles.illustration}
              contentFit="contain"
            />
          </View>

          {/* Information Card */}
          <View style={styles.card}>
            <Row gap={4} alignItems="center">
              <Bold fontSize={18} lineHeight={24}>
                {t("common.applyFor")}
              </Bold>
              <BroScholarText fontSize={18} lineHeight={24} width={90} />
            </Row>
            <Text style={styles.cardDescription}>{t("common.verifiedStudentDesc")}</Text>
          </View>

          {/* CTA Button */}
          <View style={styles.buttonWrapper}>
            <Button
              label={t("common.createApplicationLabel")}
              variant="primary"
              radius="rounded"
              size="md"
              onPress={handleCreateApplication}
            />
          </View>
        </Column>

        {/* Footer Help Text */}
        <Text style={styles.helpText}>
          <Text style={styles.helpLink}>{t("common.needHelp")}</Text>
          {t("common.contactSupportDesc")}
          <Text style={styles.helpLink}>{t("common.help")}</Text>
        </Text>
      </Column>

      {/* Success Modal */}
      <SuccessModal visible={showSuccessModal} onBookRide={handleBookRide} />
    </Fill>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
  },
  illustrationContainer: {
    width: "100%",
    maxWidth: 300,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardDescription: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 16,
    lineHeight: 24,
    color: Colors["Neutrals/400"],
    textAlign: "center",
  },
  buttonWrapper: {
    width: "100%",
  },
  helpText: {
    fontFamily: "BRHendrix-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: Colors["Primary/50"],
    textAlign: "center",
  },
  helpLink: {
    color: Colors["Primary/400"],
    textDecorationLine: "underline",
  },
});
