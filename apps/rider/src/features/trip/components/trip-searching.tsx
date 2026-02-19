import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { Pressable } from "@brocabs/ui/layout";
import { Colors } from "@brocabs/ui/theme/colors";
import { Icon, IconName } from "~/shared/ui/icons";

import { Bold, SemiBold } from "@brocabs/ui";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { useRideForm } from "../context/ride-context";
import { useActiveRide, useCancelRide } from "../hooks/use-ride";
import { useLocationStore } from "../stores/locationStore";
import { useTripFlow } from "../stores/tripFlowStore";

export const TripSearching = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: activeRide } = useActiveRide();
  const { mutate: cancelRide, isPending } = useCancelRide();
  const { reset } = useTripFlow();
  const { form } = useRideForm();
  const { address } = useLocationStore();

  const handleCancel = () => {
    if (!activeRide?.id) return;
    cancelRide(
      { id: activeRide.id },
      {
        onSuccess: () => {
          reset();
          form.reset();
          if (address) {
            form.setValue("pickup", {
              latitude: address.latitude,
              longitude: address.longitude,
              address: address.address ?? "",
            });
          }
        },
      }
    );
  };

  const paymentMethod = activeRide?.paymentMethodCode;
  const price = activeRide?.estimatedPrice ?? 0;

  const getPaymentDetails = (): { icon: IconName; label: string } => {
    switch (paymentMethod) {
      case PaymentMethodResponseDtoCodeEnum.Card:
        return { icon: "card", label: t("common.card") };
      case PaymentMethodResponseDtoCodeEnum.Wallet:
        return { icon: "wallet", label: t("common.wallet") };
      case PaymentMethodResponseDtoCodeEnum.Cash:
      default:
        return { icon: "cash-hand-dark", label: t("common.cash") };
    }
  };

  const { icon: paymentIcon, label: paymentLabel } = getPaymentDetails();

  return (
    <View style={styles.container}>
      {/* Finding Nearest Bro Section */}
      <View style={styles.findingCard}>
        <SemiBold color="Primary/50" fontSize={20} lineHeight={28} textAlign="center">
          {t("common.findingNearest")}{" "}
          <Bold color="Primary/600" fontSize={20} lineHeight={28} textAlign="center">
            {t("common.bro")}
          </Bold>
        </SemiBold>
      </View>

      {/* Locations Section */}
      <View style={styles.locationsCard}>
        <View style={styles.locationsContent}>
          {/* Pickup Location */}
          <View style={styles.locationRow}>
            <View style={styles.pickupIconContainer}>
              <Icon name="man" width={20} height={20} color={Colors["Neutrals/400"]} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>{t("common.pickupPoint")}</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {activeRide?.pickup?.address ?? t("common.loading")}
              </Text>
            </View>
          </View>

          {/* Destination Location */}
          <View style={styles.locationRow}>
            <View style={styles.destinationIconContainer}>
              <Icon name="direction" width={20} height={20} color={Colors.white} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>{t("common.chooseDestinationLabel")}</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                {activeRide?.destination?.address ?? t("common.loading")}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceCard}>
        <View style={styles.priceRow}>
          <Icon name={paymentIcon} width={36} height={36} />
          <Text style={styles.priceText}>
            {paymentLabel}: R {Math.round(price)}
          </Text>
        </View>
      </View>

      {/* Cancel Button */}
      <Pressable
        onPress={handleCancel}
        disabled={isPending}
        style={[styles.cancelButton, { paddingBottom: insets.bottom + 15 }]}>
        {isPending ? (
          <ActivityIndicator color={Colors["Secondary/600"]} />
        ) : (
          <View style={styles.cancelContent}>
            <Text style={styles.cancelText}>{t("common.cancelRide")}</Text>
            <Icon name="chevron-right" width={12} height={24} color={Colors["Secondary/600"]} />
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["Neutrals/100"],
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    gap: 5,
  },
  findingCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
  },
  findingText: {
    fontSize: 24,
    lineHeight: 48,
    color: Colors["Primary/50"],
    fontFamily: "BR Hendrix",
    fontWeight: "700",
    textAlign: "center",
  },
  findingBroText: {
    color: Colors["Primary/600"],
  },
  locationsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
  },
  locationsContent: {
    gap: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors["Neutrals/50"],
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  pickupIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 1000,
    backgroundColor: Colors["Neutrals/100"],
    justifyContent: "center",
    alignItems: "center",
  },
  destinationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors["Primary/400"],
    justifyContent: "center",
    alignItems: "center",
  },
  locationTextContainer: {
    flex: 1,
    gap: 2,
  },
  locationLabel: {
    fontSize: 10,
    lineHeight: 16,
    color: Colors["Neutrals/500"],
    fontFamily: "BR Hendrix",
  },
  locationValue: {
    fontSize: 14,
    lineHeight: 16,
    color: Colors["Primary/50"],
    fontFamily: "BR Hendrix",
  },
  priceCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 15,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  priceText: {
    fontSize: 18,
    lineHeight: 24,
    color: Colors["Primary/50"],
    fontFamily: "BR Hendrix",
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    shadowColor: Colors["Neutrals/300"],
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
    color: Colors["Secondary/600"],
    fontFamily: "BR Hendrix",
  },
});
