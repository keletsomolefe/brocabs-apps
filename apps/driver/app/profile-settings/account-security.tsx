import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Card, Container, Fill } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef } from "react";
import { TouchableOpacity } from "react-native";
import { useDeleteAccount } from "~/hooks/use-delete-account";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon, IconName } from "~/shared/ui/icons";
import { DeleteAccountSheet } from "./delete-account-sheet";

interface MenuItemProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

const MenuItem = ({ icon, label, onPress, isDestructive }: MenuItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="white"
        borderRadius={20}
        px={22}
        height={56}>
        <Container flexDirection="row" alignItems="center" gap={12}>
          <Icon
            name={icon}
            width={24}
            height={24}
            color={isDestructive ? Colors["Danger/600"] : Colors["Primary/600"]}
          />
          <Regular
            fontSize={14}
            lineHeight={24}
            color={isDestructive ? "Danger/600" : "Primary/50"}>
            {label}
          </Regular>
        </Container>
        {!isDestructive && (
          <Icon name="next-ltr" width={8.84} height={15.3} color={Colors["Primary/600"]} />
        )}
      </Card>
    </TouchableOpacity>
  );
};

export default function AccountSecurityScreen() {
  const { t } = useLocale();
  const deleteAccountSheetRef = useRef<BottomSheetModal>(null);
  const deleteAccountMutation = useDeleteAccount();

  const handleDeleteAccount = async (password: string) => {
    ModalBox.show("popup", {
      content: (
        <Dialog.Loader
          source={Lottie.loader}
          title={t("profile.deletingAccount")}
          description={t("profile.deleteAccountWait")}
        />
      ),
    });

    try {
      await deleteAccountMutation.mutateAsync(password);
      ModalBox.hide();
      deleteAccountSheetRef.current?.dismiss();

      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title={t("profile.accountDeleted")}
            description={t("profile.accountDeletedDesc")}
            icon="check-circle"
            buttonLabel={t("common.ok")}
            onPress={() => {
              ModalBox.hide();
              router.replace("/(auth)/mobile-number");
            }}
          />
        ),
      });
    } catch (error: any) {
      ModalBox.hide();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title={t("profile.deleteFailed")}
            description={error?.message || t("profile.deleteAccountFailed")}
            icon="mdi-cross-circle"
            buttonLabel={t("common.ok")}
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    }
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={20} gap={36}>
        {/* Menu Items */}
        <Container gap={14}>
          <MenuItem
            icon="lock"
            label={t("profileSettings.changePassword")}
            onPress={() => {
              router.push("/profile-settings/change-password");
            }}
          />
          <MenuItem
            icon="trash"
            label={t("profileSettings.deleteAccount")}
            isDestructive
            onPress={() => {
              deleteAccountSheetRef.current?.present();
            }}
          />
        </Container>
      </Container>
      <DeleteAccountSheet
        ref={deleteAccountSheetRef}
        onDelete={handleDeleteAccount}
        isDeleting={deleteAccountMutation.isPending}
      />
    </Fill>
  );
}
