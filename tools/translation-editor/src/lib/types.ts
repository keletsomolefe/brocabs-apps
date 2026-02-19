export type AppName = "rider" | "driver";

export type LangCode =
  | "en"
  | "zu"
  | "st"
  | "tn"
  | "ve"
  | "ts"
  | "nr"
  | "xh"
  | "af"
  | "nso"
  | "ss";

export type TranslationValue = string | Record<string, string>;

export type TranslationSection = Record<string, TranslationValue>;

export type TranslationData = Record<string, TranslationSection>;

export interface FlatEntry {
  section: string;
  key: string;
  subKey?: string;
  englishValue: string;
  targetValue: string;
  fullKey: string;
}

export interface LanguageStats {
  lang: LangCode;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: number;
  completionPercent: number;
}

export interface AppStats {
  app: AppName;
  languages: LanguageStats[];
}

export type TranslationFilter = "all" | "translated" | "untranslated";
