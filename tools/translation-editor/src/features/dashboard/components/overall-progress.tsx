"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppStats } from "@/lib/types";

function getCompletion(stats: AppStats): number {
  if (stats.languages.length === 0) return 0;
  const totalKeys = stats.languages.reduce((s, l) => s + l.totalKeys, 0);
  const translated = stats.languages.reduce(
    (s, l) => s + l.translatedKeys,
    0
  );
  return totalKeys > 0 ? Math.round((translated / totalKeys) * 100) : 0;
}

function getTotals(stats: AppStats) {
  const totalKeys = stats.languages.reduce((s, l) => s + l.totalKeys, 0);
  const translated = stats.languages.reduce(
    (s, l) => s + l.translatedKeys,
    0
  );
  return { totalKeys, translated };
}

export function OverallProgress({
  riderStats,
  driverStats,
}: {
  riderStats: AppStats;
  driverStats: AppStats;
}) {
  const riderCompletion = getCompletion(riderStats);
  const driverCompletion = getCompletion(driverStats);
  const riderTotals = getTotals(riderStats);
  const driverTotals = getTotals(driverStats);

  const combinedTotal = riderTotals.totalKeys + driverTotals.totalKeys;
  const combinedTranslated =
    riderTotals.translated + driverTotals.translated;
  const overallPercent =
    combinedTotal > 0
      ? Math.round((combinedTranslated / combinedTotal) * 100)
      : 0;

  const data = [
    {
      name: "Driver",
      value: driverCompletion,
      fill: "var(--color-secondary-400)",
    },
    {
      name: "Rider",
      value: riderCompletion,
      fill: "var(--color-primary-500)",
    },
  ];

  return (
    <Card className="px-4 lg:px-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Overall Progress
        </CardTitle>
        <p className="text-3xl font-bold tabular-nums">{overallPercent}%</p>
        <p className="text-xs text-muted-foreground">
          {combinedTranslated.toLocaleString()} of{" "}
          {combinedTotal.toLocaleString()} keys translated
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              data={data}
              startAngle={180}
              endAngle={0}
              barSize={12}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={6}
                background={{ fill: "var(--color-muted)" }}
              />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value: string) => (
                  <span className="text-xs text-foreground">{value}</span>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
