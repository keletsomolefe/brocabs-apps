import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { Icon } from "~/shared/ui/icons";
import { Row } from "@brocabs/ui/layout";

interface WalletHeaderProps {
  title: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
  onBack?: () => void;
}

/**
 * WalletHeader Component
 *
 * Reusable header for wallet screens with:
 * - Back button (left)
 * - Title (center-left)
 * - Optional right action link
 */
export function WalletHeader({ title, rightAction, onBack }: WalletHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.container}>
      <Row alignItems="center" flex={1}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
        </TouchableOpacity>
        <Animated.Text style={styles.title}>{title}</Animated.Text>
      </Row>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Animated.Text style={styles.rightAction}>{rightAction.label}</Animated.Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  backButton: {
    marginRight: 14,
    padding: 4,
  },
  title: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 18,
    lineHeight: 32,
    color: Colors["Primary/50"],
  },
  rightAction: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 14,
    lineHeight: 32,
    color: Colors["Primary/600"],
  },
});
