import { Lottie } from "../animations";
import { AssetFiles } from "./assets";
import { breakpoints } from "./breakpoints";
import { Colors } from "./colors";
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
