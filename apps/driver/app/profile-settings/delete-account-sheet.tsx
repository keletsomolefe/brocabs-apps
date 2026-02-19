import { Container, Image } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";
import { AssetFiles } from "~/theme/assets";

interface DeleteAccountSheetProps {
  onDelete: (password: string) => void;
  isDeleting?: boolean;
}

export const DeleteAccountSheet = forwardRef<BottomSheetModal, DeleteAccountSheetProps>(
  ({ onDelete, isDeleting }, ref) => {
    const { t } = useLocale();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleDelete = () => {
      if (password.length > 0) {
        onDelete(password);
      }
    };

    const handleDismiss = () => {
      setPassword("");
      (ref as any).current?.dismiss();
    };

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
            paddingBottom: 30,
            paddingTop: 30,
          }}>
          <Container alignItems="center" style={{ gap: 20 }}>
            <Container alignItems="center" style={{ gap: 16 }}>
              <Image source={AssetFiles.images["mascot-warning"]} width={120} height={120} />
              <Bold fontSize={18} lineHeight={24} color="Danger/600" textAlign="center">
                {t("profileSettings.deleteAccount")}
              </Bold>
              <Regular
                fontSize={16}
                lineHeight={24}
                color="Primary/50"
                textAlign="center"
                style={{ width: 336 }}>
                {t("profile.deleteAccountWarning")}
              </Regular>
            </Container>

            <Container width="100%" style={{ gap: 8 }}>
              <Regular fontSize={14} lineHeight={20} color="Primary/50">
                {t("common.password")}
              </Regular>
              <Container
                flexDirection="row"
                alignItems="center"
                backgroundColor="Neutrals/100"
                borderRadius={12}
                px={16}
                height={48}>
                <BottomSheetTextInput
                  placeholder={t("common.enterPassword")}
                  placeholderTextColor={Colors["Neutrals/400"]}
                  secureTextEntry={!showPassword}
                  value={password}
                  autoFocus
                  onChangeText={setPassword}
                  editable={!isDeleting}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: Colors["Primary/50"],
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <MaterialIcons name="visibility-off" color={Colors["Neutrals/400"]} size={20} />
                  ) : (
                    <MaterialIcons name="visibility" color={Colors["Neutrals/400"]} size={20} />
                  )}
                </TouchableOpacity>
              </Container>
            </Container>

            <Container flexDirection="row" style={{ gap: 10 }} width="100%">
              <TouchableOpacity style={{ flex: 1 }} onPress={handleDismiss} disabled={isDeleting}>
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

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={handleDelete}
                disabled={isDeleting || password.length === 0}>
                <Container
                  height={56}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="Danger/600"
                  borderRadius={20}
                  opacity={password.length === 0 ? 0.5 : 1}>
                  {isDeleting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <SemiBold fontSize={18} lineHeight={24} color="white">
                      {t("common.delete")}
                    </SemiBold>
                  )}
                </Container>
              </TouchableOpacity>
            </Container>
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

DeleteAccountSheet.displayName = "DeleteAccountSheet";

export default DeleteAccountSheet;
