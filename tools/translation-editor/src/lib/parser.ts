import fs from "fs";
import type { TranslationData, AppName, LangCode } from "./types";
import { getTranslationFilePath } from "./paths";

/**
 * Parse a TypeScript translation file into a plain JS object.
 * The files are simple `export default { ... } as const;` with string literals,
 * so we strip the wrapper and evaluate with `new Function()`.
 */
export function parseTranslationFile(filePath: string): TranslationData {
  const raw = fs.readFileSync(filePath, "utf-8");

  // Strip `export default` and trailing `as const;` or just `;`
  let objectStr = raw.trim();
  objectStr = objectStr.replace(/^export\s+default\s*/, "");
  // Handle: `} as const;`, `} as const`, `};`, or just `}`
  objectStr = objectStr.replace(/\}\s*(as\s+const)?\s*;?\s*$/, "}");
  objectStr = objectStr.trim();

  // Wrap in return so `new Function` can evaluate it
  const fn = new Function(`return (${objectStr})`);
  return fn() as TranslationData;
}

/**
 * Read and parse a translation file for a given app and language.
 */
export function readTranslation(
  app: AppName,
  lang: LangCode,
): TranslationData {
  const filePath = getTranslationFilePath(app, lang);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  return parseTranslationFile(filePath);
}

/**
 * Read the raw file content (used by the serializer for preserving structure).
 */
export function readRawFile(app: AppName, lang: LangCode): string {
  const filePath = getTranslationFilePath(app, lang);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf-8");
}
