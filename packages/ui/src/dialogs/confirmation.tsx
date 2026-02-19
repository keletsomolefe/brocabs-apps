import Animated, { FadeIn } from "react-native-reanimated";
import { Bold, Regular } from "../text";
import { Colors } from "../theme/colors";

import { Container } from "@brocabs/ui/layout";
import { Button } from "../button";
import { Icon, IconName } from "../icons/icon";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

/**
 * Confirmation dialog component
 *
 * @param title - The title of the dialog
 * @param description - The description of the dialog
 * @param icon - The icon of the dialog
 * @param onPress - The function to call when the button is pressed
 * @returns
 */
export function Confirmation({
  title,
  description,
  icon,
  onPress,
  buttonLabel = "Setup Your Profile",
  iconColor = Colors["Random/Success"],
  iconBackgroundColor = "white",
}: ConfirmationProps) {
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
      gap={20}
    >
      <Container
        width={91}
        height={91}
        backgroundColor={iconBackgroundColor}
        borderRadius={45}
        alignItems="center"
        justifyContent="center"
        alignSelf="center"
      >
        <Icon name={icon} width={91} height={91} color={iconColor} />
      </Container>
      <Container alignItems="center" gap={2}>
        <Bold fontSize={24} center color="Primary/50">
          {title}
        </Bold>
        <Regular fontSize={14} center color="Primary/50">
          {description}
        </Regular>
      </Container>
      <Button
        variant="primary"
        label={buttonLabel}
        onPress={onPress}
        radius="rounded"
      />
    </AnimatedContainer>
  );
}

interface ConfirmationProps {
  title: string;
  description: string;
  icon: IconName;
  onPress: () => void;
  buttonLabel?: string;
  iconColor?: string;
  iconBackgroundColor?: keyof typeof Colors;
}
