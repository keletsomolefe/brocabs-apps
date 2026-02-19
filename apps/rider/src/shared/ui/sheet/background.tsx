import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

import { ViewStyle } from "react-native";

import { Container } from "@brocabs/ui/layout";

import { Colors } from "@brocabs/ui/theme/colors";

const CUSTOM_STYLE: ViewStyle = {
  backgroundColor: Colors.black,
  borderRadius: 20,
};

/**
 * Renders the custom bottom sheet background
 *
 * @param props - custom bottom sheet background props
 */
export function BottomSheetBackground(props: BottomSheetBackgroundProps) {
  const { style, ...rest } = props;
  return <Container style={[CUSTOM_STYLE, style]} {...rest} />;
}
