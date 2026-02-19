import { Image, View } from "react-native";

interface CarMarkerProps {
  /** Heading in degrees (0 = North, 90 = East, 180 = South, 270 = West) */
  heading?: number;
  /** Size of the marker (default 36) */
  size?: number;
}

/**
 * Car marker PNG that rotates based on heading.
 * The car icon points North (up) by default.
 */
export function CarMarker({ heading = 0, size = 36 }: CarMarkerProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        transform: [{ rotate: `${heading}deg` }],
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Image
        source={require("~/assets/images/car-marker.png")}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
