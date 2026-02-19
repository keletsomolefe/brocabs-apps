import { Colors } from "@brocabs/ui/theme/colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface SelectionOptionProps {
  title: string;
  description: string;
  isSelected: boolean;
  onPress: () => void;
  index?: number;
}

/**
 * SelectionOption Component
 *
 * A selectable option card with title and description.
 * Used for card entry method selection (Scan vs Manual).
 */
export function SelectionOption({
  title,
  description,
  isSelected,
  onPress,
  index = 0,
}: SelectionOptionProps) {
  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(200)}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, isSelected && styles.selectedContainer]}
        activeOpacity={0.8}>
        <Animated.Text style={styles.title}>{title}</Animated.Text>
        <Animated.Text style={styles.description}>{description}</Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["white"],
    borderRadius: 10,
    padding: 16,
    gap: 8,
  },
  selectedContainer: {
    borderWidth: 1,
    borderColor: Colors["Primary/300"],
  },
  title: {
    fontFamily: "BRHendrix-SemiBold",
    fontSize: 16,
    lineHeight: 16,
    color: Colors["Primary/50"],
  },
  description: {
    fontFamily: "BRHendrix-Regular",
    fontSize: 14,
    lineHeight: 16,
    color: Colors["Neutrals/400"],
  },
});
