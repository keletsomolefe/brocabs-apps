import { Magnetometer } from "expo-sensors";
import { useEffect, useRef, useState } from "react";

interface UseHeadingReturn {
  heading: number;
  isAvailable: boolean;
}

// Low-pass filter factor (0-1). Lower = smoother but slower response
const SMOOTHING_FACTOR = 0.1;
// Minimum change in degrees to update (reduces micro-jitter)
const MIN_CHANGE_THRESHOLD = 1;

export function useHeading(): UseHeadingReturn {
  const [heading, setHeading] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const smoothedHeading = useRef(0);
  const lastReportedHeading = useRef(0);

  useEffect(() => {
    let subscription: ReturnType<typeof Magnetometer.addListener> | null = null;

    const subscribe = async () => {
      const available = await Magnetometer.isAvailableAsync();
      setIsAvailable(available);

      if (!available) return;

      // Set update interval (100ms for smooth updates)
      Magnetometer.setUpdateInterval(100);

      subscription = Magnetometer.addListener((data) => {
        const { x, y } = data;

        // Calculate compass heading
        // We use atan2(-x, y) to get 0° at North (Y axis) and clockwise rotation
        // North (x=0, y=1) -> atan2(0, 1) = 0°
        // East (x=-1, y=0) -> atan2(1, 0) = 90° (North is to the left/-x)
        // South (x=0, y=-1) -> atan2(0, -1) = 180°
        // West (x=1, y=0) -> atan2(-1, 0) = -90° -> 270° (North is to the right/+x)
        let angle = Math.atan2(-x, y);
        let computedHeading = angle * (180 / Math.PI);
        computedHeading = (computedHeading + 360) % 360;

        // Apply low-pass filter for smoothing
        let diff = computedHeading - smoothedHeading.current;
        // Handle wrap-around (e.g. 359 -> 1)
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        smoothedHeading.current = (smoothedHeading.current + diff * SMOOTHING_FACTOR + 360) % 360;

        // Only update state if change exceeds threshold
        const changeSinceLastReport = Math.abs(
          smoothedHeading.current - lastReportedHeading.current
        );
        const normalizedChange =
          changeSinceLastReport > 180 ? 360 - changeSinceLastReport : changeSinceLastReport;

        if (normalizedChange >= MIN_CHANGE_THRESHOLD) {
          lastReportedHeading.current = smoothedHeading.current;
          setHeading(smoothedHeading.current);
        }
      });
    };

    subscribe();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { heading, isAvailable };
}
