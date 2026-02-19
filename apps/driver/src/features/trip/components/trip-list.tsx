import { StatusBar } from "expo-status-bar";

import { Column, Container, Fill, Pressable, Row } from "@brocabs/ui/layout";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";

import { DriverActiveOfferDto } from "@brocabs/client";
import { ActivityIndicator, FlatList, Image, ListRenderItem, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_HEIGHT_WITHOUT_INSETS } from "~/features/trip/layout-constants";
import { useTripFlow } from "~/features/trip/stores/tripFlowStore";
import { TripPhase } from "~/features/trip/trip-phase";
import { useRideRequests } from "~/hooks/use-ride-requests";
import { Icon } from "~/shared/ui/icons";
import { useAcceptRide } from "../hooks/useAcceptRide";
import { useRejectRide } from "../hooks/useRejectRide";
import { DutySwitch } from "./duty-switch";

function TripCardComponent({ trip }: { trip: DriverActiveOfferDto }) {
  const acceptRideMutation = useAcceptRide();
  const rejectRideMutation = useRejectRide();

  return (
    <Container backgroundColor="white" borderRadius={20} padding={16} marginBottom={16}>
      <Row justifyContent="space-between" marginBottom={16}>
        <Row gap={12} alignItems="center" flex={1}>
          <Container
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor="Neutrals/100"
            justifyContent="center"
            alignItems="center"
            overflow="hidden">
            {trip.riderAvatarUrl ? (
              <Image source={{ uri: trip.riderAvatarUrl }} style={{ width: 56, height: 56 }} />
            ) : (
              <Icon name="profile-fill" width={32} height={32} color={Colors["Primary/400"]} />
            )}
          </Container>

          <Column gap={4} flex={1}>
            <Row gap={6} alignItems="center">
              <Medium fontSize={16} color="Primary/50">
                {trip.riderName}
              </Medium>
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
                  {trip.riderRating.toFixed(1)}
                </Regular>
              </Container>
            </Row>
            <Container style={styles.topRatedContainer}>
              <Regular fontSize={12}>Top Rated</Regular>
            </Container>
          </Column>
        </Row>

        <Column alignItems="flex-end" gap={4}>
          <Container
            backgroundColor="Secondary/600"
            borderRadius={12}
            paddingHorizontal={12}
            paddingVertical={6}>
            <Medium fontSize={12} color="white">
              {trip.estimatedTimeMinutes} min
            </Medium>
          </Container>
          <Regular fontSize={12} color="Primary/600">
            {trip.distanceKm?.toFixed(2)} km
          </Regular>
        </Column>
      </Row>

      <Row gap={16} marginBottom={16}>
        <Container alignItems="center" width={24} style={styles.startEndContainer}>
          <Icon name="mingcube-map-pin-fill" width={24} height={24} color={Colors["Primary/600"]} />
          <Container style={styles.horizontalDashContainer}>
            <Icon name="horizontal-dash" height={14} width={2} />
          </Container>
          <Icon name="mdi-location" width={24} height={24} color={Colors["Primary/600"]} />
        </Container>

        <Column flex={1} gap={18}>
          <Container
            borderWidth={1}
            borderColor="Primary/950"
            borderRadius={10}
            justifyContent="center"
            height={40}
            paddingHorizontal={12}>
            <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
              {trip.pickupAddress}
            </Regular>
          </Container>
          <Container
            borderWidth={1}
            borderColor="Primary/950"
            borderRadius={10}
            justifyContent="center"
            paddingHorizontal={12}
            height={40}>
            <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
              {trip.dropoffAddress}
            </Regular>
          </Container>
        </Column>
      </Row>

      <Row gap={12}>
        <Pressable
          flex={1}
          backgroundColor="Primary/600"
          borderRadius={16}
          height={45}
          onPress={() => acceptRideMutation.mutate(trip.rideId)}
          justifyContent="center"
          alignItems="center"
          disabled={acceptRideMutation.isPending || rejectRideMutation.isPending}>
          {acceptRideMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Medium fontSize={16} color="white">
              Accept
            </Medium>
          )}
        </Pressable>
        <Pressable
          flex={1}
          backgroundColor="Secondary/100"
          borderRadius={16}
          height={45}
          borderWidth={1}
          borderColor="Secondary/600"
          onPress={() => rejectRideMutation.mutate(trip.rideId)}
          justifyContent="center"
          alignItems="center"
          disabled={acceptRideMutation.isPending || rejectRideMutation.isPending}>
          {rejectRideMutation.isPending ? (
            <ActivityIndicator color={Colors["Secondary/600"]} />
          ) : (
            <Medium fontSize={16} color="Secondary/600">
              Reject
            </Medium>
          )}
        </Pressable>
      </Row>
    </Container>
  );
}

interface TripListContentProps {
  isFullScreen?: boolean;
  isOnline?: boolean;
  onToggleOnline?: (status: boolean) => void;
}

function TripListContent({
  isFullScreen = false,
  isOnline = true,
  onToggleOnline = () => {},
}: TripListContentProps) {
  const { push: tripPhasePush } = useTripFlow();
  const tripRequests = useRideRequests();

  const renderTripItem: ListRenderItem<DriverActiveOfferDto> = ({
    item,
  }: {
    item: DriverActiveOfferDto;
  }) => <TripCardComponent trip={item} />;

  return (
    <Column flex={1}>
      {/* Fixed Duty Status Header */}
      <Container paddingHorizontal={20} borderBottom={1} borderColor="Input Color">
        <Row marginVertical={15} justifyContent="space-between" height={36} alignItems="center">
          <Medium fontSize={20} color="Primary/50">
            Duty Status
          </Medium>
          <DutySwitch isOnline={isOnline} onToggle={onToggleOnline} />
        </Row>
        <Container height={1} backgroundColor="Input Color" borderRadius={1000} />
      </Container>

      {/* Scrollable Rides List */}
      <FlatList<DriverActiveOfferDto>
        data={tripRequests ?? []}
        keyExtractor={(item) => item.rideId}
        renderItem={renderTripItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Row justifyContent="space-between" alignItems="center" marginTop={15} marginBottom={15}>
            <SemiBold fontSize={20} color="Primary/50">
              New Rides near you
            </SemiBold>
            <Pressable
              onPress={() =>
                tripPhasePush(isFullScreen ? TripPhase.RidesListMap : TripPhase.RidesList)
              }>
              <Row gap={5} alignItems="center">
                {isFullScreen && (
                  <Icon name="map-pin" width={16} height={16} color={Colors["Primary/600"]} />
                )}
                <Bold fontSize={12} color="Primary/600">
                  {isFullScreen ? "Map View" : "View All"}
                </Bold>
              </Row>
            </Pressable>
          </Row>
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <Container alignItems="center" paddingTop={40} px={20}>
            <Column alignItems="center" gap={8}>
              <Medium fontSize={18} color="Primary/50" textAlign="center">
                No ride requests yet
              </Medium>
              <Regular
                fontSize={14}
                color="Neutrals/400"
                textAlign="center"
                lineHeight={22}
                maxWidth={280}>
                You&apos;re all set! Sit back and relax while we find riders nearby. New requests
                will appear here.
              </Regular>
            </Column>
          </Container>
        }
      />
    </Column>
  );
}

interface TripListProps {
  isOnline: boolean;
  onToggleOnline: (status: boolean) => void;
}

export function TripList({ isOnline, onToggleOnline }: TripListProps) {
  const insets = useSafeAreaInsets();

  return (
    <Fill backgroundColor="Bg Color" pt={insets.top + HEADER_HEIGHT_WITHOUT_INSETS}>
      <StatusBar style="dark" />
      <TripListContent isFullScreen={true} isOnline={isOnline} onToggleOnline={onToggleOnline} />
    </Fill>
  );
}

export function TripListBottomSheet({ isOnline, onToggleOnline }: TripListProps) {
  return (
    <Fill backgroundColor="Bg Color">
      <TripListContent isFullScreen={false} isOnline={isOnline} onToggleOnline={onToggleOnline} />
    </Fill>
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
  topRatedContainer: {
    alignSelf: "flex-start",
    backgroundColor: Colors["Warning/400"],
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 25,
    justifyContent: "center",
  },
});
