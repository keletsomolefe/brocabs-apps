import { Container } from "@brocabs/ui/layout";
import type { ImageSourcePropType } from "react-native";
import { Image, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "../button";
import { Regular, SemiBold } from "../text";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

/**
 * Error dialog component – matches Figma "Transaction Failed" modal.
 *
 * @param title       - The title (e.g. "Transaction Failed")
 * @param description - The description text
 * @param onPress     - CTA callback
 * @param buttonLabel - CTA label (defaults to "Try Again")
 * @param image       - Optional image source for the illustration
 */
export function Error({
  title,
  description,
  onPress,
  buttonLabel = "Try Again",
  image,
}: ErrorProps) {
  return (
    <AnimatedContainer
      mx={20}
      entering={FadeIn.springify().withInitialValues({
        opacity: 0,
        transform: [{ scale: 0.96 }],
      })}
      backgroundColor="Neutrals/50"
      px={20}
      py={16}
      borderRadius={20}
      gap={20}
      alignItems="center"
      style={styles.shadow}
    >
      {image && (
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <Container alignItems="center" gap={2}>
        <SemiBold fontSize={24} lineHeight={32} center color="Primary/50">
          {title}
        </SemiBold>
        <Regular fontSize={14} lineHeight={24} center color="Primary/50">
          {description}
        </Regular>
      </Container>
      <Button
        variant="primary"
        label={buttonLabel}
        onPress={onPress}
        radius="rounded"
        size="lg"
        width="100%"
      />
    </AnimatedContainer>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "rgba(58, 12, 163, 0.14)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 220,
    height: 204,
  },
});

interface ErrorProps {
  title: string;
  description: string;
  onPress: () => void;
  buttonLabel?: string;
  image?: ImageSourcePropType;
}
