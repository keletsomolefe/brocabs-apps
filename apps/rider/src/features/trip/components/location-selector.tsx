import { Container, Fill, Pressable } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon, IconName } from "~/shared/ui/icons";

/**
 * A component that displays a location selector with a pickup and destination address input trigger.
 * @param props - LocationSelectorProps
 * @returns - LocationSelector
 */
export function LocationSelector({
  pickupAddress,
  destinationAddress,
  onPickupAddressPress,
  onDestinationAddressPress,
  loading,
}: LocationSelectorProps) {
  const { t } = useTranslation();

  if (loading) {
    return <LocationSelectorSkeleton />;
  }

  return (
    <Fill>
      <Container
        gap={15}
        backgroundColor="white"
        p={15}
        borderBottomLeftRadius={20}
        borderBottomRightRadius={20}>
        <Container gap={10}>
          <AddressInputTrigger
            icon="man"
            label={t("common.pickupPoint")}
            placeholder={t("common.whereAreYou")}
            value={pickupAddress}
            onPress={onPickupAddressPress}
          />
          <AddressInputTrigger
            icon="direction"
            label={t("common.chooseDestination")}
            placeholder={t("common.whereToGo")}
            value={destinationAddress}
            onPress={onDestinationAddressPress}
          />
        </Container>
      </Container>
    </Fill>
  );
}

/**
 * A component that displays an address input trigger with an icon, label, and value.
 * @param props - AddressInputTriggerProps
 * @returns - AddressInputTrigger
 */
function AddressInputTrigger(props: AddressInputTriggerProps) {
  const { icon, label, value, placeholder, onPress } = props;
  return (
    <Pressable
      flexDirection="row"
      backgroundColor="Neutrals/50"
      borderRadius={10}
      height={60}
      alignItems="center"
      gap={10}
      style={{ padding: 10 }}
      onPress={onPress}>
      <Container
        width={40}
        height={40}
        backgroundColor="Primary/600"
        borderRadius={20}
        justifyContent="center"
        alignItems="center">
        <Icon name={icon} width={20} height={20} color={Colors.white} />
      </Container>
      <Fill gap={2} justifyContent="center">
        <Regular color="Neutrals/500" fontSize={10} lineHeight={16}>
          {label}
        </Regular>
        <Regular lineHeight={16} fontSize={14} color={value ? "black" : "Neutrals/500"}>
          {value || placeholder}
        </Regular>
      </Fill>
    </Pressable>
  );
}

interface LocationSelectorProps {
  pickupAddress?: string;
  destinationAddress?: string;
  onPickupAddressPress?: () => void;
  onDestinationAddressPress?: () => void;
  loading?: boolean;
}

interface AddressInputTriggerProps {
  icon: IconName;
  label: string;
  value?: string;
  placeholder?: string;
  onPress?: () => void;
}

export function LocationSelectorSkeleton() {
  return (
    <Fill>
      <Container
        gap={15}
        backgroundColor="white"
        p={15}
        borderBottomLeftRadius={20}
        borderBottomRightRadius={20}>
        <Container gap={10}>
          <Container
            backgroundColor="Neutrals/50"
            borderRadius={10}
            height={60}
            justifyContent="center"
            style={{ padding: 10 }}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" gap={10}>
                <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} />
                <SkeletonPlaceholder.Item gap={2}>
                  <SkeletonPlaceholder.Item width={100} height={10} borderRadius={4} />
                  <SkeletonPlaceholder.Item width={200} height={14} borderRadius={4} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </Container>

          <Container
            backgroundColor="Neutrals/50"
            borderRadius={10}
            height={60}
            justifyContent="center"
            style={{ padding: 10 }}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" gap={10}>
                <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} />
                <SkeletonPlaceholder.Item gap={2}>
                  <SkeletonPlaceholder.Item width={120} height={10} borderRadius={4} />
                  <SkeletonPlaceholder.Item width={180} height={14} borderRadius={4} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </Container>
        </Container>
      </Container>
    </Fill>
  );
}
