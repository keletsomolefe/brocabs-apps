import { Container, Row } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { Colors } from "@brocabs/ui/theme/colors";
import { FontFamily } from "@brocabs/ui/theme/fonts";
import { TripPrice } from "@brocabs/ui/trip-price";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useActiveRide } from "~/features/trip/hooks/use-ride";
import { useStartRide } from "~/features/trip/hooks/useStartRide";
import { useRiderNoShow } from "~/hooks/use-rider-no-show";
import { useLocale } from "~/i18n/LocaleContext";
import { RiderCard } from "../widgets/rider-card";

export function DriverWaiting({ distance, eta }: { distance?: string; eta?: string }) {
  const { t } = useLocale();
  const { data: ride } = useActiveRide();
  const rider = ride?.riderProfile;
  const { mutate: markNoShow, isPending: isNoShowPending } = useRiderNoShow();
  const { mutate: startRide, isPending: isStartRidePending } = useStartRide();
  const [isRiderArrived, setIsRiderArrived] = useState(false);

  const handleNoShow = () => {
    if (ride?.id) {
      markNoShow(ride.id);
    }
  };

  const handleStartRide = () => {
    if (ride?.id) {
      startRide(ride.id);
    }
  };

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

  return (
    <Container
      borderTopLeftRadius={30}
      borderTopRightRadius={30}
      gap={5}
      backgroundColor="Bg Color">
      {!isRiderArrived ? (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timerState.text}</Text>
          <View style={styles.instructionContainer}>
            {!timerState.isOvertime ? (
              <Text style={styles.instructionText}>{t("trip.customerOnTheWay")}</Text>
            ) : (
              <Text style={styles.overtimeText}>
                {t("trip.riderPayingOvertime")}{" "}
                <Text style={styles.overtimeHighlight}>{t("trip.overtimeRate")}</Text>{" "}
                {t("trip.overtimeDesc")}
              </Text>
            )}
          </View>

          {!timerState.isOvertime ? (
            <Button
              label={t("trip.riderArrived")}
              backgroundColor="Primary/600"
              borderColor="Primary/600"
              variant="primary"
              size="lg"
              radius="rounded"
              onPress={() => setIsRiderArrived(true)}
            />
          ) : (
            <Row gap={10}>
              <View style={styles.flex1}>
                <Button
                  label={t("trip.driverArrived")}
                  backgroundColor="Primary/600"
                  borderColor="Primary/600"
                  variant="primary"
                  size="lg"
                  radius="rounded"
                  onPress={() => setIsRiderArrived(true)}
                />
              </View>
              <View style={styles.flex1}>
                <Button
                  label={t("trip.noShow")}
                  backgroundColor="Secondary/600"
                  borderColor="Secondary/600"
                  variant="primary"
                  size="lg"
                  onPress={handleNoShow}
                  isLoading={isNoShowPending}
                  disabled={isNoShowPending}
                  radius="rounded"
                />
              </View>
            </Row>
          )}
        </View>
      ) : (
        <View style={styles.timerContainer}>
          <Button
            label={t("trip.startRide")}
            backgroundColor="Primary/600"
            borderColor="Primary/600"
            variant="primary"
            size="lg"
            radius="rounded"
            onPress={handleStartRide}
            isLoading={isStartRidePending}
            disabled={isStartRidePending}
          />
        </View>
      )}
      <RiderCard
        isActive
        riderName={rider?.fullName}
        riderAvatarUrl={rider?.avatar?.publicUrl ?? undefined}
        phoneNumber={rider?.phoneNumber}
        distance={distance}
        eta={eta}
      />
      <TripPrice
        paymentMethod={ride?.paymentMethodCode as any}
        price={ride?.estimatedPrice || 0}
        isLast
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: Colors.white,
    padding: 15,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
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
    marginBottom: 15,
    paddingHorizontal: 10,
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
  flex1: {
    flex: 1,
  },
});
