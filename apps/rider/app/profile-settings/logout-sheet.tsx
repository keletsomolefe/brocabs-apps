import { Container, Image } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "~/i18n/LocaleContext";

interface LogoutSheetProps {
  onLogout: () => void;
}

export const LogoutSheet = forwardRef<BottomSheetModal, LogoutSheetProps>(({ onLogout }, ref) => {
  const { t } = useTranslation();
  const mascotImage = AssetFiles.images["mascot-warning"];
  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      enableDynamicSizing={true}
      backdropComponent={Backdrop}
      handleComponent={null}
      backgroundStyle={{
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}>
      <BottomSheetView
        style={{
          paddingHorizontal: 20,
          paddingBottom: 50,
          paddingTop: 30,
        }}>
        <Container alignItems="center" style={{ gap: 20 }}>
          <Container alignItems="center" style={{ gap: 20 }}>
            <Container alignItems="center">
              <Image source={mascotImage} style={styles.mascotImage} resizeMode="contain" />
            </Container>
            <Bold fontSize={22} color="Primary/50" textAlign="center">
              {t("common.logoutTitle")}
            </Bold>
            <Regular fontSize={18} lineHeight={24} color="Primary/50" textAlign="center">
              {t("common.confirmLogout")}
            </Regular>
          </Container>

          <Container flexDirection="row" style={{ gap: 10 }} width="100%">
            <TouchableOpacity style={{ flex: 1 }} onPress={() => (ref as any).current?.dismiss()}>
              <Container
                height={56}
                alignItems="center"
                justifyContent="center"
                backgroundColor="Primary/950"
                borderRadius={20}>
                <Regular fontSize={18} lineHeight={24} color="Primary/600">
                  {t("common.cancel")}
                </Regular>
              </Container>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1 }} onPress={onLogout}>
              <Container
                height={56}
                alignItems="center"
                justifyContent="center"
                backgroundColor="Secondary/600"
                borderRadius={20}>
                <SemiBold fontSize={18} lineHeight={24} color="white">
                  {t("common.logoutTitle")}
                </SemiBold>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

LogoutSheet.displayName = "LogoutSheet";

const styles = StyleSheet.create({
  mascotImage: {
    width: 120,
    height: 120,
  },
});

export default LogoutSheet;
