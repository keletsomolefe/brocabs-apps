import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { FontFamily } from "@brocabs/ui/theme/fonts";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { useLogout, useUser } from "~/hooks/use-auth";

import { Fill, Image, Pressable } from "@brocabs/ui/layout";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { useCurrentAddress } from "~/features/trip/stores/locationStore";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { useAppStore } from "~/store";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const logoutMutation = useLogout();
  const { previouslyAuthenticated, isHydrated } = useAppStore(
    useShallow((state) => ({
      previouslyAuthenticated: state.previouslyAuthenticated,
      isHydrated: state.isHydrated,
    }))
  );
  const { data, isLoading } = useUser({ enabled: previouslyAuthenticated });
  const { data: currentAddress } = useCurrentAddress();
  const { t } = useLocale();

  const menuItems = useMemo(
    () => [
      { label: t("drawer.myRidesHistory"), route: "ride-history" },
      { label: t("drawer.notifications"), route: "notifications" },
      { label: t("drawer.sosContacts"), route: "sos-contacts" },
      { label: t("drawer.serviceAreas"), route: "service-areas" },
      { label: t("drawer.makeComplaint"), route: "complaints" },
      { label: t("drawer.support"), route: "profile-settings/support" },
      { label: t("drawer.profileSettings"), route: "profile-settings" },
    ],
    [t]
  );

  if (!previouslyAuthenticated && !isLoading && !data && isHydrated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Fill paddingBottom={insets.bottom} paddingTop={insets.top} backgroundColor="Bg Color">
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Image
            source={AssetFiles.images["logo-dark"]}
            contentFit="contain"
            style={styles.logo}
          />
          <Pressable onPress={() => props.navigation.closeDrawer()}>
            <Icon name="mdi-cross-circle" width={40} height={40} color={Colors["Primary/600"]} />
          </Pressable>
        </View>
        <View style={styles.locationRow}>
          <Icon name="map-pin" width={24} height={24} color={Colors["Primary/600"]} />
          <Regular color="Neutrals/400" fontSize={16}>
            {currentAddress || t("drawer.locating")}
          </Regular>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {/* Availability Status Row */}
        <View style={styles.availabilityContainer}>
          <LinearGradient
            colors={["#A000FF", "#5905FF", "#E4211E"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.planBadge}>
            <Regular fontSize={12} lineHeight={16} color="white">
              {t("drawer.basicPlan")}
            </Regular>
          </LinearGradient>
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
            <Regular fontSize={14} lineHeight={24} color="Primary/50">
              {t("drawer.available")}
            </Regular>
          </View>
        </View>

        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push(`/${item.route}` as any);
            }}
            style={styles.menuItem}>
            <View style={styles.menuItemRow}>
              <Regular fontSize={14} lineHeight={16} color="Primary/50">
                {item.label}
              </Regular>
              <Icon
                name="chevron-right"
                width={7.36}
                height={12.73}
                color={Colors["Primary/600"]}
              />
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.logoutContainer}>
        <Pressable
          onPress={async () => {
            await logoutMutation.mutateAsync({});
          }}
          style={styles.logoutButton}>
          <View style={styles.menuItemRow}>
            <Medium fontSize={16} color="white">
              {t("drawer.logout")}
            </Medium>
            <Icon name="chevron-right" width={7.36} height={12.73} color="white" />
          </View>
        </Pressable>
      </View>
    </Fill>
  );
}

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          backgroundColor: Colors["Bg Color"],
        },
        drawerLabelStyle: {
          fontFamily: FontFamily.Regular,
          fontSize: 16,
          color: Colors["Primary/50"],
        },
        drawerItemStyle: {
          backgroundColor: Colors.white,
          borderRadius: 10,
        },
      }}>
      <Drawer.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="index"
        options={{
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="application-rejected"
        options={{
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="pending-approval"
        options={{
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 95.4,
    height: 36,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 10,
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  planBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10000,
    borderWidth: 1,
    borderColor: "rgba(85, 0, 255, 0.4)",
    overflow: "hidden",
  },
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#D1FADF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#12B76A",
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  menuItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: Colors["Danger/600"],
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
});
