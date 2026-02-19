import { RideTypeResponseDtoCodeEnum, type RideTypeResponseDto } from "@brocabs/client";
import { Button } from "@brocabs/ui/button";
import { Container, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useShadow } from "@brocabs/ui/utils/shadow";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { subscriptionsApi } from "~/api";
import { useRideTypes } from "~/hooks/use-ride-types";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { AssetFiles } from "~/theme/assets";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PARENT_PADDING = 20 * 2; // Parent container padding (px={20})
const PAGE_PADDING = 10 * 2; // PagerView page padding (paddingHorizontal: 10)
const GAP = 16; // Gap between cards
const CARD_WIDTH = (SCREEN_WIDTH - PARENT_PADDING - PAGE_PADDING - GAP) / 2;

const VEHICLE_TYPE_ICONS: Record<RideTypeResponseDtoCodeEnum, any> = {
  [RideTypeResponseDtoCodeEnum.LittleBro]: AssetFiles.images["car-medium-white"],
  [RideTypeResponseDtoCodeEnum.BigBroPlus]: AssetFiles.images["car-big-bro-plus-white"],
  [RideTypeResponseDtoCodeEnum.SuperBro]: AssetFiles.images["car-super-bro-white"],
  [RideTypeResponseDtoCodeEnum.BigBro]: AssetFiles.images["car-big-bro-white"],
  [RideTypeResponseDtoCodeEnum.BroScholar]: AssetFiles.images["car-big-bro-scholar-white"],
  [RideTypeResponseDtoCodeEnum.BroFam]: AssetFiles.images["car-bro-fam-white"],
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 10,
    marginBottom: 10,
    borderWidth: 1, // Ensure border exists to prevent layout/shadow shifts
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: "#5905ff", // Primary/600
  },
  cardInner: {
    alignItems: "center",
    justifyContent: "center",
    height: 95, // Figma img container height ~95px
  },
  cardTextContainer: {
    gap: 4,
    alignItems: "center",
  },
  planCard: {
    backgroundColor: "#EEE", // var(--input-color, #eee)
    borderRadius: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    color: Colors["Primary/50"],
    lineHeight: 39,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 18,
    color: "rgba(0,0,0,0.5)",
    lineHeight: 24,
  },
});

interface VehicleCardProps {
  vehicle: {
    id: number;
    code: RideTypeResponseDtoCodeEnum;
    displayName: string;
    description: string | null;
    seatCount: number;
  };
  isSelected: boolean;
  onPress: () => void;
  cardWidth: number;
}

function VehicleCard({ vehicle, isSelected, onPress, cardWidth }: VehicleCardProps) {
  const shadow = useShadow(2, "penumbra");
  const icon = VEHICLE_TYPE_ICONS[vehicle.code];

  // Format description - extract subtitle from description
  const getSubtitle = () => {
    if (vehicle.code === RideTypeResponseDtoCodeEnum.LittleBro) {
      return "2 seats - micro cab";
    }
    if (vehicle.code === RideTypeResponseDtoCodeEnum.BigBro) {
      return "3 seats - regular";
    }
    if (vehicle.code === RideTypeResponseDtoCodeEnum.BigBroPlus) {
      return "6 seats - family";
    }
    if (vehicle.code === RideTypeResponseDtoCodeEnum.SuperBro) {
      return "Luxury - Premium Comfort";
    }
    if (vehicle.code === RideTypeResponseDtoCodeEnum.BroFam) {
      return "7+ seats - viano, caravelle";
    }
    if (vehicle.code === RideTypeResponseDtoCodeEnum.BroScholar) {
      return "Student Discount";
    }
    return vehicle.description || `${vehicle.seatCount} seats`;
  };
  console.log({ shadow });
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { width: cardWidth }, shadow, isSelected && styles.cardSelected]}>
      <View style={styles.cardInner}>
        {icon && <Image source={icon} contentFit="contain" width={120} height={120} />}
      </View>
      <View style={styles.cardTextContainer}>
        <Bold fontSize={18} color="Primary/50">
          {vehicle.displayName}
        </Bold>
        <Regular fontSize={14} style={{ color: "#949494" }}>
          {getSubtitle()}
        </Regular>
      </View>
    </TouchableOpacity>
  );
}

export function VehicleSelection(props: { onSuccess?: () => void }) {
  const { data: rideTypesResponse } = useRideTypes();
  const rideTypes = useMemo(() => rideTypesResponse?.data || [], [rideTypesResponse]);
  const { t } = useLocale();

  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ["current-subscription"],
    queryFn: async () => {
      return subscriptionsApi.subscriptionControllerGetCurrentSubscription();
    },
    refetchOnMount: true,
  });

  // Refetch when screen comes into focus (handling goBack)
  useFocusEffect(
    useCallback(() => {
      refetchSubscription();
    }, [refetchSubscription])
  );

  const planName = subscription?.plan?.name || t("subscription.choosePlan");

  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const activeVehicles = useMemo(() => rideTypes, [rideTypes]);

  const vehiclesPerPage = 4;
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < activeVehicles.length; i += vehiclesPerPage) {
      result.push(activeVehicles.slice(i, i + vehiclesPerPage));
    }
    return result;
  }, [activeVehicles]);

  const handleContinue = () => {
    if (selectedVehicleId) {
      console.log("Navigating to vehicle-details with ID:", selectedVehicleId);
      router.push({
        pathname: "/(auth)/vehicle-details",
        params: { rideTypeId: selectedVehicleId },
      });
    }
  };

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  };

  if (activeVehicles.length === 0) {
    return (
      <Container gap={24}>
        <Regular fontSize={14} color="Neutrals/600" center>
          {t("subscription.noVehicles")}
        </Regular>
      </Container>
    );
  }

  return (
    <Container gap={24}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/(auth)/driver-plans")}>
        <Container style={styles.planCard}>
          <Row alignItems="center" justifyContent="space-between">
            <Container gap={6}>
              <Bold fontSize={12} style={{ color: "#5905FF" }} lineHeight={16}>
                {planName}
              </Bold>
              <Row alignItems="center" gap={4}>
                <Medium fontSize={14} style={{ color: "#0A021A" }} lineHeight={16}>
                  R {subscription?.plan?.price || "600"}
                </Medium>
                <Regular fontSize={9.214} style={{ color: "#0A021A" }} lineHeight={14.479}>
                  {t("subscription.monthlyFrequency")}
                </Regular>
              </Row>
            </Container>
            <Icon name="chevron-right" width={17} height={17} color={Colors["Primary/400"]} />
          </Row>
        </Container>
      </TouchableOpacity>

      <Container gap={8}>
        <Medium style={styles.title}>{t("subscription.chooseVehicleTypes")}</Medium>
        <Regular style={styles.subtitle}>{t("subscription.vehicleSelectionSubtitle")}</Regular>
      </Container>

      <Container gap={16} style={{ overflow: "visible" }}>
        <PagerView
          ref={pagerRef}
          style={{ height: 470 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
          {pages.map((pageVehicles, pageIndex) => (
            <View
              key={pageIndex}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                justifyContent: "center",
              }}>
              <Row gap={16} flexWrap="wrap">
                {pageVehicles.map((vehicle: RideTypeResponseDto) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isSelected={selectedVehicleId === vehicle.id}
                    onPress={() => setSelectedVehicleId(vehicle.id)}
                    cardWidth={CARD_WIDTH}
                  />
                ))}
              </Row>
            </View>
          ))}
        </PagerView>

        {pages.length > 1 && (
          <Row justifyContent="center" alignItems="center" gap={8}>
            {pages.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePageChange(index)}
                activeOpacity={0.7}>
                <Container
                  width={index === currentPage ? 24 : 8}
                  height={8}
                  borderRadius={4}
                  backgroundColor={index === currentPage ? "Primary/400" : "Neutrals/300"}
                />
              </TouchableOpacity>
            ))}
          </Row>
        )}
      </Container>

      <Button
        variant="primary"
        radius="rounded"
        size="md"
        label={t("subscription.continue")}
        disabled={!selectedVehicleId}
        onPress={handleContinue}
      />
    </Container>
  );
}
