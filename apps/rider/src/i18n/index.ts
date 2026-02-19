import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { SupportedLocale, supportedLocales, translations } from "./locales";

// Create i18n instance
const i18n = new I18n(translations);

// Type definitions for type-safe translations
type DotNestedKeys<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotNestedKeys<T[K]>}`;
    }[keyof T & string];

export type TranslationSchema = typeof translations.en;
export type TranslationKey = DotNestedKeys<TranslationSchema>;

export type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Type-safe translation function for use outside of React components
 */
export function translate<K extends TranslationKey>(
  key: K,
  options?: any
): PathValue<TranslationSchema, K> {
  return i18n.t(key, options) as PathValue<TranslationSchema, K>;
}

// Set default and fallback locale
i18n.defaultLocale = "en";
i18n.enableFallback = true;

// Get device locale and set it if supported
const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";
const isSupported = supportedLocales.some((l) => l.code === deviceLocale);
i18n.locale = isSupported ? (deviceLocale as SupportedLocale) : "en";

export { translations } from "./locales";
export { i18n, SupportedLocale, supportedLocales };
