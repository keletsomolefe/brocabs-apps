import { Colors } from "@brocabs/ui/theme/colors";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useConnectionStatus } from "~/hooks/useConnectionStatus";

export function withConnectionStatus(HeaderComponent: React.ComponentType<any>) {
  return function WithConnectionStatus(props: any) {
    const insets = useSafeAreaInsets();
    const isBannerVisible = useConnectionStatus().isBannerVisible;

    if (!isBannerVisible) {
      return <HeaderComponent {...props} />;
    }

    return (
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            backgroundColor: Colors["Danger/600"],
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: insets.top,
            marginBottom: 0,
          }}>
          <Text
            style={{
              color: "white",
              fontFamily: "BRHendrix-Medium",
              fontSize: 14,
              lineHeight: 20,
            }}>
            Not connected...
          </Text>
        </View>
        <HeaderComponent {...props} connectionBannerVisible={true} />
      </View>
    );
  };
}
