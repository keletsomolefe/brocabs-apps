import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import { Icon } from "../icons/icon";
import { Colors } from "../theme/colors";

interface PickupMarkerProps {
  loading?: boolean;
  avatar?: string | undefined | null;
}

export const PickupMarker = ({ loading, avatar }: PickupMarkerProps) => {
  return (
    <View
      style={{
        width: 41,
        height: 56,
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {/* Shadow */}
      <Svg width={35} height={12} style={{ position: "absolute", bottom: 0 }}>
        <Defs>
          <RadialGradient id="shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="black" stopOpacity="0.4" />
            <Stop offset="1" stopColor="black" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="17.5" cy="6" rx="17.5" ry="6" fill="url(#shadow)" />
      </Svg>

      {/* Pin Container */}
      <View style={{ width: 41, height: 54, marginBottom: 2 }}>
        <Svg
          width={41}
          height={54}
          viewBox="0 0 41 54"
          style={{ position: "absolute" }}
        >
          {/* Pin Body */}
          <Path
            d="M20.5 0C9.18 0 0 9.18 0 20.5C0 31.82 20.5 54 20.5 54C20.5 54 41 31.82 41 20.5C41 9.18 31.82 0 20.5 0Z"
            fill="white"
          />
          {/* Inner White Circle */}
          <Circle cx="20.5" cy="20.5" r="18.5" fill="white" />
        </Svg>

        {/* Content Overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 41,
            height: 41,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#6828FF" />
          ) : avatar ? (
            <Image
              source={{ uri: avatar }}
              style={{ width: 33, height: 33, borderRadius: 16.5 }}
              contentFit="cover"
            />
          ) : (
            <Icon
              name="profile-fill"
              width={33}
              height={33}
              color={Colors["Primary/400"]}
            />
          )}
        </View>
      </View>
    </View>
  );
};
