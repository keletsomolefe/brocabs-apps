import { Images } from "./images";
import { Videos } from "./videos";

export const AssetFiles = {
  images: Images,
  videos: Videos,
};

export const LocalCachedFiles = [...Object.values(AssetFiles.images)].flat();
