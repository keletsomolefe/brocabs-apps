import { Bold, Container, Fill, Medium, Row } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { TripPrice } from "@brocabs/ui/trip-price";
import { useActiveRide } from "~/features/trip/hooks/use-ride";
import { RiderCard } from "../widgets/rider-card";

export function DriverWaitingTimeout() {
  const { data: ride } = useActiveRide();
  const rider = ride?.riderProfile;
  return (
    <Container
      borderTopLeftRadius={30}
      borderTopRightRadius={30}
      gap={5}
      backgroundColor="Bg Color">
      <Container backgroundColor="white" px={20} pb={16} borderRadius={20} gap={10}>
        <Bold center color="black" fontSize={32} lineHeight={40}>
          07:20
        </Bold>
        <Medium center color="black" fontSize={14} lineHeight={20}>
          Rider will be paying <Bold color="Primary/600">R 0.50</Bold> for every extra minute on top
          of bill
        </Medium>
        <Row alignItems="center" gap={10}>
          <Fill>
            <Button label="Arrived" variant="primary" size="lg" radius="rounded" />
          </Fill>
          <Fill>
            <Button label="No Show" variant="danger" size="lg" radius="rounded" />
          </Fill>
        </Row>
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
