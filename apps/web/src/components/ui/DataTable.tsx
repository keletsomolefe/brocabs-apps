/**
 * DataTable Component
 *
 * A flexible, type-safe data table with sorting, pagination support.
 * Follows the atomic design pattern for reusability.
 */

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";

interface Column<T> {
  /** Unique key for the column, can be a key of T or a custom string */
  key: string;
  /** Display header text */
  header: string;
  /** Optional width (e.g., "200px", "20%") */
  width?: string;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** Alignment */
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  /** Array of data to display */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Unique key field in data */
  keyField: keyof T;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Row click handler */
  onRowClick?: (row: T) => void;
  /** Optional className for the table container */
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

/**
 * Loading skeleton row
 */
function SkeletonRow({ columns }: { columns: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-neutral-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function DataTable<T extends { [key: string]: unknown }>({
  data,
  columns,
  keyField,
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
  className = "",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  /**
   * Handle column header click for sorting
   */
  const handleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortKey(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  /**
   * Sort data based on current sort state
   */
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  /**
   * Get alignment class
   */
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-sm font-semibold text-neutral-700 ${getAlignClass(column.align)} ${
                    column.sortable
                      ? "cursor-pointer hover:bg-neutral-100 select-none"
                      : ""
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key, column.sortable)}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      column.align === "right"
                        ? "justify-end"
                        : column.align === "center"
                          ? "justify-center"
                          : ""
                    }`}
                  >
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-primary-600">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : sortDirection === "desc" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={columns.length} />
              ))
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((row, rowIndex) => (
                <tr
                  key={String(row[keyField])}
                  className={`hover:bg-neutral-50 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => {
                    const value = row[column.key];
                    const content = column.render
                      ? column.render(value, row, rowIndex)
                      : String(value ?? "—");

                    return (
                      <td
                        key={column.key}
                        className={`px-6 py-4 text-sm text-neutral-700 ${getAlignClass(column.align)}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
