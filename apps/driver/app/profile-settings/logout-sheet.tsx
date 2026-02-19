import { Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { TouchableOpacity } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

interface LogoutSheetProps {
  onLogout: () => void;
}

export const LogoutSheet = forwardRef<BottomSheetModal, LogoutSheetProps>(({ onLogout }, ref) => {
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
          backgroundColor: "white",
        }}>
        <Container alignItems="center" style={{ gap: 20 }}>
          <Container alignItems="center" style={{ gap: 20 }}>
            <Icon name="logout2" width={54} height={54} color={Colors["Primary/50"]} />
            <Regular
              fontSize={18}
              lineHeight={24}
              color="Primary/50"
              textAlign="center"
              style={{ width: 336 }}>
              {t("profileSettings.logoutConfirmation")}
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
                <SemiBold fontSize={18} lineHeight={16} color="white">
                  {t("profileSettings.logout")}
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

export default LogoutSheet;
