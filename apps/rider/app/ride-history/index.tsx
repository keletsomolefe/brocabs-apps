import { RideHistoryItemDto, RidesControllerGetRideHistoryStatusEnum } from "@brocabs/client";
import { Container, Row } from "@brocabs/ui/layout";
import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { format } from "date-fns";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useRideHistory } from "~/hooks/use-ride-history";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

const RideCardSkeleton = () => {
  return (
    <Container
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 14,
      }}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item>
          {/* Header */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={16}>
            <SkeletonPlaceholder.Item width={120} height={14} borderRadius={4} />
            <SkeletonPlaceholder.Item width={80} height={25} borderRadius={20} />
          </SkeletonPlaceholder.Item>

          {/* Route */}
          <SkeletonPlaceholder.Item flexDirection="row" gap={16} marginBottom={16}>
            {/* Timeline */}
            <SkeletonPlaceholder.Item
              width={24}
              alignItems="center"
              paddingTop={12}
              flexDirection="column">
              <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
              <SkeletonPlaceholder.Item
                width={2}
                height={14}
                marginTop={6}
                marginBottom={6}
                borderRadius={1}
              />
              <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item flex={1} gap={18}>
              <SkeletonPlaceholder.Item height={40} borderRadius={10} />
              <SkeletonPlaceholder.Item height={40} borderRadius={10} />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              width={10}
              height={15}
              marginRight={14}
              alignSelf="center"
              borderRadius={2}
            />
          </SkeletonPlaceholder.Item>

          {/* Footer */}
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item width={40} height={12} marginBottom={4} borderRadius={4} />
              <SkeletonPlaceholder.Item width={60} height={14} borderRadius={4} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item width={80} height={22} borderRadius={22} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Container>
  );
};

const FilterSkeleton = () => (
  <Container pt={20}>
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="row" gap={10}>
        <SkeletonPlaceholder.Item flex={1} height={45} borderRadius={20} />
        <SkeletonPlaceholder.Item flex={1} height={45} borderRadius={20} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </Container>
);

const formatRideDate = (date: Date) => {
  return format(date, "MMM d 'at' h:mm a");
};

const formatPrice = (price: number) => {
  return `R ${price.toFixed(2)}`;
};

const RideCard = ({ ride }: { ride: RideHistoryItemDto }) => {
  const { t } = useTranslation();
  const isCancelled = ride.status === "cancelled";
  const isCompleted = ride.status === "completed";
  const hasRating = ride.driverRating != null;
  const isRatingPending = isCompleted && !hasRating;

  return (
    <Pressable
      onPress={() => router.push(`/ride-history/${ride.id}`)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 14,
      })}>
      <Container gap={16}>
        {/* Header: Date and Rating/Status */}
        <Row justifyContent="space-between" alignItems="center" minHeight={25}>
          <Medium fontSize={14} color="Primary/50">
            {formatRideDate(ride.createdAt)}
          </Medium>
          {isRatingPending ? (
            <Container
              backgroundColor="Warning/400"
              px={10}
              height={25}
              justifyContent="center"
              borderRadius={20}
              borderWidth={0.5}
              borderColor="Warning/400">
              <Regular fontSize={14} lineHeight={16} color="Warning/25">
                {t("common.ratingPending")}
              </Regular>
            </Container>
          ) : hasRating ? (
            <Container
              borderColor="Primary/600"
              borderWidth={1}
              px={10}
              height={25}
              borderRadius={20}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              gap={5}>
              <Icon name="star" width={12} height={12} color={Colors["Warning/400"]} />
              <Regular fontSize={12} color="Primary/50">
                {String(ride.driverRating)}
              </Regular>
            </Container>
          ) : null}
        </Row>

        {/* Route */}
        <Row gap={16}>
          {/* Timeline */}
          <Container alignItems="center" width={24} style={styles.startEndContainer}>
            <Icon
              name="mingcube-map-pin-fill"
              width={24}
              height={24}
              color={Colors["Primary/600"]}
            />
            <Container style={styles.horizontalDashContainer}>
              <Icon name="horizontal-dash" height={14} width={2} />
            </Container>
            <Icon name="mdi-location" width={24} height={24} color={Colors["Danger/600"]} />
          </Container>
          <Container flex={1} gap={18}>
            <Container
              borderWidth={1}
              borderColor="Primary/950"
              borderRadius={10}
              justifyContent="center"
              height={40}
              px={12}>
              <Regular fontSize={14} lineHeight={24} color="Neutrals/400" numberOfLines={1}>
                {ride.pickupAddress}
              </Regular>
            </Container>
            <Container
              borderWidth={1}
              borderColor="Primary/950"
              borderRadius={10}
              justifyContent="center"
              px={12}
              height={40}>
              <Regular fontSize={14} lineHeight={24} color="Neutrals/400" numberOfLines={1}>
                {ride.destinationAddress}
              </Regular>
            </Container>
          </Container>

          <Container justifyContent="center" mr={14}>
            <Icon name="next-ltr" width={8.84} height={15.3} color={Colors["Primary/600"]} />
          </Container>
        </Row>

        {/* Footer: Price and Status */}
        <Row justifyContent="space-between" alignItems="center">
          <Container>
            <Regular fontSize={12} color="Neutrals/400">
              {ride.paymentMethodCode ? t("common.paid") : t("common.unpaid")}
            </Regular>
            <Medium fontSize={14} color="Primary/50">
              {formatPrice(
                ride.actualPrice != null ? Number(ride.actualPrice) : ride.estimatedPrice
              )}
            </Medium>
          </Container>
          <Container
            backgroundColor={isCancelled ? "Danger/600" : "Success/400"}
            px={10}
            height={22}
            justifyContent="center"
            borderRadius={22}>
            <Regular fontSize={14} lineHeight={16} color={isCancelled ? "white" : "Primary/50"}>
              {isCancelled ? t("common.cancelled") : t("common.completed")}
            </Regular>
          </Container>
        </Row>
      </Container>
    </Pressable>
  );
};

export default function RideHistoryScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"Completed" | "Cancelled">("Completed");
  const insets = useSafeAreaInsets();

  const status =
    activeTab === "Completed"
      ? RidesControllerGetRideHistoryStatusEnum.Completed
      : RidesControllerGetRideHistoryStatusEnum.Cancelled;

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    useRideHistory(status);

  const rides = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <Container py={16} alignItems="center">
        <ActivityIndicator size="small" color={Colors["Primary/600"]} />
      </Container>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <Container flex={1} alignItems="center" justifyContent="center" py={40}>
<Regular fontSize={14} color="Neutrals/400">
            {t("common.noRidesFound", {
              status: activeTab === "Completed" ? t("common.completed").toLowerCase() : t("common.cancelled").toLowerCase(),
            })}
          </Regular>
      </Container>
    );
  };

  if (isLoading) {
    return (
      <FlatList
        style={{ paddingHorizontal: 20, flex: 1, backgroundColor: Colors["Bg Color"] }}
        ListHeaderComponent={<FilterSkeleton />}
        data={Array.from({ length: 5 })}
        keyExtractor={(_, i) => `skeleton-${i}`}
        renderItem={() => <RideCardSkeleton />}
        contentContainerStyle={{ gap: 16, paddingBottom: 20 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <FlatList
      style={{ paddingHorizontal: 20, flex: 1, backgroundColor: Colors["Bg Color"] }}
      ListHeaderComponent={
        <Row gap={10} pt={16}>
          <TouchableOpacity onPress={() => setActiveTab("Completed")} style={{ flex: 1 }}>
            <Container
              backgroundColor={activeTab === "Completed" ? "Primary/600" : "transparent"}
              borderRadius={20}
              height={45}
              justifyContent="center"
              alignItems="center"
              borderWidth={activeTab === "Completed" ? 0 : 1}
              borderColor="Primary/600">
              <Medium fontSize={14} color={activeTab === "Completed" ? "white" : "Primary/600"}>
                {t("common.completed")}
              </Medium>
            </Container>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("Cancelled")} style={{ flex: 1 }}>
            <Container
              backgroundColor={activeTab === "Cancelled" ? "Primary/600" : "transparent"}
              borderRadius={20}
              height={45}
              justifyContent="center"
              alignItems="center"
              borderWidth={activeTab === "Cancelled" ? 0 : 1}
              borderColor="Primary/600">
              <Medium fontSize={14} color={activeTab === "Cancelled" ? "white" : "Primary/600"}>
                {t("common.cancelled")}
              </Medium>
            </Container>
          </TouchableOpacity>
        </Row>
      }
      data={rides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <RideCard ride={item} />}
      contentContainerStyle={{ gap: 16, paddingBottom: 20 + insets.bottom }}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  horizontalDashContainer: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  startEndContainer: {
    paddingTop: 12,
  },
});
