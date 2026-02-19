import { Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { Eye, EyeOff } from "lucide-react-native";
import { forwardRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import { useTranslation } from "~/i18n/LocaleContext";

interface DeleteAccountSheetProps {
  onDelete: (password: string) => void;
  isDeleting?: boolean;
}

export const DeleteAccountSheet = forwardRef<BottomSheetModal, DeleteAccountSheetProps>(
  ({ onDelete, isDeleting }, ref) => {
    const { t } = useTranslation();
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
            paddingBottom: 50,
            paddingTop: 30,
          }}>
          <Container alignItems="center" gap={20}>
            <Container alignItems="center" gap={20}>
              <Bold fontSize={22} color="Primary/50" textAlign="center">
                {t("common.deleteAccount")}
              </Bold>
              <Regular fontSize={18} lineHeight={24} color="Primary/50" textAlign="center">
                {t("profile.deleteAccountWarning")}
              </Regular>
            </Container>

            <Container width="100%" gap={8}>
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
                    <Eye size={20} color={Colors["Neutrals/400"]} />
                  ) : (
                    <EyeOff size={20} color={Colors["Neutrals/400"]} />
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
                    Cancel
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
                    <SemiBold fontSize={18} lineHeight={16} color="white">
                      Delete
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
