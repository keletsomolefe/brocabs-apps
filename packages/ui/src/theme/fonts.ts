import type { Asset } from "expo-asset";

export enum FontFamily {
  Bold = "BRHendrix-Bold",
  Light = "BRHendrix-Light",
  Medium = "BRHendrix-Medium",
  Regular = "BRHendrix-Regular",
  SemiBold = "BRHendrix-SemiBold",
  Thin = "BRHendrix-Thin",
  Black = "BRHendrix-Black",
}

export type FontSource = string | number | Asset;
export type NameOrMap = string | { [name: string]: FontSource };

export const FontFiles = {
  "BRHendrix-Black": require("../assets/fonts/BRHendrix-Black.otf"),
  "BRHendrix-Bold": require("../assets/fonts/BRHendrix-Bold.otf"),
  "BRHendrix-ExtraLight": require("../assets/fonts/BRHendrix-ExtraLight.otf"),
  "BRHendrix-Light": require("../assets/fonts/BRHendrix-Light.otf"),
  "BRHendrix-Medium": require("../assets/fonts/BRHendrix-Medium.otf"),
  "BRHendrix-Regular": require("../assets/fonts/BRHendrix-Regular.otf"),
  "BRHendrix-SemiBold": require("../assets/fonts/BRHendrix-SemiBold.otf"),
  "BRHendrix-Thin": require("../assets/fonts/BRHendrix-Thin.otf"),
};
