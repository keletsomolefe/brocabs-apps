import { Container, Fill, Image, Pressable, Row } from "@brocabs/ui/layout";
import { Bold, Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { LogoutSheet } from "../../../app/profile-settings/logout-sheet";
import { useLogout, useUser } from "~/hooks/use-auth";
import { useTranslation } from "~/i18n/LocaleContext";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { X } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { BroScholarText } from "~/shared/ui/bro-scholar-text";
import { Icon } from "~/shared/ui/icons";
import { useAppStore } from "~/store";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const logoutMutation = useLogout();
  const logoutSheetRef = useRef<BottomSheetModal>(null);
  const { previouslyAuthenticated, isHydrated } = useAppStore(
    useShallow((state) => ({
      previouslyAuthenticated: state.previouslyAuthenticated,
      isHydrated: state.isHydrated,
    }))
  );
  const { data, isLoading } = useUser({ enabled: previouslyAuthenticated });

  const handleLogoutPress = () => {
    logoutSheetRef.current?.present();
  };

  const handleConfirmLogout = async () => {
    await logoutMutation.mutateAsync({});
    logoutSheetRef.current?.dismiss();
  };

  if (!previouslyAuthenticated && !isLoading && !data && isHydrated) {
    return <Redirect href="/(auth)" />;
  }

  const menuItems = [
    { label: t("common.rideHistory"), route: "ride-history" },
    { label: t("common.notifications"), route: "notifications" },
    { label: t("common.sosContacts"), route: "sos-contacts" },
    { label: t("common.favoriteAddresses"), route: "favorite-addresses" },
    { label: t("common.makeComplaint"), route: "complaints" },
    { label: t("common.support"), route: "profile-settings/support" },
    { label: t("common.profileSettings"), route: "profile-settings" },
  ];

  return (
    <Fill paddingBottom={insets.bottom} paddingTop={insets.top} backgroundColor="Bg Color">
      <Container px={20} pt={20}>
        <Row justifyContent="space-between" alignItems="center">
          <Image
            source={AssetFiles.images["logo-black"]}
            contentFit="contain"
            width={95.4}
            height={36}
          />
          <Pressable onPress={() => props.navigation.closeDrawer()}>
            <Container
              width={32}
              height={32}
              backgroundColor="Primary/600"
              borderRadius={16}
              justifyContent="center"
              alignItems="center">
              <X width={20} height={20} color={Colors.white} />
            </Container>
          </Pressable>
        </Row>
        <Row gap={10} alignItems="center" mt={10}>
          <Icon name="map-pin" width={24} height={24} color={Colors["Primary/600"]} />
          <Regular color="Neutrals/400" fontSize={16}>
            {t("common.defaultLocation")}
          </Regular>
        </Row>
      </Container>

      <Container flex={1} px={20} mt={24} gap={10}>
        <Pressable
          onPress={() => {
            props.navigation.closeDrawer();
            router.push("/bro-scholar");
          }}
          backgroundColor="white"
          borderRadius={10}
          py={10}
          px={15}>
          <Row justifyContent="space-between" alignItems="center">
            <BroScholarText fontSize={14} lineHeight={16} width={65} />
            <Row gap={10} alignItems="center">
              <LinearGradient
                colors={["#A000FF", "#5905FF", "#E4211E"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.chip}>
                <Bold fontSize={12} lineHeight={16} color="white">
                  {t("common.apply")}
                </Bold>
              </LinearGradient>
              <Icon
                name="chevron-right"
                width={7.36}
                height={12.73}
                color={Colors["Primary/600"]}
              />
            </Row>
          </Row>
        </Pressable>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push(`/${item.route}` as any);
            }}
            backgroundColor="white"
            borderRadius={10}
            py={15}
            px={15}>
            <Row justifyContent="space-between" alignItems="center">
              <Regular fontSize={14} lineHeight={16} color="Primary/50">
                {item.label}
              </Regular>
              <Icon
                name="chevron-right"
                width={7.36}
                height={12.73}
                color={Colors["Primary/600"]}
              />
            </Row>
          </Pressable>
        ))}
      </Container>

      <Container px={20} pb={20}>
        <Pressable
          onPress={handleLogoutPress}
          backgroundColor="Danger/600"
          borderRadius={10}
          py={15}
          px={15}>
          <Row justifyContent="space-between" alignItems="center">
            <Medium fontSize={16} color="white">
              {t("common.logout")}
            </Medium>
            <Icon name="chevron-right" width={7.36} height={12.73} color="white" />
          </Row>
        </Pressable>
      </Container>
      <LogoutSheet ref={logoutSheetRef} onLogout={handleConfirmLogout} />
    </Fill>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 10000,
  },
});
