import type { TouchableOpacityProps } from "react-native";
import { ActivityIndicator } from "react-native";
import Animated from "react-native-reanimated";

import type { ViewBaseProps } from "@brocabs/ui/layout";
import { Icon, type IconName } from "../icons/icon";
import { useShadow } from "../utils/shadow";

import LottieView from "lottie-react-native";
import { usePressAnimation } from "../hooks/use-pressanimation";
import { Visible } from "../visible";
import type { ButtonRadius, ButtonVariant, TextWeight } from "./scales";
import { getButtonContainerStyle, getButtonTextStyle } from "./scales";
import { ButtonBase, ButtonText } from "./styles";

const ICON_SIZE = 20;
const Pressable = Animated.createAnimatedComponent(ButtonBase);

export function Button({
  variant = "primary",
  radius = "pill",
  textWeight = "bold",
  size = "lg",
  label,
  loader,
  icon,
  iconColor,
  raised,
  image,
  isLoading,
  disabled = false,
  ...rest
}: ButtonProps) {
  const shadow = useShadow(2, "penumbra");
  const shadowStyle = raised ? shadow : {};
  const containerStyle = getButtonContainerStyle(
    variant,
    radius,
    disabled,
    size,
  );

  // Allow backgroundColor prop to override variant style
  if ((rest as any).backgroundColor || (rest as any).bg) {
    delete containerStyle.backgroundColor;
    delete containerStyle.borderColor;
  }

  const textStyle = getButtonTextStyle(variant, textWeight, disabled, size);
  const resolvedIconColor = iconColor || (textStyle.color as string);
  const { handleOnPressIn, handleOnPressOut, animatedStyle } =
    usePressAnimation({ scale: 0.97 });

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={[containerStyle, shadowStyle, animatedStyle]}
      activeOpacity={0.9}
      onPressIn={disabled ? undefined : handleOnPressIn}
      onPressOut={disabled ? undefined : handleOnPressOut}
    >
      <Visible if={icon && !isLoading}>
        <Icon
          name={icon as IconName}
          color={resolvedIconColor}
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      </Visible>
      <Visible if={label && !isLoading}>
        <ButtonText color={textStyle.color as any} style={textStyle}>
          {label}
        </ButtonText>
      </Visible>
      <Visible if={image && !isLoading}>{image}</Visible>
      <Visible if={isLoading}>
        {loader ? (
          <LottieView
            style={{ width: 20, height: 20 }}
            source={loader}
            loop
            autoPlay
          />
        ) : (
          <ActivityIndicator size="small" color={resolvedIconColor} />
        )}
      </Visible>
    </Pressable>
  );
}

export interface ButtonProps
  extends
    Omit<ViewBaseProps, "style" | "children" | "onBlur" | "onFocus">,
    Omit<TouchableOpacityProps, "style" | "children"> {
  isLoading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  iconColor?: string;
  image?: React.ReactNode;
  label?: string;
  variant?: ButtonVariant;
  radius?: ButtonRadius;
  size?: "sm" | "md" | "lg";
  textWeight?: TextWeight;
  raised?: boolean;
  loader?: any;
}
