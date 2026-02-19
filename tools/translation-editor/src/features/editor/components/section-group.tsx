"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { FlatEntry, LangCode } from "@/lib/types";
import { getLanguageName } from "@/lib/constants";
import { TranslationRow } from "./translation-row";

interface SectionGroupProps {
  section: string;
  entries: FlatEntry[];
  lang: LangCode;
  edits: Record<string, string>;
  onEdit: (fullKey: string, value: string) => void;
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

export function SectionGroup({
  section,
  entries,
  lang,
  edits,
  onEdit,
}: SectionGroupProps) {
  const [open, setOpen] = useState(true);
  const translated = entries.filter(
    (e) => e.targetValue.trim().length > 0
  ).length;
  const total = entries.length;
  const missing = total - translated;
  const percent = total > 0 ? Math.round((translated / total) * 100) : 0;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mb-4">
      <Card className="gap-0 py-0 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full text-left hover:bg-accent/50 transition-colors">
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ChevronRight
                  className={cn(
                    "size-4 text-muted-foreground shrink-0 transition-transform",
                    open && "rotate-90"
                  )}
                />
                <span className="uppercase tracking-wider">{section}</span>
                <CardDescription className="text-xs tabular-nums">
                  {translated}/{total} keys
                </CardDescription>
                {missing > 0 && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    {missing} missing
                  </Badge>
                )}
              </CardTitle>
              <CardAction className="flex items-center gap-2.5">
                <Progress
                  value={percent}
                  className={cn(
                    "h-1.5 w-24 bg-neutral-200 dark:bg-neutral-800",
                    progressColor(percent)
                  )}
                />
                <span className="text-xs font-medium text-muted-foreground tabular-nums w-8 text-right">
                  {percent}%
                </span>
              </CardAction>
            </CardHeader>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[200px] pl-4">Key</TableHead>
                  <TableHead>English</TableHead>
                  <TableHead className="pr-4">{getLanguageName(lang)}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TranslationRow
                    key={entry.fullKey}
                    entry={entry}
                    isEdited={entry.fullKey in edits}
                    onEdit={onEdit}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
