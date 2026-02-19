import { Container, Fill } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { TripPhase } from "~/features/trip/trip-phase";
import { useBalance } from "~/features/wallet/hooks/use-balance";
import { formatCurrency } from "~/features/wallet/types";
import { useLogout, useUser } from "~/hooks/use-auth";
import { useRiderProfile } from "~/hooks/use-rider-profile";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon, IconName } from "~/shared/ui/icons";
import { LanguageSheet } from "./language-sheet";
import { LogoutSheet } from "./logout-sheet";

interface MenuItemProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean;
}

const MenuItem = ({ icon, label, onPress, isDestructive }: MenuItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Container
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="white"
        borderRadius={20}
        px={22}
        height={56}
        borderWidth={isDestructive ? 1 : 0}
        borderColor={isDestructive ? "Danger/600" : undefined}>
        <Container flexDirection="row" alignItems="center" gap={12}>
          {/* TODO: Update icons when available in the library */}
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
      </Container>
    </TouchableOpacity>
  );
};

export default function ProfileSettingsScreen() {
  const { t } = useTranslation();
  const { data: profile } = useRiderProfile();
  const { data: user } = useUser();
  const { data: walletBalance } = useBalance();
  const logoutMutation = useLogout();
  const logoutSheetRef = useRef<BottomSheetModal>(null);
  const languageSheetRef = useRef<BottomSheetModal>(null);
  const { phase, push } = useTripFlow();

  const handleLanguagePress = () => {
    languageSheetRef.current?.present();
  };

  const handleLogoutPress = () => {
    logoutSheetRef.current?.present();
  };

  const handleConfirmLogout = async () => {
    await logoutMutation.mutateAsync({});
    logoutSheetRef.current?.dismiss();
  };

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <Container px={20} pt={20} gap={27}>
          {/* User Info & Wallet */}
          <Container gap={20}>
            {/* User Card */}
            <Container backgroundColor="white" borderRadius={20} px={22} py={20} gap={20}>
              <Container flexDirection="row" alignItems="center" gap={12}>
                {profile?.avatar?.publicUrl ? (
                  <Image
                    source={{ uri: profile.avatar.publicUrl }}
                    style={{ width: 59, height: 59, borderRadius: 30 }}
                    contentFit="cover"
                  />
                ) : (
                  <Container
                    width={59}
                    height={59}
                    borderRadius={30}
                    backgroundColor="Primary/950"
                    alignItems="center"
                    justifyContent="center">
                    <Icon
                      name="profile-fill"
                      width={36}
                      height={36}
                      color={Colors["Primary/400"]}
                    />
                  </Container>
                )}
                <Container flex={1} gap={6}>
                  <Regular fontSize={18} lineHeight={24} color="Primary/50">
                    {profile?.fullName}
                  </Regular>
                  <Container flexDirection="row" alignItems="center" gap={6}>
                    <Icon name="phone" width={19} height={19} color={Colors["Primary/600"]} />
                    <Regular fontSize={12} lineHeight={16} color="Neutrals/400">
                      {user?.phoneNumber}
                    </Regular>
                  </Container>
                </Container>
                <TouchableOpacity onPress={() => router.push("/profile-settings/edit-profile")}>
                  <Icon name="edit-fill2" width={24} height={24} color={Colors["Primary/600"]} />
                </TouchableOpacity>
              </Container>

              {/* Wallet Card */}
              <TouchableOpacity
                onPress={() => {
                  if (phase !== TripPhase.Wallet) {
                    push(TripPhase.Wallet);
                  }
                  router.back();
                }}>
                <Container
                  flexDirection="row"
                  alignItems="center"
                  borderColor="Primary/600"
                  borderWidth={1}
                  borderRadius={20}
                  p={14}
                  gap={10}>
                  <Container width={29} height={29} alignItems="center" justifyContent="center">
                    <Icon name="wallet2" width={29} height={29} color={Colors["Success/600"]} />
                  </Container>
                  <Container flex={1} gap={6}>
                    <Regular
                      fontSize={12}
                      lineHeight={16}
                      color="Primary/50"
                      style={{ opacity: 0.6 }}>
                      {t("common.availableBalance")}
                    </Regular>
                    <SemiBold fontSize={16} lineHeight={24} color="Primary/50">
                      {formatCurrency(walletBalance?.balance ?? 0)}
                    </SemiBold>
                  </Container>
                  <Icon name="next-ltr" width={8.84} height={15.3} color={Colors["Primary/600"]} />
                </Container>
              </TouchableOpacity>
            </Container>
          </Container>

          {/* General Settings */}
          <Container gap={14}>
            <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
              {t("profile.generalSettings")}
            </Regular>

            <MenuItem
              icon="bell"
              label={t("common.notifications")}
              onPress={() => router.push("/profile-settings/notification-settings")}
            />
            <MenuItem
              icon="payment"
              label={t("common.paymentMethods")}
              onPress={() => router.push("/profile-settings/payment-methods")}
            />
            <MenuItem
              icon="lock2"
              label={t("common.accountSecurity")}
              onPress={() => router.push("/profile-settings/account-security")}
            />
            <MenuItem icon="language2" label={t("common.language")} onPress={handleLanguagePress} />
          </Container>

          {/* Settings */}
          <Container gap={14}>
            <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
              {t("common.settings")}
            </Regular>
            <MenuItem
              icon="support2"
              label={t("common.helpSupport")}
              onPress={() => router.push("/profile-settings/support")}
            />
            <MenuItem
              icon="document2"
              label={t("common.privacyPolicies")}
              onPress={() => router.push("/profile-settings/privacy-policies")}
            />
            <MenuItem
              icon="logout2"
              label={t("common.logout")}
              isDestructive
              onPress={handleLogoutPress}
            />
          </Container>
        </Container>
      </ScrollView>
      <LanguageSheet ref={languageSheetRef} />
      <LogoutSheet ref={logoutSheetRef} onLogout={handleConfirmLogout} />
    </Fill>
  );
}
