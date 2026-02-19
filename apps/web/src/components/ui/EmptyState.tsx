/**
 * EmptyState Component
 *
 * Displays a friendly empty state message with optional icon and action.
 * Used when there's no data to display in tables or lists.
 */

import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  /** Main title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional custom icon - defaults to Inbox */
  icon?: LucideIcon;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Optional className for custom styling */
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="p-4 bg-neutral-100 rounded-full mb-4">
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 text-center max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
