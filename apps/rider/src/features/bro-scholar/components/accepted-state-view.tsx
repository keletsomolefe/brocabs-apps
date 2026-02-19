import { BroScholarApplicationResponseDto } from "@brocabs/client";
import { Button } from "@brocabs/ui/button";
import { Column, Container, Fill, Image, Row } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { BroScholarText } from "~/shared/ui/bro-scholar-text";

const APPROVED_STATUS = "APPROVED";

interface AcceptedStateViewProps {
  application: BroScholarApplicationResponseDto;
}

export function AcceptedStateView({ application }: AcceptedStateViewProps) {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const studentName = application.studentName;
  // TODO: Get actual expiration date from backend or logic
  const expirationDate = application.reviewedAt
    ? format(
        new Date(
          new Date(application.reviewedAt).setFullYear(
            new Date(application.reviewedAt).getFullYear() + 1
          )
        ),
        "dd/MM/yy"
      )
    : t("common.nA");

  const isActive = application.status === APPROVED_STATUS;
  const statusLabel = isActive ? t("common.active") : t("common.disabled");

  const handleBookRide = () => {
    router.push("/(app)/home");
  };

  const handleRenewStatus = () => {
    router.push("/bro-scholar/create-application");
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Column flex={1} paddingHorizontal={20} paddingBottom={20 + bottom}>
        {/* Header */}
        <Column alignItems="center" gap={8} pt={20}>
          <Row alignItems="center" gap={5}>
            <BroScholarText fontSize={20} lineHeight={28} width={90} />
            <Bold fontSize={20} lineHeight={28}>
              {t("common.status")}
            </Bold>
          </Row>
          <Regular fontSize={16} center color="Neutrals/400" lineHeight={24}>
            {t("common.verifiedStudentDesc")}
          </Regular>
        </Column>

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

          {/* Student Status Card */}
          <View style={styles.statusCardContainer}>
            <Image
              style={StyleSheet.absoluteFill}
              source={require("~/assets/images/card.png")}
              contentFit="cover"
            />
            <Container style={styles.statusCard} gap={16}>
              {/* Header */}
              <Row justifyContent="space-between" alignItems="center" width="100%">
                {/* Bro. Logo */}
                <Image
                  source={require("~/assets/images/logo-light.png")}
                  contentFit="contain"
                  style={{ width: 64, height: 24 }}
                />

                {/* Discounted Tag */}
                <View
                  style={{
                    borderRadius: 100,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(85,0,255,0.4)",
                  }}>
                  <BlurView intensity={20} tint="light">
                    <LinearGradient
                      colors={["#A000FF", "#6B50FF", "#FE6D6B"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                      }}>
                      <Regular fontSize={12} color="white">
                        {t("common.discounted")}
                      </Regular>
                    </LinearGradient>
                  </BlurView>
                </View>
              </Row>

              {/* Student Info Section */}
              <Row alignItems="center" gap={10} width="100%">
                {/* Student Photo */}
                <View
                  style={{
                    width: 67,
                    height: 42,
                    borderRadius: 4,
                    borderWidth: 0.5,
                    borderColor: "#e5e5e5",
                    overflow: "hidden",
                    backgroundColor: "white",
                  }}>
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={
                      application.studentFaceImageFile ||
                      "https://ideogram.ai/assets/image/balanced/response/4A9p0AqUQpS19hAzBIZSFQ@2k"
                    }
                    contentFit="cover"
                  />
                </View>

                {/* Student Details */}
                <Row flex={1} alignItems="center" justifyContent="space-between">
                  {/* Name Section */}
                  <Column>
                    <Regular fontSize={12} color="white" style={{ opacity: 0.8 }}>
                      {t("common.studentName")}
                    </Regular>
                    <Regular fontSize={20} color="white" lineHeight={36}>
                      {studentName}
                    </Regular>
                  </Column>

                  {/* Expiration Date Section */}
                  <Column alignItems="flex-end">
                    <Regular fontSize={12} color="white" style={{ opacity: 0.8 }}>
                      {t("common.expDate")}
                    </Regular>
                    <Regular fontSize={20} color="white" lineHeight={36}>
                      {expirationDate}
                    </Regular>
                  </Column>
                </Row>
              </Row>

              {/* Status Section */}
              <Row justifyContent="space-between" alignItems="center" width="100%">
                <Regular fontSize={12} color="white">
                  {t("common.sclrStatus")}
                </Regular>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#D1FADF",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 100,
                    gap: 5,
                  }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isActive ? "#12B76A" : Colors["Danger/600"],
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "Sarabun",
                      fontSize: 12,
                      color: "black",
                    }}>
                    {statusLabel}
                  </Text>
                </View>
              </Row>
            </Container>
          </View>

          {/* Action Button */}
          <View style={styles.buttonWrapper}>
            <Button
              label={isActive ? t("common.bookRide") : t("common.renewStatus")}
              variant="primary"
              radius="rounded"
              size="md"
              onPress={isActive ? handleBookRide : handleRenewStatus}
            />
          </View>

          {/* Disclaimer (only shown if disabled) */}
          {!isActive && (
            <Regular fontSize={12} center color="Danger/600" style={styles.disclaimer}>
              {t("common.studentPlanEnded")}
            </Regular>
          )}
        </Column>

        {/* Footer Help Text */}
        <Text style={styles.helpText}>
          <Text style={styles.helpLink}>{t("common.needHelp")}</Text>
          {t("common.contactSupportDesc")}
          <Text style={styles.helpLink}>{t("common.help")}</Text>
        </Text>
      </Column>
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
  statusCardContainer: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  statusCard: {
    padding: 20,
    borderRadius: 20,
    minHeight: 180,
  },
  disclaimer: {
    lineHeight: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
