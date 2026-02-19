"use client";

import { useState, useRef, useEffect } from "react";
import type { FlatEntry } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Props {
  entry: FlatEntry;
  isEdited: boolean;
  onEdit: (fullKey: string, value: string) => void;
}

function extractInterpolations(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g);
  return matches ?? [];
}

export function TranslationRow({ entry, isEdited, onEdit }: Props) {
  const [value, setValue] = useState(entry.targetValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMissing = entry.targetValue.trim().length === 0;
  const englishInterpolations = extractInterpolations(entry.englishValue);
  const targetInterpolations = extractInterpolations(value);
  const missingInterpolations = englishInterpolations.filter(
    (v) => !targetInterpolations.includes(v)
  );

  useEffect(() => {
    setValue(entry.targetValue);
  }, [entry.targetValue]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [value]);

  const displayKey = entry.subKey
    ? `${entry.key}.${entry.subKey}`
    : entry.key;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const rows = document.querySelectorAll<HTMLTextAreaElement>(
        "[data-translation-textarea]"
      );
      const currentIndex = Array.from(rows).indexOf(e.currentTarget);
      if (currentIndex >= 0 && currentIndex < rows.length - 1) {
        rows[currentIndex + 1].focus();
      }
    }
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      const rows = document.querySelectorAll<HTMLTextAreaElement>(
        "[data-translation-textarea]"
      );
      const currentIndex = Array.from(rows).indexOf(e.currentTarget);
      if (currentIndex > 0) {
        rows[currentIndex - 1].focus();
      }
    }
  }

  return (
    <TableRow
      className={cn(
        isEdited && "bg-accent hover:bg-accent",
        !isEdited && isMissing && "bg-secondary/10 hover:bg-secondary/20"
      )}
    >
      <TableCell className="w-[200px] align-top pl-4">
        <code className="text-xs text-muted-foreground break-all whitespace-normal">
          {displayKey}
        </code>
      </TableCell>

      <TableCell className="align-top whitespace-normal">
        <p className="text-sm whitespace-pre-wrap">{entry.englishValue}</p>
        {englishInterpolations.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {englishInterpolations.map((v) => (
              <Badge
                key={v}
                variant="secondary"
                className="font-mono text-[10px] px-1.5 py-0"
              >
                {v}
              </Badge>
            ))}
          </div>
        )}
      </TableCell>

      <TableCell className="align-top pr-4 whitespace-normal">
        <textarea
          ref={textareaRef}
          data-translation-textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onEdit(entry.fullKey, e.target.value);
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            "w-full resize-none rounded-md border px-2 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
            isMissing && !value.trim()
              ? "border-secondary-300 bg-secondary/20 focus:border-secondary-500 focus:ring-secondary-200 dark:border-secondary-700 dark:bg-secondary/10"
              : isEdited
                ? "border-primary-300 bg-accent focus:border-primary-500 focus:ring-primary-200 dark:border-primary-700"
                : "border-input bg-transparent focus:border-ring focus:ring-ring/50"
          )}
          placeholder={isMissing ? "Missing translation..." : ""}
        />
        {missingInterpolations.length > 0 && value.trim().length > 0 && (
          <p className="mt-1 text-[10px] text-destructive">
            Missing: {missingInterpolations.join(", ")}
          </p>
        )}
      </TableCell>
    </TableRow>
  );
}
