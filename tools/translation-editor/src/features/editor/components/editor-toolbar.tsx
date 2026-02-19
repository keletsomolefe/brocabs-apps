"use client";

import { SearchBar } from "./search-bar";
import { MissingBadge } from "@/components/common/missing-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TranslationFilter } from "@/lib/types";

interface EditorToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TranslationFilter;
  onFilterChange: (filter: TranslationFilter) => void;
  completionPercent: number;
  translatedKeys: number;
  totalKeys: number;
  missingKeys: number;
  hasChanges: boolean;
  editCount: number;
  saving: boolean;
  onSave: () => void;
  activeSection: string | null;
  sections: string[];
  onSectionChange: (section: string | null) => void;
}

function progressColor(percent: number) {
  if (percent === 100)
    return "[&>[data-slot=progress-indicator]]:bg-success-400";
  if (percent >= 80)
    return "[&>[data-slot=progress-indicator]]:bg-primary-500";
  if (percent >= 50)
    return "[&>[data-slot=progress-indicator]]:bg-warning-400";
  return "[&>[data-slot=progress-indicator]]:bg-secondary-500";
}

export function EditorToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  completionPercent,
  translatedKeys,
  totalKeys,
  missingKeys,
  hasChanges,
  editCount,
  saving,
  onSave,
  activeSection,
  sections,
  onSectionChange,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b bg-card px-4 py-3">
      <SearchBar value={search} onChange={onSearchChange} />

      <Select
        value={filter}
        onValueChange={(v) => onFilterChange(v as TranslationFilter)}
      >
        <SelectTrigger className="w-36 h-9">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="translated">Translated</SelectItem>
          <SelectItem value="untranslated">Untranslated</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={activeSection ?? "__all__"}
        onValueChange={(v) => onSectionChange(v === "__all__" ? null : v)}
      >
        <SelectTrigger className="w-44 h-9">
          <SelectValue placeholder="Section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All sections</SelectItem>
          {sections.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-3">
        <Progress
          value={completionPercent}
          className={cn(
            "h-2 w-32 bg-neutral-200 dark:bg-neutral-800",
            progressColor(completionPercent)
          )}
        />
        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">
          {completionPercent}% ({translatedKeys}/{totalKeys})
        </span>
        {missingKeys > 0 && <MissingBadge count={missingKeys} />}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onSave}
            disabled={!hasChanges || saving}
            size="sm"
            className="relative"
          >
            {saving ? "Saving..." : "Save"}
            {hasChanges && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary-500 text-[10px] text-white">
                {editCount}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <kbd className="font-mono text-xs">&#8984;S</kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
