import { Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { Container, Fill, Pressable } from "@brocabs/ui/layout";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

interface LocationConfirmTopCardProps {
  address?: string;
  loading?: boolean;
  onCancel: () => void;
  type: "pickup" | "destination";
}

export function LocationConfirmTopCard({
  address,
  loading,
  onCancel,
  type,
}: LocationConfirmTopCardProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Container
      position="absolute"
      top={insets.top + 10}
      left={0}
      right={0}
      px={0}
      backgroundColor="transparent"
      gap={10}
      zIndex={1000}>
      <Container
        backgroundColor="white"
        borderRadius={20}
        mx={0}
        p={3}
        gap={15}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <SemiBold fontSize={20} textAlign="center">
          {t("common.setYourLocation")}
        </SemiBold>

        <Container
          backgroundColor="Neutrals/50"
          p={2}
          borderRadius={10}
          flexDirection="row"
          alignItems="center"
          gap={10}>
          <Container
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="Primary/600"
            alignItems="center"
            justifyContent="center">
            <Icon name="mdi-location" width={20} height={20} color={Colors.white} />
          </Container>

          <Fill>
            <Regular fontSize={10} color="Neutrals/500">
              {type === "pickup" ? t("common.choosePickup") : t("common.chooseDestinationLabel")}
            </Regular>
            {loading ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={200} height={14} borderRadius={4} marginTop={6} />
              </SkeletonPlaceholder>
            ) : (
              <Regular fontSize={14} color="Neutrals/800" numberOfLines={1}>
                {address}
              </Regular>
            )}
          </Fill>

          <Pressable onPress={onCancel}>
            <Icon name="cross" width={20} height={20} color={Colors["Neutrals/500"]} />
          </Pressable>
        </Container>
      </Container>
    </Container>
  );
}

interface LocationConfirmSheetContentProps {
  onConfirm: () => void;
  loading?: boolean;
}

export function LocationConfirmSheetContent({
  onConfirm,
  loading,
}: LocationConfirmSheetContentProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Container p={3} pb={insets.bottom + 10} backgroundColor="white">
      <Pressable
        backgroundColor="Primary/600"
        py={3}
        borderRadius={20}
        alignItems="center"
        onPress={onConfirm}
        disabled={loading}
        style={{
          shadowColor: "rgba(181,181,181,0.56)",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 1,
          shadowRadius: 10.9,
          elevation: 5,
          opacity: loading ? 0.5 : 1,
        }}>
        <SemiBold color="white" fontSize={20}>
          {t("common.confirm")}
        </SemiBold>
      </Pressable>
    </Container>
  );
}
