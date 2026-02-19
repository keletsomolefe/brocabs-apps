import styled from "@emotion/native";
import {
  ColorProps,
  SpaceProps,
  TypographyProps,
  border,
  color,
  compose,
  layout,
  space,
  system,
  typography,
  variant,
} from "@techstack/styled-system";
import { Text, TextProps, ViewStyle } from "react-native";

import { ColorName, Colors } from "./theme/colors";
import { FontFamily } from "./theme/fonts";

type ThemeWithColors = {
  colors?: Record<string, string>;
};

function resolveColor(theme: ThemeWithColors | undefined, color?: ColorName) {
  if (!color) return undefined;

  const themeColor = theme?.colors?.[color];
  return themeColor ?? Colors[color] ?? color;
}

export type NativeTextProps = ViewStyle &
  ColorProps &
  TypographyProps &
  TextProps &
  SpaceProps;

export interface TextBaseProps extends NativeTextProps {
  center?: boolean;
  medium?: boolean;
  regular?: boolean;
  bold?: boolean;
  color?: ColorName;
}

export const TextComposition = compose(
  variant({ prop: "color", scale: "colors" }),
  system({ center: { property: "textAlign", transform: () => "center" } }),
  system({
    medium: { property: "fontFamily", transform: () => FontFamily.Medium },
  }),
  system({
    regular: { property: "fontFamily", transform: () => FontFamily.Regular },
  }),
  system({
    bold: { property: "fontFamily", transform: () => FontFamily.Bold },
  }),
  system({
    light: { property: "fontFamily", transform: () => FontFamily.Light },
  }),
  system({
    thin: { property: "fontFamily", transform: () => FontFamily.Thin },
  }),
  system({
    semiBold: { property: "fontFamily", transform: () => FontFamily.SemiBold },
  }),
  color,
  space,
  typography,
  border,
  layout
);

export const Normal = styled(Text)<TextBaseProps>(
  TextComposition,
  ({ theme, color: colorProp }) => ({
    color: resolveColor(theme as ThemeWithColors | undefined, colorProp),
  })
);

export const Medium = styled(Normal)`
  font-family: ${FontFamily.Medium};
`;

export const Thin = styled(Normal)`
  font-family: ${FontFamily.Thin};
`;

export const Regular = styled(Normal)`
  font-family: ${FontFamily.Regular};
`;

export const Bold = styled(Normal)`
  font-family: ${FontFamily.Bold};
`;

export const SemiBold = styled(Normal)`
  font-family: ${FontFamily.SemiBold};
`;

export const Light = styled(Normal)`
  font-family: ${FontFamily.Light};
`;
