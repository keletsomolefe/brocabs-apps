import React, { useMemo } from "react";
import { Marker } from "react-native-maps";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { useHeading } from "../hooks/useHeading";
import { useLocationStore } from "../stores/locationStore";

interface LocationConeProps {
  size?: number;
}

// Google Maps blue color
const GOOGLE_BLUE = "#4285F4";

export function LocationCone({ size = 120 }: LocationConeProps) {
  const location = useLocationStore((state) => state.location);
  const { heading } = useHeading();
  const cone = useMemo(() => {
    const centerX = size / 2;
    const bottomY = size; // Base at bottom center
    const coneLength = size * 0.35; // Much shorter cone
    const coneAngle = 40; // Slightly wider angle to compensate
    const baseRadius = 6; // Smaller radius to match the blue dot center

    // Calculate cone outer points
    const leftAngle = (-90 - coneAngle) * (Math.PI / 180);
    const rightAngle = (-90 + coneAngle) * (Math.PI / 180);

    const leftX = centerX + coneLength * Math.cos(leftAngle);
    const leftY = bottomY + coneLength * Math.sin(leftAngle);
    const rightX = centerX + coneLength * Math.cos(rightAngle);
    const rightY = bottomY + coneLength * Math.sin(rightAngle);

    // Base arc points (rounded base matching the circle)
    const baseLeftX = centerX - baseRadius;
    const baseRightX = centerX + baseRadius;

    // Create cone path with rounded base
    const path = `
      M ${baseLeftX} ${bottomY}
      L ${leftX} ${leftY}
      Q ${centerX} ${bottomY - coneLength * 0.8} ${rightX} ${rightY}
      L ${baseRightX} ${bottomY}
      A ${baseRadius} ${baseRadius} 0 0 1 ${baseLeftX} ${bottomY}
      Z
    `;

    return { path };
  }, [size]);

  if (!location) return null;

  return (
    <Marker
      coordinate={{ latitude: location?.latitude ?? 0, longitude: location?.longitude ?? 0 }}
      anchor={{ x: 0.5, y: 1 }}
      rotation={heading}
      flat
      tracksViewChanges={false}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="coneGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor={GOOGLE_BLUE} stopOpacity={0.4} />
            <Stop offset="40%" stopColor={GOOGLE_BLUE} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={GOOGLE_BLUE} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Path d={cone.path} fill="url(#coneGradient)" />
      </Svg>
    </Marker>
  );
}
