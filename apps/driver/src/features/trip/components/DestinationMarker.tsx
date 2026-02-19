import React from "react";
import { View } from "react-native";

import { icons } from "@brocabs/ui/icons/registry";

const Ellipse1 = icons.ellipse1;
const Ellipse2 = icons.ellipse2;
const Ellipse3 = icons.ellipse3;

export const DestinationMarker = () => {
  return (
    <View style={{ width: 45, height: 85, alignItems: "center", justifyContent: "center" }}>
      {/* Outer Circle */}
      <View style={{ position: "absolute" }}>
        <Ellipse1 width={45} height={45} />
      </View>
      {/* Middle Circle */}
      <View style={{ position: "absolute" }}>
        <Ellipse2 width={26} height={26} />
      </View>
      {/* Inner Circle */}
      <View style={{ position: "absolute" }}>
        <Ellipse3 width={12} height={12} />
      </View>
    </View>
  );
};
