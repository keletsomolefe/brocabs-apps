import styled from "@emotion/native";
import {
  border,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  space,
  system,
  variant,
  type BorderProps,
  type LayoutProps,
  type ShadowProps,
  type SpaceProps,
} from "@techstack/styled-system";
import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from "expo-image";
import { PressableScale as PressableScaleNative } from "pressto";
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  ScrollView as NativeScrollView,
  TouchableOpacity as NativeTouchableOpacity,
  TouchableWithoutFeedback as NativeTouchableWithoutFeedback,
  View,
  type PressableProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView as NativeSafeAreaView } from "react-native-safe-area-context";

import { Colors, type ColorName } from "./theme/colors";
import { getShadow } from "./utils";

export type ViewType = ViewStyle &
  ViewProps &
  SpaceProps &
  LayoutProps &
  ShadowProps &
  BorderProps;

export interface ViewBaseProps extends ViewType {
  h?: number;
  w?: number;
  br?: number;
  bw?: number;
  bc?: string;
  backgroundColor?: ColorName;
}

export const ViewComposition = compose(
  variant({ prop: "backgroundColor", scale: "colors" }),
  system({ h: { property: "height" } }),
  system({ w: { property: "width" } }),
  system({ br: { property: "borderRadius" } }),
  system({ bw: { property: "borderWidth" } }),
  system({ bc: { property: "borderColor" } }),
  position,
  grid,
  color,
  space,
  border,
  flexbox,
  layout,
  shadow,
);

export const Container = styled(View)<ViewBaseProps>(ViewComposition);

export const Fill = styled(Container)`
  flex: 1;
`;

export const CardContainer = styled(Container)`
  background-color: ${Colors["white"]};
  border-radius: 14px;
  padding: 16px;
  gap: 14px;
`;

export const Row = styled(Container)`
  flex-direction: row;
`;

export const Column = styled(Container)`
  flex-direction: column;
`;

export const Card = styled(Container)(getShadow(1, "penumbra"));

export const Image = styled(ExpoImage)<ExpoImageProps & ViewBaseProps>(
  ViewComposition,
);

export const ImageBackground = styled(ExpoImage)<
  ExpoImageProps & ViewBaseProps
>(ViewComposition);

export const SafeAreaView =
  styled(NativeSafeAreaView)<ViewBaseProps>(ViewComposition);

export const TouchableOpacity = styled(NativeTouchableOpacity)<ViewType>(
  ViewComposition,
);

export const TouchableWithoutFeedback = styled(
  NativeTouchableWithoutFeedback,
)<ViewType>(ViewComposition);

export const ScrollView = styled(NativeScrollView)<ViewType>(ViewComposition);

export const KeyboardAvoidingView = styled(
  NativeKeyboardAvoidingView,
)<ViewType>(ViewComposition);

export type PressableType = PressableProps & {
  rounded?: boolean;
} & ViewBaseProps;

export type PressableScaleType = PressableProps & {
  rounded?: boolean;
} & ViewBaseProps;

const rounded = system({
  rounded: { property: "borderRadius", transform: () => 30 },
});

export const FlatList = styled.FlatList<ViewType>(
  color,
  space,
  border,
  layout,
  position,
  flexbox,
);

export const Pressable = styled.Pressable<PressableType>(
  compose(
    variant({ prop: "backgroundColor", scale: "colors" }),
    system({ h: { property: "height" } }),
    system({ w: { property: "width" } }),
    system({ br: { property: "borderRadius" } }),
    system({ bw: { property: "borderWidth" } }),
    system({ bc: { property: "borderColor" } }),
    position,
    grid,
    color,
    space,
    border,
    flexbox,
    layout,
    rounded,
  ),
);

export const PressableScale = styled(PressableScaleNative)<PressableType>(
  compose(
    variant({ prop: "backgroundColor", scale: "colors" }),
    system({ h: { property: "height" } }),
    system({ w: { property: "width" } }),
    system({ br: { property: "borderRadius" } }),
    system({ bw: { property: "borderWidth" } }),
    system({ bc: { property: "borderColor" } }),
  ),
);

export const Circle = styled(Container)<{
  diameter: number;
}>`
  width: ${({ diameter }) => diameter};
  height: ${({ diameter }) => diameter};
  border-radius: ${({ diameter }) => {
    return diameter / 2;
  }};
  align-items: center;
  justify-content: center;
`;

export const Divider = styled(Container)`
  height: 1px;
  background-color: ${Colors["Neutrals/100"]};
`;
