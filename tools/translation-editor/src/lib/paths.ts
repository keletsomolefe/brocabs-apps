import path from "path";
import type { AppName, LangCode } from "./types";

// Resolve the brocabs root from the translation-editor tool location
const TOOL_DIR = path.resolve(process.cwd());
const BROCABS_ROOT = path.resolve(TOOL_DIR, "../..");

export function getLocalesDir(app: AppName): string {
  return path.join(BROCABS_ROOT, "apps", app, "src", "i18n", "locales");
}

export function getTranslationFilePath(app: AppName, lang: LangCode): string {
  return path.join(getLocalesDir(app), `${lang}.ts`);
}
