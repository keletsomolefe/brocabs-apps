import type { TranslationData } from "./types";

/**
 * Escape a string value for output inside double quotes in a TS file.
 */
function escapeForDoubleQuotes(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Escape a string value for output inside single quotes in a TS file.
 */
function escapeForSingleQuotes(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Format a string value with the optimal quote style.
 * Uses single quotes if the value contains double quotes (to avoid escaping),
 * otherwise uses double quotes.
 */
function formatStringValue(s: string): string {
  if (s.includes('"') && !s.includes("'")) {
    return `'${escapeForSingleQuotes(s)}'`;
  }
  return `"${escapeForDoubleQuotes(s)}"`;
}

const PRINT_WIDTH = 100;

/**
 * Check if a top-level key-value pair should break onto two lines.
 * Breaks if the English file uses multi-line for this key, or if the
 * inline version would exceed the print width.
 * Only applies the print-width check to top-level keys (indent=4), not nested.
 */
function shouldBreakTopLevel(
  fullKey: string,
  key: string,
  formatted: string,
  multiLineKeys: Set<string>,
): boolean {
  if (multiLineKeys.has(fullKey)) return true;
  // `    ${key}: ${formatted},` = 4 + key.length + 2 + formatted.length + 1
  const lineLength = 4 + key.length + 2 + formatted.length + 1;
  return lineLength > PRINT_WIDTH;
}

/**
 * Check if a nested key-value pair should break onto two lines.
 * Only breaks if the English file explicitly uses multi-line for this key.
 * Does NOT apply print-width because nested values in the codebase
 * are kept inline regardless of length.
 */
function shouldBreakNested(
  fullKey: string,
  multiLineKeys: Set<string>,
): boolean {
  return multiLineKeys.has(fullKey);
}

/**
 * Serialize a TranslationData object back to a .ts file string.
 * Uses the English reference data to determine section order and keys,
 * and the original raw English file to extract section comments and
 * line-break formatting.
 *
 * Only writes keys that have values in `data`. Missing keys are skipped.
 */
export function serializeTranslation(
  data: TranslationData,
  englishData: TranslationData,
  englishRaw: string,
): string {
  const lines: string[] = [];
  lines.push("export default {");

  // Extract section comments and multi-line keys from the English file
  const sectionComments = extractSectionComments(englishRaw);
  const multiLineKeys = extractMultiLineKeys(englishRaw);

  // Use data's own sections in English order, skipping sections not present in data.
  const englishSections = Object.keys(englishData);
  const extraSections = Object.keys(data).filter(
    (s) => !englishSections.includes(s),
  );
  const allSections = [...englishSections, ...extraSections].filter(
    (s) => data[s] && Object.keys(data[s]).length > 0,
  );

  let sectionIndex = 0;
  for (const section of allSections) {
    const sectionData = data[section] ?? {};
    const englishSection = englishData[section] ?? {};

    // All keys: English order first, then extras from target
    // Only include keys that exist in sectionData
    const englishKeys = Object.keys(englishSection);
    const extraKeys = Object.keys(sectionData).filter(
      (k) => !englishKeys.includes(k),
    );
    const allKeys = [...englishKeys, ...extraKeys].filter(
      (k) => sectionData[k] !== undefined && sectionData[k] !== null,
    );

    if (allKeys.length === 0) continue;

    // Add section comment if one exists
    const comment = sectionComments.get(section);
    if (comment) {
      if (sectionIndex > 0) lines.push("");
      lines.push(`  ${comment}`);
    } else if (sectionIndex > 0) {
      lines.push("");
    }

    lines.push(`  ${section}: {`);

    for (const key of allKeys) {
      const value = sectionData[key];

      if (typeof value === "object" && value !== null) {
        // Nested object (e.g. wallet.filters, privacyPolicy.introduction)
        lines.push(`    ${key}: {`);
        const subEnglish =
          typeof englishSection[key] === "object"
            ? (englishSection[key] as Record<string, string>)
            : {};
        const subKeys = Object.keys(subEnglish);
        const extraSubKeys = Object.keys(value).filter(
          (k) => !subKeys.includes(k),
        );
        for (const subKey of [...subKeys, ...extraSubKeys]) {
          const subVal = (value as Record<string, string>)[subKey];
          if (subVal === undefined) continue;
          const formatted = formatStringValue(subVal);
          const nestedFullKey = `${section}.${key}.${subKey}`;
          if (shouldBreakNested(nestedFullKey, multiLineKeys)) {
            lines.push(`      ${subKey}:`);
            lines.push(`        ${formatted},`);
          } else {
            lines.push(`      ${subKey}: ${formatted},`);
          }
        }
        lines.push(`    },`);
      } else if (typeof value === "string") {
        const formatted = formatStringValue(value);
        const fullKey = `${section}.${key}`;
        if (shouldBreakTopLevel(fullKey, key, formatted, multiLineKeys)) {
          lines.push(`    ${key}:`);
          lines.push(`      ${formatted},`);
        } else {
          lines.push(`    ${key}: ${formatted},`);
        }
      }
    }

    lines.push(`  },`);
    sectionIndex++;
  }

  lines.push("} as const;");
  lines.push("");

  return lines.join("\n");
}

/**
 * Extract `// Comment` lines that appear before each section from the raw file.
 * Returns a Map from section name to the comment string (e.g. "// Onboarding").
 */
function extractSectionComments(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  const lineList = raw.split("\n");

  for (let i = 0; i < lineList.length; i++) {
    const trimmed = lineList[i].trim();
    if (trimmed.startsWith("//")) {
      for (let j = i + 1; j < lineList.length && j <= i + 2; j++) {
        const nextTrimmed = lineList[j].trim();
        const match = nextTrimmed.match(/^(\w+)\s*:\s*\{/);
        if (match) {
          map.set(match[1], trimmed);
          break;
        }
      }
    }
  }

  return map;
}

/**
 * Extract the set of keys that use multi-line formatting in the raw file.
 * A multi-line key looks like:
 *     keyName:
 *       "value",
 * Returns a Set of full keys like "section.key" or "section.key.subKey".
 */
function extractMultiLineKeys(raw: string): Set<string> {
  const set = new Set<string>();
  const lineList = raw.split("\n");

  let currentSection = "";
  let currentNestedKey = "";
  const sectionStack: string[] = [];

  for (let i = 0; i < lineList.length; i++) {
    const trimmed = lineList[i].trim();

    const sectionMatch = trimmed.match(/^(\w+)\s*:\s*\{$/);
    if (sectionMatch) {
      if (!currentSection) {
        currentSection = sectionMatch[1];
      } else if (!currentNestedKey) {
        currentNestedKey = sectionMatch[1];
      }
      sectionStack.push(sectionMatch[1]);
      continue;
    }

    if (trimmed === "}," || trimmed === "}") {
      sectionStack.pop();
      if (sectionStack.length === 1) {
        currentNestedKey = "";
      } else if (sectionStack.length === 0) {
        currentSection = "";
        currentNestedKey = "";
      }
      continue;
    }

    const multiLineMatch = trimmed.match(/^(\w+):\s*$/);
    if (multiLineMatch && currentSection) {
      if (i + 1 < lineList.length) {
        const nextTrimmed = lineList[i + 1].trim();
        if (nextTrimmed.startsWith('"') || nextTrimmed.startsWith("'")) {
          const key = multiLineMatch[1];
          if (currentNestedKey) {
            set.add(`${currentSection}.${currentNestedKey}.${key}`);
          } else {
            set.add(`${currentSection}.${key}`);
          }
        }
      }
    }
  }

  return set;
}
