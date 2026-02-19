import type { AppName, LangCode } from "./types";

export const APPS: { value: AppName; label: string }[] = [
  { value: "rider", label: "Rider" },
  { value: "driver", label: "Driver" },
];

export const LANGUAGES: { code: LangCode; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho" },
  { code: "tn", name: "Setswana", nativeName: "Setswana" },
  { code: "ve", name: "Venda", nativeName: "Tshivenḓa" },
  { code: "ts", name: "Tsonga", nativeName: "Xitsonga" },
  { code: "nr", name: "Ndebele", nativeName: "isiNdebele" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "nso", name: "Northern Sotho", nativeName: "Sepedi" },
  { code: "ss", name: "Swati", nativeName: "siSwati" },
];

export const NON_ENGLISH_LANGUAGES = LANGUAGES.filter((l) => l.code !== "en");

export function getLanguageName(code: LangCode): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code;
}

export function getLanguageNativeName(code: LangCode): string {
  return LANGUAGES.find((l) => l.code === code)?.nativeName ?? code;
}
