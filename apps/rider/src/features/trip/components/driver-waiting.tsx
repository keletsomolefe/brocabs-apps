import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Container, Pressable } from "@brocabs/ui/layout";
import { Colors } from "@brocabs/ui/theme/colors";
import { FontFamily } from "@brocabs/ui/theme/fonts";
import { TripPrice } from "@brocabs/ui/trip-price";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";
import { useActiveRide } from "../hooks/use-ride";
import { DriverCard } from "./driver-card";
import { useTranslation } from "~/i18n/LocaleContext";

interface DriverWaitingProps {
  onCancelPress?: () => void;
  isPending?: boolean;
}

export function DriverWaiting({ onCancelPress, isPending }: DriverWaitingProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: ride } = useActiveRide();
  const driver = ride?.driverProfile;

  const [timerState, setTimerState] = useState({
    text: "00:00",
    isOvertime: false,
  });

  useEffect(() => {
    if (!ride?.arrivalTimeoutExpiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiresAt = Number(
        ride.arrivalTimeoutExpiresAtMs ??
          new Date(ride.arrivalTimeoutExpiresAt as string | Date).getTime()
      );
      let diff = expiresAt - now;
      const isOvertime = diff < 0;

      // Handle the initial wait delay (e.g. 5s) where we show the full duration (e.g. 2:00)
      if (!isOvertime && ride.arrivedAt && ride.arrivalTimeoutWaitDelayMs) {
        const arrivedAt = new Date(ride.arrivedAt as string | Date).getTime();
        const delay = ride.arrivalTimeoutWaitDelayMs;
        const totalDuration = expiresAt - arrivedAt;
        const maxCountdown = totalDuration - delay;

        if (diff > maxCountdown) {
          diff = maxCountdown;
        }
      }

      const absDiff = Math.abs(diff);

      const minutes = Math.floor(absDiff / 60000);
      const seconds = Math.floor((absDiff % 60000) / 1000);

      const text = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      setTimerState((prev) => {
        if (prev.text === text && prev.isOvertime === isOvertime) return prev;
        return { text, isOvertime };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [
    ride?.arrivalTimeoutExpiresAt,
    ride?.arrivalTimeoutExpiresAtMs,
    ride?.arrivedAt,
    ride?.arrivalTimeoutWaitDelayMs,
  ]);

  const paymentMethod = ride?.paymentMethodCode;
  const price = ride?.estimatedPrice ?? 0;

  return (
    <Container
      borderTopLeftRadius={30}
      borderTopRightRadius={30}
      gap={5}
      backgroundColor="Bg Color">
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timerState.text}</Text>
        <View style={styles.instructionContainer}>
          {!timerState.isOvertime ? (
            <Text style={styles.instructionText}>
              {t("common.freeMinutesMessage")}
            </Text>
          ) : (
            <Text style={styles.overtimeText}>
              {t("common.overtimeMessage")}
            </Text>
          )}
        </View>
      </View>
      <Container backgroundColor="white" borderRadius={20} p={15}>
        <DriverCard
          driverName={driver?.fullName}
          driverAvatarUrl={driver?.avatar?.publicUrl}
          driverRating={driver?.rating || undefined}
          vehiclePlate={driver?.vehicle?.registrationNumber}
          phoneNumber={driver?.phoneNumber}
          vehicleModel={driver?.vehicle?.model}
          vehicleColor={driver?.vehicle?.colour}
        />
      </Container>

      <TripPrice
        paymentMethod={paymentMethod as unknown as PaymentMethodResponseDtoCodeEnum}
        price={price}
        isLast={!timerState.isOvertime}
      />

      {timerState.isOvertime && (
        <Pressable
          onPress={onCancelPress}
          disabled={isPending}
          style={[styles.cancelButton, { paddingBottom: insets.bottom + 15 }]}>
          {isPending ? (
            <ActivityIndicator color="#E4211E" />
          ) : (
            <View style={styles.cancelContent}>
              <Text style={styles.cancelText}>{t("common.cancelRide")}</Text>
              <Icon name="chevron-right" width={12} height={24} color="#E4211E" />
            </View>
          )}
        </Pressable>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 15,
    paddingTop: 15,
    marginTop: 0,
    // Add shadow if needed to match other cards or just flat
  },
  cancelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#E4211E",
    fontFamily: FontFamily.Medium,
  },
  timerContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },
  timerText: {
    fontFamily: FontFamily.Bold,
    fontSize: 40,
    lineHeight: 40,
    color: Colors["Primary/50"],
    textAlign: "center",
    marginBottom: 0,
  },
  instructionContainer: {
    paddingHorizontal: 10,
    marginTop: 5,
  },
  instructionText: {
    fontFamily: FontFamily.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors["Primary/50"],
    textAlign: "center",
  },
  overtimeText: {
    fontFamily: FontFamily.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors["Primary/50"],
    textAlign: "center",
  },
  overtimeHighlight: {
    fontFamily: FontFamily.Bold,
    color: Colors["Primary/600"],
  },
});
