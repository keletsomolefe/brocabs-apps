import { breakpoints } from "@brocabs/ui/theme/breakpoints";
import { Colors } from "@brocabs/ui/theme/colors";

import { Lottie } from "@brocabs/ui/animations";
import { AssetFiles } from "./assets";
import { FontFiles } from "./fonts";

export const lightTheme = {
  colors: Colors,
  fonts: FontFiles,
  breakpoints: breakpoints,
  images: AssetFiles.images,
  videos: AssetFiles.videos,
  animations: {
    lottie: Lottie,
  },
};
