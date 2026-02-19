import styled from "@emotion/native";
import {
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  space,
  system,
  typography,
  variant,
} from "@techstack/styled-system";
import type { PressableProps } from "react-native";

import type { ViewBaseProps } from "@brocabs/ui/layout";
import { NativeTextProps } from "../text";
import { ColorName } from "../theme/colors";
import { FontFamily } from "../theme/fonts";
import type { ButtonSize, ButtonVariant } from "./scales";

type ButtonBaseProps = PressableProps & {
  rounded?: boolean;
  variant?: ButtonVariant;
  type?: ButtonSize;
} & ViewBaseProps;

export interface ButtonTextBaseProps extends NativeTextProps {
  center?: boolean;
  variant?: ButtonVariant;
  type?: ButtonSize;
  color?: ColorName;
}

export const ButtonBase = styled.TouchableOpacity<ButtonBaseProps>`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  ${compose(
    variant({ prop: "backgroundColor", scale: "colors" }),
    variant({ key: "buttons.size", prop: "type" }),
    variant({ key: "buttons.variants" }),
    system({ h: { property: "height" } }),
    system({ w: { property: "width" } }),
    system({ br: { property: "borderRadius" } }),
    system({ bw: { property: "borderWidth" } }),
    system({ bc: { property: "borderColor" } }),
    system({ bg: { property: "backgroundColor" } }),
    position,
    grid,
    color,
    space,
    border,
    flexbox,
    layout,
  )}
`;

export const ButtonText = styled.Text<ButtonTextBaseProps>`
  font-family: ${({ fontFamily }) => fontFamily || FontFamily.Bold};
  text-align: center;
  letter-spacing: -0.4px;
  ${compose(
    variant({ prop: "color", scale: "colors" }),
    variant({ key: "buttons.text" }),
    variant({ key: "buttons.textSize", prop: "type" }),
    color,
    space,
    typography,
    border,
    flexbox,
    layout,
  )}
`;
