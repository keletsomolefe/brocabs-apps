"use server";

import fs from "fs";
import type {
  AppName,
  LangCode,
  TranslationData,
  FlatEntry,
  LanguageStats,
  AppStats,
} from "./types";
import { NON_ENGLISH_LANGUAGES } from "./constants";
import { getTranslationFilePath } from "./paths";
import { readTranslation, readRawFile } from "./parser";
import { serializeTranslation } from "./serializer";

/**
 * Count total translatable string keys in a TranslationData object.
 */
function countKeys(data: TranslationData): number {
  let count = 0;
  for (const section of Object.values(data)) {
    for (const value of Object.values(section)) {
      if (typeof value === "string") {
        count++;
      } else if (typeof value === "object" && value !== null) {
        count += Object.keys(value).length;
      }
    }
  }
  return count;
}

/**
 * Count how many English keys have a non-empty translation in the target.
 */
function countTranslated(
  english: TranslationData,
  target: TranslationData,
): number {
  let count = 0;
  for (const [sectionKey, section] of Object.entries(english)) {
    const targetSection = target[sectionKey];
    if (!targetSection) continue;
    for (const [key, value] of Object.entries(section)) {
      if (typeof value === "string") {
        const tv = targetSection[key];
        if (typeof tv === "string" && tv.trim().length > 0) {
          count++;
        }
      } else if (typeof value === "object" && value !== null) {
        const tv = targetSection[key];
        if (typeof tv === "object" && tv !== null) {
          for (const subKey of Object.keys(value)) {
            const subVal = (tv as Record<string, string>)[subKey];
            if (typeof subVal === "string" && subVal.trim().length > 0) {
              count++;
            }
          }
        }
      }
    }
  }
  return count;
}

/**
 * Read translations for a given app and language, returning flat entries
 * with English reference alongside target values.
 */
export async function getTranslationEntries(
  app: AppName,
  lang: LangCode,
): Promise<{ entries: FlatEntry[]; sections: string[] }> {
  const english = readTranslation(app, "en");
  const target = lang === "en" ? english : readTranslation(app, lang);
  const entries: FlatEntry[] = [];
  const sections: string[] = [];

  for (const [sectionKey, section] of Object.entries(english)) {
    sections.push(sectionKey);
    const targetSection = target[sectionKey] ?? {};

    for (const [key, value] of Object.entries(section)) {
      if (typeof value === "string") {
        const targetValue =
          typeof targetSection[key] === "string"
            ? (targetSection[key] as string)
            : "";
        entries.push({
          section: sectionKey,
          key,
          englishValue: value,
          targetValue: lang === "en" ? value : targetValue,
          fullKey: `${sectionKey}.${key}`,
        });
      } else if (typeof value === "object" && value !== null) {
        const targetNested = targetSection[key];
        for (const [subKey, subVal] of Object.entries(value)) {
          const tv =
            typeof targetNested === "object" && targetNested !== null
              ? ((targetNested as Record<string, string>)[subKey] ?? "")
              : "";
          entries.push({
            section: sectionKey,
            key,
            subKey,
            englishValue: subVal,
            targetValue: lang === "en" ? subVal : tv,
            fullKey: `${sectionKey}.${key}.${subKey}`,
          });
        }
      }
    }
  }

  return { entries, sections };
}

/**
 * Save translation data back to disk.
 * `updates` is a record from fullKey (section.key or section.key.subKey) to value.
 */
export async function saveTranslation(
  app: AppName,
  lang: LangCode,
  updates: Record<string, string>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const english = readTranslation(app, "en");
    const englishRaw = readRawFile(app, "en");
    const existing = readTranslation(app, lang);

    // Apply updates to the existing data
    const data: TranslationData = JSON.parse(JSON.stringify(existing));

    for (const [fullKey, value] of Object.entries(updates)) {
      const parts = fullKey.split(".");
      if (parts.length === 2) {
        const [section, key] = parts;
        if (!data[section]) data[section] = {};
        (data[section] as Record<string, string>)[key] = value;
      } else if (parts.length === 3) {
        const [section, key, subKey] = parts;
        if (!data[section]) data[section] = {};
        if (!data[section][key] || typeof data[section][key] !== "object") {
          (data[section] as Record<string, Record<string, string>>)[key] = {};
        }
        (data[section][key] as Record<string, string>)[subKey] = value;
      }
    }

    const output = serializeTranslation(data, english, englishRaw);
    const filePath = getTranslationFilePath(app, lang);
    fs.writeFileSync(filePath, output, "utf-8");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get completion stats for all languages in a given app.
 */
export async function getAppStats(app: AppName): Promise<AppStats> {
  const english = readTranslation(app, "en");
  const totalKeys = countKeys(english);
  const languages: LanguageStats[] = [];

  for (const { code } of NON_ENGLISH_LANGUAGES) {
    const target = readTranslation(app, code);
    const translated = countTranslated(english, target);
    const missing = totalKeys - translated;
    const completionPercent =
      totalKeys > 0 ? Math.round((translated / totalKeys) * 100) : 0;

    languages.push({
      lang: code,
      totalKeys,
      translatedKeys: translated,
      missingKeys: missing,
      completionPercent,
    });
  }

  return { app, languages };
}
