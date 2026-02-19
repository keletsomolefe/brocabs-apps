"use client";

import Link from "next/link";
import type { AppStats } from "@/lib/types";
import { getLanguageName, getLanguageNativeName } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function progressColor(percent: number) {
  if (percent === 100)
    return "[&>[data-slot=progress-indicator]]:bg-success-400";
  if (percent >= 80)
    return "[&>[data-slot=progress-indicator]]:bg-primary-500";
  if (percent >= 50)
    return "[&>[data-slot=progress-indicator]]:bg-warning-400";
  return "[&>[data-slot=progress-indicator]]:bg-secondary-500";
}

function LanguageGridCard({ stats }: { stats: AppStats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg capitalize">{stats.app} App</CardTitle>
        <CardDescription>
          {stats.languages[0]?.totalKeys ?? 0} total keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 px-6">
        {stats.languages.map((lang) => (
          <Link
            key={lang.lang}
            href={`/${stats.app}/${lang.lang}`}
            className="flex items-center gap-4 rounded-lg px-3 py-2.5 -mx-3 hover:bg-accent transition-colors"
          >
            <div className="w-32">
              <div className="font-medium text-sm">
                {getLanguageName(lang.lang)}
              </div>
              <div className="text-xs text-muted-foreground">
                {getLanguageNativeName(lang.lang)}
              </div>
            </div>
            <div className="flex-1">
              <Progress
                value={lang.completionPercent}
                className={cn(
                  "h-2 bg-neutral-200 dark:bg-neutral-800",
                  progressColor(lang.completionPercent)
                )}
              />
            </div>
            <div className="text-xs text-muted-foreground w-28 text-right tabular-nums">
              {lang.translatedKeys}/{lang.totalKeys}
            </div>
            {lang.missingKeys > 0 && (
              <Badge variant="destructive" className="text-xs">
                {lang.missingKeys} missing
              </Badge>
            )}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function LanguageGrid({
  riderStats,
  driverStats,
}: {
  riderStats: AppStats;
  driverStats: AppStats;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <LanguageGridCard stats={riderStats} />
      <LanguageGridCard stats={driverStats} />
    </div>
  );
}

export function SingleLanguageGrid({ stats }: { stats: AppStats }) {
  return <LanguageGridCard stats={stats} />;
}
