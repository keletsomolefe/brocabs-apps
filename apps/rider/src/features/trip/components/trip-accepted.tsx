import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Pressable } from "@brocabs/ui/layout";
import { TripPrice } from "@brocabs/ui/trip-price";
import { Icon } from "~/shared/ui/icons";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useActiveRide } from "../hooks/use-ride";
import { DriverCard } from "./driver-card";
import { useTranslation } from "~/i18n/LocaleContext";

interface TripAcceptedProps {
  onCancelPress: () => void;
  isPending?: boolean;
}

export const TripAccepted = ({ onCancelPress, isPending }: TripAcceptedProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: activeRide } = useActiveRide();

  const paymentMethod = activeRide?.paymentMethodCode;
  const price = activeRide?.estimatedPrice ?? 0;

  // Extract driver info from activeRide
  const driver = activeRide?.driverProfile;
  const driverName = driver?.fullName;
  const driverAvatarUrl = driver?.avatar?.publicUrl;
  const driverRating = driver?.rating ?? undefined;
  const vehiclePlate = driver?.vehicle?.registrationNumber;
  const phoneNumber = driver?.phoneNumber;
  const vehicleModel = driver?.vehicle?.model;
  const vehicleColor = driver?.vehicle?.colour;

  return (
    <View style={styles.container}>
      <View style={styles.driverSection}>
        <DriverCard
          driverName={driverName}
          driverAvatarUrl={driverAvatarUrl}
          driverRating={driverRating}
          vehiclePlate={vehiclePlate}
          phoneNumber={phoneNumber}
          vehicleModel={vehicleModel}
          vehicleColor={vehicleColor}
        />
      </View>

      <TripPrice
        paymentMethod={paymentMethod as unknown as PaymentMethodResponseDtoCodeEnum}
        price={price}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    gap: 5,
  },
  driverSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    shadowColor: "#A2A2A2",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.56,
    shadowRadius: 10.9,
    elevation: 5,
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
    fontFamily: "BR Hendrix",
  },
});
