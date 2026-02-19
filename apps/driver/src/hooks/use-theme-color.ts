/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@brocabs/ui/theme/colors";
import { useColorScheme } from "./use-color-scheme";

export function useThemeColor(props: Record<string, string>, colorName: keyof typeof Colors) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[colorName];
  }
}
