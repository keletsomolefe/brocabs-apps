import styled from "@emotion/native";
import { SVGProps } from "react";

import { ViewBaseProps, ViewComposition } from "@brocabs/ui/layout";
import { IconName, icons } from "./index";

export { icons };
export type { IconName };

/**
 * Renders the vector icon component (unstyled)
 * @param props - vector icon props
 */
function IconUnstyled(props: IconProps) {
  const { name, ...rest } = props;
  const SVG = icons[name];

  if (!SVG) {
    console.error(
      `Icon "${name}" not found in icon map. Available icons:`,
      Object.keys(icons),
    );
    return null;
  }

  return <SVG {...rest} />;
}

/**
 * Styled Icon component with Emotion support
 */
export const Icon = styled(IconUnstyled)<ViewBaseProps>(ViewComposition);

/** Type definitions */
export interface IconProps extends Omit<SVGProps<SVGElement>, "name"> {
  name: IconName;
}
