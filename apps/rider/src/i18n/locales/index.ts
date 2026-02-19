import af from "./af";
import en from "./en";
import nr from "./nr";
import nso from "./nso";
import ss from "./ss";
import st from "./st";
import tn from "./tn";
import ts from "./ts";
import ve from "./ve";
import xh from "./xh";
import zu from "./zu";

export const translations = {
  en,
  zu,
  st,
  tn,
  ve,
  ts,
  nr,
  xh,
  af,
  nso,
  ss,
} as const;

export type SupportedLocale = keyof typeof translations;

export const supportedLocales: { code: SupportedLocale; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho" },
  { code: "tn", name: "Setswana", nativeName: "Setswana" },
  { code: "ve", name: "Venda", nativeName: "Tshivenḓa" },
  { code: "ts", name: "Tsonga", nativeName: "Xitsonga" },
  { code: "nr", name: "Ndebele", nativeName: "isiNdebele" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "nso", name: "Sepedi", nativeName: "Sepedi" },
  { code: "ss", name: "Swati", nativeName: "SiSwati" },
];
