import { Container, Fill } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { subscriptionsApi } from "~/api";
import { DutySwitch } from "~/features/trip/components/duty-switch";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { TripPhase } from "~/features/trip/trip-phase";
import { useLogout, useUser } from "~/hooks/use-auth";
import { useBalance } from "~/hooks/use-balance";
import { useDriverProfile } from "~/hooks/use-driver-profile";
import { useLocale } from "~/i18n/LocaleContext";
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

const formatCurrency = (amount: number): string => {
  return `R ${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function ProfileSettingsScreen() {
  const { t } = useLocale();
  const { data: profile } = useDriverProfile();
  const { data: user } = useUser();
  const { data: walletBalance } = useBalance();
  const logoutMutation = useLogout();
  const logoutSheetRef = useRef<BottomSheetModal>(null);
  const languageSheetRef = useRef<BottomSheetModal>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const { phase, push } = useTripFlow();

  const handleLanguagePress = () => {
    languageSheetRef.current?.present();
  };

  const { data: subscription } = useQuery({
    queryKey: ["current-subscription"],
    queryFn: async () => {
      return await subscriptionsApi.subscriptionControllerGetCurrentSubscription();
    },
  });

  const handleLogoutPress = () => {
    logoutSheetRef.current?.present();
  };

  const handleConfirmLogout = async () => {
    await logoutMutation.mutateAsync({});
    logoutSheetRef.current?.dismiss();
  };

  const planName = subscription?.plan?.name || t("profileSettings.basicPlan");

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
                <TouchableOpacity
                  onPress={() => {
                    router.push("/profile-settings/edit-profile");
                  }}>
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
                      {t("profileSettings.availableBalance")}
                    </Regular>
                    <SemiBold fontSize={16} lineHeight={24} color="Primary/50">
                      {formatCurrency(walletBalance?.balance ?? 0)}
                    </SemiBold>
                  </Container>
                  <Icon name="next-ltr" width={8.84} height={15.3} color={Colors["Primary/600"]} />
                </Container>
              </TouchableOpacity>

              {/* Available Toggle & Plan */}
              <Container flexDirection="row" alignItems="center" justifyContent="space-between">
                <Container flexDirection="row" alignItems="center" gap={12}>
                  <Regular fontSize={14} lineHeight={24} color="Primary/50">
                    {t("profileSettings.available")}
                  </Regular>
                  <DutySwitch isOnline={isAvailable} onToggle={setIsAvailable} />
                </Container>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/driver-plans")}
                  activeOpacity={0.7}>
                  <LinearGradient
                    colors={["#5905FF", "#FF5905"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}>
                    <Regular fontSize={12} lineHeight={16} color="white">
                      {planName}
                    </Regular>
                  </LinearGradient>
                </TouchableOpacity>
              </Container>
            </Container>
          </Container>

          {/* General Settings */}
          <Container gap={14}>
            <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
              {t("profileSettings.generalSettings")}
            </Regular>

            <MenuItem
              icon="car-skeleton"
              label={t("profileSettings.vehicleInfo")}
              onPress={() => {
                router.push("/profile-settings/vehicle-info");
              }}
            />
            <MenuItem
              icon="bell"
              label={t("profileSettings.notifications")}
              onPress={() => {
                router.push("/profile-settings/notification-settings");
              }}
            />
            <MenuItem
              icon="payment"
              label={t("profileSettings.paymentMethods")}
              onPress={() => {
                router.push("/profile-settings/payment-methods" as any);
              }}
            />
            <MenuItem
              icon="lock2"
              label={t("profileSettings.accountSecurity")}
              onPress={() => {
                router.push("/profile-settings/account-security");
              }}
            />
            <MenuItem
              icon="document2"
              label={t("profileSettings.mySubscriptions")}
              onPress={() => router.push("/profile-settings/subscriptions")}
            />
            <MenuItem icon="language2" label={t("common.language")} onPress={handleLanguagePress} />
          </Container>

          {/* Settings */}
          <Container gap={14}>
            <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
              {t("profileSettings.settings")}
            </Regular>
            <MenuItem
              icon="support2"
              label={t("profileSettings.helpSupport")}
              onPress={() => router.push("/profile-settings/support")}
            />
            <MenuItem
              icon="document2"
              label={t("profileSettings.privacyPolicies")}
              onPress={() => router.push("/profile-settings/privacy-policies")}
            />
            <MenuItem
              icon="logout2"
              label={t("profileSettings.logout")}
              isDestructive
              onPress={handleLogoutPress}
            />
          </Container>
        </Container>
      </ScrollView>
      <LogoutSheet ref={logoutSheetRef} onLogout={handleConfirmLogout} />
      <LanguageSheet ref={languageSheetRef} />
    </Fill>
  );
}
