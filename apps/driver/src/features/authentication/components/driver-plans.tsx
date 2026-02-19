import { Container, Row } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useShadow } from "@brocabs/ui/utils/shadow";
import { Lightbulb } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import { Icon } from "~/shared/ui/icons";
import { CongratsModal, LowBalanceModal, RequestSubmittedModal } from "./subscription-modals";

interface VehicleCategory {
  name: string;
  seats?: string;
  highlight?: string;
  description?: string;
}

interface PlanDetailProps {
  planName: string;
  price: string;
  priceInterval?: string;
  vehicleCategories: VehicleCategory[];
  benefits: string[];
  isPopular?: boolean;
  everythingInBasicPlus?: boolean;
  onChoosePlan?: () => void;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  showPrimaryCta?: boolean;
  showSecondaryCta?: boolean;
}

export function PlanDetail({
  planName,
  price,
  priceInterval = "/ monthly",
  vehicleCategories,
  benefits,
  isPopular,
  everythingInBasicPlus,
  onChoosePlan,
  primaryCtaLabel = "Start 15-day Free Plan",
  secondaryCtaLabel = `Start ${planName} Plan`,
  showPrimaryCta = true,
  showSecondaryCta = true,
}: PlanDetailProps) {
  const shadow = useShadow(2, "penumbra");

  const handleChoosePlan = () => {
    if (onChoosePlan) {
      onChoosePlan();
    }
  };

  const showLowBalanceModal = () => {
    ModalBox.show("popup", {
      content: (
        <LowBalanceModal
          onReplaceCard={() => {
            ModalBox.hide();
          }}
        />
      ),
      onBackdropPress: () => ModalBox.hide(),
    });
  };

  const showCongratsModal = () => {
    ModalBox.show("popup", {
      content: (
        <CongratsModal
          planName={planName}
          adminFee="300"
          year={new Date().getFullYear()}
          onSubmit={() => {
            ModalBox.hide();
          }}
        />
      ),
      onBackdropPress: () => ModalBox.hide(),
    });
  };

  const showRequestSubmittedModal = () => {
    ModalBox.show("popup", {
      content: (
        <RequestSubmittedModal
          onClose={() => {
            ModalBox.hide();
          }}
        />
      ),
      onBackdropPress: () => ModalBox.hide(),
    });
  };

  return (
    <Container
      backgroundColor="white"
      borderRadius={20}
      px={22}
      py={20}
      mx={20}
      gap={20}
      style={shadow}>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Container gap={10} flex={1}>
          <Medium fontSize={14} color="Primary/600">
            {planName}
          </Medium>
          <Row alignItems="baseline">
            <SemiBold fontSize={24} color="Primary/50">
              {price}
            </SemiBold>
            <Regular fontSize={14} color="Primary/50">
              {" "}
              {priceInterval}
            </Regular>
          </Row>
        </Container>
        {isPopular && (
          <Container
            borderRadius={8}
            px={10}
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap={3}
            height={28}
            style={styles.popularContainer}>
            <Icon name="star-outline" width={12} height={12} color="#B54708" />
            <Regular fontSize={10} style={styles.popularText}>
              Most Popular
            </Regular>
          </Container>
        )}
      </Row>

      <Container gap={14}>
        {everythingInBasicPlus && (
          <Bold fontSize={12} color="Primary/600">
            Everything in Basic plus:
          </Bold>
        )}

        <Container gap={6}>
          <Regular fontSize={12} color="Neutrals/400" style={{ lineHeight: 22 }}>
            What includes in plan:
          </Regular>
          {vehicleCategories.map((category, index) => (
            <Row key={index} justifyContent="space-between" alignItems="center">
              <Row gap={4} alignItems="center">
                <Regular fontSize={12} color="Primary/50" style={{ lineHeight: 27 }}>
                  •
                </Regular>
                <Regular fontSize={12} color="Primary/50" style={{ lineHeight: 27 }}>
                  {category.name}
                </Regular>
              </Row>
              {category.description ? (
                <SemiBold fontSize={12} color="Primary/50">
                  {category.description}
                </SemiBold>
              ) : category.highlight ? (
                <Bold fontSize={12} color="Primary/600">
                  {category.highlight}
                </Bold>
              ) : category.seats ? (
                <SemiBold fontSize={12} color="Primary/50">
                  {category.seats} seats
                </SemiBold>
              ) : null}
            </Row>
          ))}
        </Container>

        <Container gap={6}>
          <Row gap={10} alignItems="center">
            <Lightbulb size={16} color={Colors["Warning/400"]} />
            <Regular fontSize={12} color="Neutrals/400" style={{ lineHeight: 22 }}>
              Driver Benefits:
            </Regular>
          </Row>
          <Container>
            {benefits.map((benefit, index) => (
              <Row key={index} gap={4} alignItems="flex-start">
                <Regular fontSize={12} color="Primary/50" style={{ lineHeight: 27 }}>
                  •
                </Regular>
                <Regular fontSize={12} color="Primary/50" style={{ lineHeight: 27, flex: 1 }}>
                  {benefit}
                </Regular>
              </Row>
            ))}
          </Container>
        </Container>
      </Container>

      <Container gap={10}>
        {showPrimaryCta && (
          <Pressable onPress={handleChoosePlan}>
            <Container
              backgroundColor="Primary/600"
              borderRadius={20}
              height={45}
              alignItems="center"
              justifyContent="center">
              <SemiBold fontSize={18} style={{ color: "#e7e7ff" }}>
                {primaryCtaLabel}
              </SemiBold>
            </Container>
          </Pressable>
        )}
        {showSecondaryCta && (
          <Pressable onPress={handleChoosePlan}>
            <Container
              style={{ backgroundColor: "#e7e7ff", height: 45 }}
              borderRadius={20}
              px={22}
              py={12}
              alignItems="center"
              justifyContent="center">
              <Medium fontSize={18} color="Primary/600">
                {secondaryCtaLabel}
              </Medium>
            </Container>
          </Pressable>
        )}
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  popularContainer: {
    backgroundColor: "rgba(248, 189, 0, 0.14)",
  },
  popularText: {
    color: "#B54708",
  },
});

export function BasicPlan() {
  return (
    <PlanDetail
      planName="Basic"
      price="R 599"
      priceInterval="/ monthly"
      vehicleCategories={[
        { name: "Little Bro", seats: "02" },
        { name: "Big Bro", seats: "03" },
        { name: "Big Bro +", seats: "06" },
        { name: "Bro SCLR", highlight: "Student Disc." },
      ]}
      benefits={[
        "SOS Button",
        "Security",
        "⁠Heatmaps",
        "Road Side assistance",
        "Legal assistance",
        "Medical assistance.",
        "O% commission and 100% profit.",
      ]}
    />
  );
}

export function StandardPlan() {
  return (
    <PlanDetail
      planName="Standard"
      price="R 699"
      priceInterval="/ monthly"
      isPopular={true}
      everythingInBasicPlus={true}
      vehicleCategories={[
        { name: "Super Bro", description: "Luxury - Premium Comfort" },
        { name: "Bro Fam", description: "7+ seats - viano, caravelle" },
      ]}
      benefits={[
        "Priority visibility in passenger searches",
        "Access to premium ride requests",
        "Increased earnings from high-value trips",
        "Early access to new features and promos",
      ]}
    />
  );
}
