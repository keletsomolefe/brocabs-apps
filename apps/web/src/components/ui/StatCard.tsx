/**
 * StatCard Component
 *
 * Displays a single statistic with icon, value, and optional trend indicator.
 * Used on the dashboard overview page.
 */

import { LucideIcon } from "lucide-react";

interface StatCardProps {
  /** Card title/label */
  title: string;
  /** Main statistic value */
  value: string | number;
  /** Optional icon component */
  icon?: LucideIcon;
  /** Optional trend percentage (positive = up, negative = down) */
  trend?: number;
  /** Optional trend label (e.g., "vs last month") */
  trendLabel?: string;
  /** Optional description text */
  description?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Card variant for different color schemes */
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

/**
 * Variant color mappings for icon backgrounds and text
 */
const variantStyles = {
  default: {
    iconBg: "bg-neutral-100",
    iconColor: "text-neutral-600",
  },
  primary: {
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
  },
  success: {
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  warning: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  danger: {
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
} as const;

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  description,
  isLoading = false,
  variant = "default",
}: StatCardProps) {
  const styles = variantStyles[variant];
  const trendIsPositive = trend !== undefined && trend >= 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="h-4 w-24 bg-neutral-200 rounded" />
            <div className="h-8 w-32 bg-neutral-200 rounded" />
            <div className="h-3 w-20 bg-neutral-200 rounded" />
          </div>
          <div className="h-12 w-12 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {/* Title */}
          <p className="text-sm font-medium text-neutral-500">{title}</p>

          {/* Value */}
          <p className="text-3xl font-bold text-neutral-950 tracking-tight">
            {value}
          </p>

          {/* Trend or Description */}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`inline-flex items-center text-sm font-medium ${
                  trendIsPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trendIsPositive ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-sm text-neutral-400">{trendLabel}</span>
              )}
            </div>
          )}

          {description && !trend && (
            <p className="text-sm text-neutral-400 mt-1">{description}</p>
          )}
        </div>

        {/* Icon */}
        {Icon && (
          <div className={`p-3 rounded-xl ${styles.iconBg}`}>
            <Icon className={`h-6 w-6 ${styles.iconColor}`} />
          </div>
        )}
      </div>
    </div>
  );
}
