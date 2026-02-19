import React, { useEffect, useRef, useState } from "react";
import { Circle } from "react-native-maps";

interface PulsingCirclesProps {
  center: { latitude: number; longitude: number };
  searching?: boolean;
  baseRadius?: number; // Base radius in meters
  maxRadius?: number; // Max radius in meters
  duration?: number;
}

const DEFAULT_BASE_RADIUS = 15; // meters - small starting size
const DEFAULT_MAX_RADIUS = 100; // meters - reasonable search area
const DEFAULT_DURATION = 1500; // ms
const FRAME_RATE = 30; // fps

export const PulsingCircles = ({
  center,
  searching,
  baseRadius = DEFAULT_BASE_RADIUS,
  maxRadius = DEFAULT_MAX_RADIUS,
  duration = DEFAULT_DURATION,
}: PulsingCirclesProps) => {
  const [animatedRadius, setAnimatedRadius] = useState(baseRadius);
  const [animatedOpacity, setAnimatedOpacity] = useState(1);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (searching) {
      startTimeRef.current = Date.now();

      animationRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const cycleTime = elapsed % (duration * 2);

        let progress: number;
        if (cycleTime < duration) {
          // Expanding
          progress = cycleTime / duration;
        } else {
          // Contracting
          progress = 1 - (cycleTime - duration) / duration;
        }

        // Ease in-out
        const easedProgress =
          progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const radius = baseRadius + (maxRadius - baseRadius) * easedProgress;
        const opacity = 1 - 0.4 * easedProgress;

        setAnimatedRadius(radius);
        setAnimatedOpacity(opacity);
      }, 1000 / FRAME_RATE);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      setAnimatedRadius(baseRadius);
      setAnimatedOpacity(1);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [searching, baseRadius, maxRadius, duration]);

  return (
    <>
      {/* Outer animated circle - #6D17FF with 0.3 opacity (ratio: 45) */}
      <Circle
        center={center}
        radius={animatedRadius}
        fillColor={`rgba(109, 23, 255, ${0.3 * animatedOpacity})`}
        strokeWidth={0}
        strokeColor="transparent"
      />
      {/* Middle animated circle - #6D17FF with 0.3 opacity (ratio: 26/45 ≈ 0.578) */}
      <Circle
        center={center}
        radius={animatedRadius * (26 / 45)}
        fillColor={`rgba(109, 23, 255, ${0.3 * animatedOpacity})`}
        strokeWidth={0}
        strokeColor="transparent"
      />
      {/* Inner animated circle - #6D17FF with 0.3 opacity (ratio: 12/45 ≈ 0.267) */}
      <Circle
        center={center}
        radius={animatedRadius * (12 / 45)}
        fillColor={`rgba(109, 23, 255, ${0.3 * animatedOpacity})`}
        strokeWidth={0}
        strokeColor="transparent"
      />
    </>
  );
};
