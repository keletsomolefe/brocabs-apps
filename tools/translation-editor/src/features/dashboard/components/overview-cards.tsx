import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AppStats } from "@/lib/types";

function getOverallCompletion(stats: AppStats): number {
  if (stats.languages.length === 0) return 0;
  const totalKeys = stats.languages.reduce((s, l) => s + l.totalKeys, 0);
  const translated = stats.languages.reduce(
    (s, l) => s + l.translatedKeys,
    0
  );
  return totalKeys > 0 ? Math.round((translated / totalKeys) * 100) : 0;
}

function getTotalMissing(stats: AppStats): number {
  return stats.languages.reduce((s, l) => s + l.missingKeys, 0);
}

function getMostNeededLanguage(stats: AppStats): string {
  if (stats.languages.length === 0) return "N/A";
  const worst = stats.languages.reduce((prev, curr) =>
    curr.missingKeys > prev.missingKeys ? curr : prev
  );
  return worst.missingKeys > 0 ? worst.lang.toUpperCase() : "All complete";
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

export function OverviewCards({
  riderStats,
  driverStats,
}: {
  riderStats: AppStats;
  driverStats: AppStats;
}) {
  const cards = [
    {
      label: "Rider App",
      app: "rider",
      keys: riderStats.languages[0]?.totalKeys ?? 0,
      completion: getOverallCompletion(riderStats),
      missing: getTotalMissing(riderStats),
      mostNeeded: getMostNeededLanguage(riderStats),
    },
    {
      label: "Driver App",
      app: "driver",
      keys: driverStats.languages[0]?.totalKeys ?? 0,
      completion: getOverallCompletion(driverStats),
      missing: getTotalMissing(driverStats),
      mostNeeded: getMostNeededLanguage(driverStats),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
      {cards.map((c) => (
        <Card key={c.label} className="@container/card">
          <CardHeader className="pb-2">
            <CardDescription>{c.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {c.completion}% complete
            </CardTitle>
            <Progress
              value={c.completion}
              className={cn(
                "mt-2 h-2 bg-neutral-200 dark:bg-neutral-800",
                progressColor(c.completion)
              )}
            />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.keys} total keys</span>
                {c.missing > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {c.missing} missing
                  </Badge>
                )}
              </div>
              <Link
                href={`/${c.app}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View languages
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              Most needed: {c.mostNeeded}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
