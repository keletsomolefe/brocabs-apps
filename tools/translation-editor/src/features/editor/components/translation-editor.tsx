"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AppName, LangCode, FlatEntry, TranslationFilter } from "@/lib/types";
import { saveTranslation } from "@/lib/actions";
import { useTranslationContext } from "../context/translation-context";
import { EditorToolbar } from "./editor-toolbar";
import { SectionGroup } from "./section-group";

interface Props {
  app: AppName;
  lang: LangCode;
  initialEntries: FlatEntry[];
  sections: string[];
}

export function TranslationEditor({
  app,
  lang,
  initialEntries,
  sections,
}: Props) {
  const router = useRouter();
  const ctx = useTranslationContext();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TranslationFilter>("all");
  const [saving, setSaving] = useState(false);

  const activeSection = ctx?.activeSection ?? null;
  const hasChanges = Object.keys(edits).length > 0;

  const entries = useMemo(() => {
    return initialEntries.map((entry) => {
      if (entry.fullKey in edits) {
        return { ...entry, targetValue: edits[entry.fullKey] };
      }
      return entry;
    });
  }, [initialEntries, edits]);

  const totalKeys = entries.length;
  const translatedKeys = entries.filter(
    (e) => e.targetValue.trim().length > 0
  ).length;
  const missingKeys = totalKeys - translatedKeys;
  const completionPercent =
    totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;

  const sectionMissingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of entries) {
      if (entry.targetValue.trim().length === 0) {
        counts[entry.section] = (counts[entry.section] ?? 0) + 1;
      }
    }
    return counts;
  }, [entries]);

  useEffect(() => {
    if (ctx) {
      ctx.setSections(sections);
      ctx.setSectionMissingCounts(sectionMissingCounts);
    }
  }, [sections, sectionMissingCounts, ctx]);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (activeSection) {
      result = result.filter((e) => e.section === activeSection);
    }

    if (filter === "untranslated") {
      result = result.filter((e) => e.targetValue.trim().length === 0);
    } else if (filter === "translated") {
      result = result.filter((e) => e.targetValue.trim().length > 0);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.fullKey.toLowerCase().includes(q) ||
          e.englishValue.toLowerCase().includes(q) ||
          e.targetValue.toLowerCase().includes(q)
      );
    }

    return result;
  }, [entries, search, filter, activeSection]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, FlatEntry[]> = {};
    for (const entry of filteredEntries) {
      if (!groups[entry.section]) groups[entry.section] = [];
      groups[entry.section].push(entry);
    }
    return groups;
  }, [filteredEntries]);

  const handleEdit = useCallback(
    (fullKey: string, value: string) => {
      const original = initialEntries.find((e) => e.fullKey === fullKey);
      if (original && original.targetValue === value) {
        setEdits((prev) => {
          const next = { ...prev };
          delete next[fullKey];
          return next;
        });
      } else {
        setEdits((prev) => ({ ...prev, [fullKey]: value }));
      }
    },
    [initialEntries]
  );

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const result = await saveTranslation(app, lang, edits);
      if (result.success) {
        toast.success("Translations saved successfully");
        setEdits({});
        router.refresh();
      } else {
        toast.error(`Save failed: ${result.error}`);
      }
    } catch {
      toast.error("Failed to save translations");
    } finally {
      setSaving(false);
    }
  }, [app, lang, edits, hasChanges, router]);

  // Cmd+S keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave]);

  // Unsaved changes warning
  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const handleSectionChange = useCallback(
    (section: string | null) => {
      if (ctx) {
        ctx.setActiveSection(section);
      }
    },
    [ctx]
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <EditorToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        completionPercent={completionPercent}
        translatedKeys={translatedKeys}
        totalKeys={totalKeys}
        missingKeys={missingKeys}
        hasChanges={hasChanges}
        editCount={Object.keys(edits).length}
        saving={saving}
        onSave={handleSave}
        activeSection={activeSection}
        sections={sections}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No entries match your filters.
          </div>
        ) : (
          Object.entries(groupedEntries).map(
            ([section, sectionEntries]) => (
              <SectionGroup
                key={section}
                section={section}
                entries={sectionEntries}
                lang={lang}
                edits={edits}
                onEdit={handleEdit}
              />
            )
          )
        )}
      </div>
    </div>
  );
}
