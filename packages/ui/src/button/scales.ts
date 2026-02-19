import type { TextStyle, ViewStyle } from "react-native";
import { Colors } from "../theme/colors";
import { FontFamily } from "../theme/fonts";

/**
 * Available button variants
 */
export type ButtonVariant =
  | "white"
  | "transparent"
  | "primary"
  | "outline"
  | "danger"
  | "light";

/**
 * Available button sizes
 */
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Available button border radius styles
 */
export type ButtonRadius = "rounded" | "pill";

/**
 * Border radius values for each style
 */
const radiusStyles: Record<ButtonRadius, number> = {
  rounded: 20,
  pill: 30,
} as const;

/**
 * Available text weight styles
 */
export type TextWeight = "regular" | "normal" | "bold";

/**
 * Font weight values for each style
 */
const textWeightMap: Record<TextWeight, FontFamily> = {
  regular: FontFamily.Regular,
  normal: FontFamily.Medium,
  bold: FontFamily.Bold,
} as const;

/**
 * Theme tokens for styled system
 */
const THEME = {
  button: {
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 30, // Default to pill style
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
  },
} as const;

/**
 * Variant styles using emotion-like object patterns
 */
const variantStyles = {
  container: {
    white: {
      backgroundColor: Colors.white,
      borderColor: Colors.white,
    },
    light: {
      backgroundColor: Colors["Primary/950"],
      borderColor: Colors["Primary/950"],
    },
    transparent: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    primary: {
      backgroundColor: Colors["Primary/400"],
      borderColor: Colors["Primary/400"],
    },
    outline: {
      backgroundColor: Colors.white,
      borderColor: Colors["Primary/400"],
    },
    danger: {
      backgroundColor: Colors["Secondary/600"],
      borderColor: Colors["Secondary/600"],
    },
  } as Record<ButtonVariant, ViewStyle>,
  text: {
    white: { color: Colors.black },
    transparent: { color: Colors.white },
    primary: { color: Colors.white },
    outline: { color: Colors["Primary/400"] },
    danger: { color: Colors.white },
    light: { color: Colors["Primary/600"] },
  } as Record<ButtonVariant, TextStyle>,
};

const sizeStyles = {
  sm: {
    height: 40,
    paddingHorizontal: 16,
  },
  md: {
    height: 52,
    paddingHorizontal: 20,
  },
  lg: {
    height: 60,
    paddingHorizontal: 24,
  },
};

/**
 * Helper to get container styles based on props
 */
export const getButtonContainerStyle = (
  variant: ButtonVariant = "primary",
  radius: ButtonRadius = "pill",
  disabled?: boolean,
  size: ButtonSize = "lg",
): ViewStyle => {
  const baseStyle = variantStyles.container[variant];
  const sizeStyle = sizeStyles[size];

  return {
    ...THEME.button,
    ...baseStyle,
    ...sizeStyle,
    borderRadius: radiusStyles[radius],
    opacity: disabled ? 0.5 : 1,
  };
};

/**
 * Helper to get text styles based on props
 */
export const getButtonTextStyle = (
  variant: ButtonVariant = "primary",
  weight: TextWeight = "bold",
  disabled?: boolean,
  size: ButtonSize = "lg",
): TextStyle => {
  const baseStyle = variantStyles.text[variant];
  const fontSize = size === "sm" ? 14 : 16;
  const lineHeight = size === "sm" ? 18 : 24;

  return {
    ...THEME.text,
    ...baseStyle,
    fontFamily: textWeightMap[weight],
    lineHeight,
    fontSize,
    opacity: disabled ? 0.8 : 1,
  };
};
