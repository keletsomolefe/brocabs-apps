import LottieView from "lottie-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Bold, Regular } from "../text";

import { Container } from "@brocabs/ui/layout";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

/**
 * Loader dialog component
 *
 * @param title - The title of the dialog
 * @param description - The description of the dialog
 * @returns
 */
export function Loader({ title, description, source }: LoaderProps) {
  return (
    <AnimatedContainer
      mx={20}
      entering={FadeIn.springify().withInitialValues({
        opacity: 0,
        transform: [{ scale: 0.96 }],
      })}
      backgroundColor="white"
      px={20}
      py={30}
      borderRadius={30}
      gap={24}
    >
      <Container alignItems="center" gap={16}>
        {source && (
          <LottieView
            source={source}
            autoPlay
            loop
            style={{ width: 65, height: 65 }}
          />
        )}
        <Bold fontSize={24} center color="Primary/50">
          {title}
        </Bold>
        <Regular fontSize={15} center color="Primary/50">
          {description}
        </Regular>
      </Container>
    </AnimatedContainer>
  );
}

interface LoaderProps {
  title: string;
  description: string;
  source?: any;
}
