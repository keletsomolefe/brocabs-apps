import { Colors } from "@brocabs/ui/theme/colors";
import { FontFamily } from "@brocabs/ui/theme/fonts";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { CustomDrawerContent } from "~/shared/ui/drawer-content";

export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
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
    </Drawer>
  );
}
