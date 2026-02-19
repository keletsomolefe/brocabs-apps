import { RideTypeResponseDtoCodeEnum } from "@brocabs/client";
import { AssetFiles } from "@brocabs/ui/theme/assets";

export const RIDE_TYPE_ICONS: Record<RideTypeResponseDtoCodeEnum, any> = {
  [RideTypeResponseDtoCodeEnum.LittleBro]: AssetFiles.images["car-medium-white"],
  [RideTypeResponseDtoCodeEnum.BigBroPlus]: AssetFiles.images["car-big-bro-plus-white"],
  [RideTypeResponseDtoCodeEnum.SuperBro]: AssetFiles.images["car-super-bro-white"],
  [RideTypeResponseDtoCodeEnum.BigBro]: AssetFiles.images["car-big-bro-white"],
  [RideTypeResponseDtoCodeEnum.BroScholar]: AssetFiles.images["car-big-bro-scholar-white"],
  [RideTypeResponseDtoCodeEnum.BroFam]: AssetFiles.images["car-bro-fam-white"],
};
