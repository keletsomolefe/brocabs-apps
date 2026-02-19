/**
 * Theme Configuration
 *
 * Design system tokens derived from the mobile app's theme.
 * Translated to Tailwind CSS custom properties and utility classes.
 */

/**
 * Brand Colors
 * Matching the Brocabs mobile app color palette
 */
export const Colors = {
  // Primary Purple Palette
  primary: {
    50: "#E7E7FF",
    100: "#D3D4FF",
    200: "#B1B0FF",
    300: "#8781FF",
    400: "#6B50FF",
    500: "#5E29FF",
    600: "#5905FF",
    700: "#5500FF",
    800: "#4701D2",
    900: "#3A0CA3",
    950: "#0A021A",
  },

  // Secondary Red Palette
  secondary: {
    50: "#FFF1F1",
    100: "#FFE1E1",
    200: "#FFC9C8",
    300: "#FFA2A1",
    400: "#FE6D6B",
    500: "#F63431",
    600: "#E4211E",
    700: "#C01815",
    800: "#9F1715",
    900: "#831B19",
    950: "#480807",
  },

  // Neutral Grays
  neutral: {
    50: "#F6F6F6",
    100: "#E7E7E7",
    200: "#D1D1D1",
    300: "#B0B0B0",
    400: "#888888",
    500: "#6D6D6D",
    600: "#5D5D5D",
    700: "#4F4F4F",
    800: "#454545",
    900: "#3D3D3D",
    950: "#07030D",
  },

  // Semantic Colors
  success: {
    300: "#6CE9A6",
    400: "#32D583",
    500: "#319F43",
  },

  warning: {
    25: "#FFFCF5",
    400: "#FDB022",
  },

  danger: {
    600: "#E4211E",
  },

  // Base
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

/**
 * Tailwind CSS Custom Theme Extension
 * Use this in tailwind.config.js
 */
export const tailwindColors = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  neutral: Colors.neutral,
  success: Colors.success,
  warning: Colors.warning,
  danger: Colors.danger,
};

/**
 * Typography Scale
 * Consistent with mobile app typography
 */
export const Typography = {
  fontFamily: {
    sans: [
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(", "),
    mono: [
      "SFMono-Regular",
      "Menlo",
      "Monaco",
      "Consolas",
      '"Liberation Mono"',
      '"Courier New"',
      "monospace",
    ].join(", "),
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
} as const;

/**
 * Spacing Scale (matches Tailwind defaults)
 */
export const Spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
} as const;

/**
 * Border Radius
 */
export const BorderRadius = {
  none: "0",
  sm: "0.125rem",
  default: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.25rem",
  full: "9999px",
} as const;

export type ColorName = keyof typeof Colors;
