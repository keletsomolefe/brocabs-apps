import { Container } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { TripPrice } from "@brocabs/ui/trip-price";
import { useActiveRide } from "~/features/trip/hooks/use-ride";
import { RiderCard } from "../widgets/rider-card";

export function StartTrip() {
  const { data: ride } = useActiveRide();
  const rider = ride?.riderProfile;

  return (
    <Container
      borderTopLeftRadius={30}
      borderTopRightRadius={30}
      gap={5}
      backgroundColor="Bg Color">
      <Container backgroundColor="white" px={20} pb={16} borderRadius={20}>
        <Button
          label="Start Trip"
          variant="primary"
          size="lg"
          icon="mdi-location"
          iconColor="white"
          radius="rounded"
        />
      </Container>
      <RiderCard
        isActive
        riderName={rider?.fullName}
        riderAvatarUrl={rider?.avatar?.publicUrl ?? undefined}
        phoneNumber={rider?.phoneNumber}
      />
      <TripPrice
        paymentMethod={ride?.paymentMethodCode as any}
        price={ride?.estimatedPrice ?? 0}
        isLast
      />
    </Container>
  );
}
