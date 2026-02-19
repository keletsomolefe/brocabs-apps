import { Container, Row } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";

interface BaseHeaderProps {
  title?: string | React.ReactNode;
  onBack?: () => void;
  connectionBannerVisible?: boolean;
}

export function BaseHeader({ title, onBack, connectionBannerVisible }: BaseHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Container pt={connectionBannerVisible ? 0 : insets.top} backgroundColor="Bg Color">
      <Row alignItems="center" gap={14} px={20} height={48}>
        <TouchableOpacity onPress={onBack || (() => router.back())}>
          <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
        </TouchableOpacity>
        {typeof title === "string" ? (
          <Regular fontSize={18} color="Primary/50">
            {title}
          </Regular>
        ) : (
          title
        )}
      </Row>
    </Container>
  );
}
