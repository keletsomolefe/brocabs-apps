import { Container, Image } from "@brocabs/ui/layout";
import { Medium, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { Colors } from "@brocabs/ui/theme/colors";
import { StyleSheet, View } from "react-native";

import { useEffect } from "react";
import { useTranslation } from "~/i18n/LocaleContext";
import { useDriverArrivedStore } from "../stores/driverArrivedStore";

export function DriverArrivedModal() {
  const { t } = useTranslation();
  const { isVisible, dismissModal } = useDriverArrivedStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dismissModal();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dismissModal]);

  if (!isVisible) return null;

  const carIcon = AssetFiles.images["car-medium-white"];

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Container width={237} height={178} justifyContent="center" alignItems="center">
          <Image source={carIcon} style={styles.carImage} contentFit="contain" />
        </Container>
        <Container alignItems="center" gap={0.5} width="100%">
          <SemiBold style={styles.title}>{t("common.yourBroIsHere")}</SemiBold>
          <Medium style={styles.subtitle}>{t("common.freeMinutesMessage")}</Medium>
        </Container>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(10, 2, 26, 0.30)",
  },
  modalContainer: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    gap: 20,
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    color: Colors["Primary/50"],
    textAlign: "center",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 12,
    color: Colors["Primary/50"],
    textAlign: "center",
    lineHeight: 16,
  },
  highlight: {
    color: Colors["Primary/600"],
    fontSize: 12,
    lineHeight: 16,
  },
});
