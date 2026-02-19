import { Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";
import { AssetFiles } from "~/theme/assets";

interface DeleteContactSheetProps {
  onDelete: () => void;
  contactName?: string;
}

export const DeleteContactSheet = forwardRef<BottomSheetModal, DeleteContactSheetProps>(
  ({ onDelete, contactName }, ref) => {
    const { t } = useLocale();
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
          <Container alignItems="center" gap={20}>
            <Container alignItems="center" gap={20}>
              <Container alignItems="center">
                <Image
                  source={AssetFiles.images["mascot-warning"]}
                  style={styles.mascotImage}
                  resizeMode="contain"
                />
              </Container>
              <Bold fontSize={22} color="Primary/50" textAlign="center">
                {t("sos.deleteContactTitle")}
              </Bold>
              <Regular fontSize={18} lineHeight={24} color="Primary/50" textAlign="center">
                {t("sos.deleteConfirmPart1")} <Bold>{contactName}</Bold>{" "}
                {t("sos.deleteConfirmPart2")}
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
                    {t("sos.cancel")}
                  </Regular>
                </Container>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={onDelete}>
                <Container
                  height={56}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="Danger/600"
                  borderRadius={20}>
                  <SemiBold fontSize={18} lineHeight={24} color="white">
                    {t("sos.delete")}
                  </SemiBold>
                </Container>
              </TouchableOpacity>
            </Container>
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

DeleteContactSheet.displayName = "DeleteContactSheet";

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
  },
  mascotImage: {
    width: 120,
    height: 120,
  },
});

export default DeleteContactSheet;
