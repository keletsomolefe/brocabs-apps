/**
 * Admin Payments Page
 *
 * Payment and transaction management interface with real API integration.
 */

import type {
  AdminPaymentListResponseDto,
  AdminPaymentResponseDto,
} from "@brocabs/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar, CreditCard, Download, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { adminApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/payments/")({
  component: AdminPaymentsPage,
});

/**
 * Extended payment type for DataTable compatibility
 */
type PaymentData = AdminPaymentResponseDto & { [key: string]: unknown };

/**
 * Format currency in ZAR
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

/**
 * Get transaction type label and color
 */
function getTypeInfo(type?: string): {
  label: string;
  variant: "default" | "primary" | "success" | "warning";
} {
  switch (type) {
    case "PAYMENT":
      return { label: "Payment", variant: "primary" };
    case "DEPOSIT":
      return { label: "Deposit", variant: "success" };
    case "REFUND":
      return { label: "Refund", variant: "warning" };
    case "WITHDRAWAL":
      return { label: "Withdrawal", variant: "default" };
    default:
      return { label: type || "Unknown", variant: "default" };
  }
}

/**
 * Get status badge variant
 */
function getStatusVariant(status?: string): "success" | "warning" | "danger" {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
    case "REFUNDED":
      return "danger";
    default:
      return "warning";
  }
}

function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const paymentsQuery = useQuery<AdminPaymentListResponseDto>({
    queryKey: ["admin", "payments", page, statusFilter, typeFilter],
    queryFn: async () => {
      const response = await adminApi.adminControllerListPayments({
        page: String(page),
        limit: String(limit),
        status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        type: typeFilter !== "all" ? (typeFilter as any) : undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      return response;
    },
  });

  const payments = (paymentsQuery.data?.data ?? []) as PaymentData[];
  const total = paymentsQuery.data?.total ?? 0;

  const columns = [
    {
      key: "reference",
      header: "Reference",
      render: (value: unknown) => (
        <span className="font-mono text-sm">{String(value || "N/A")}</span>
      ),
    },
    {
      key: "userName",
      header: "User",
      render: (value: unknown, row: PaymentData) => (
        <div>
          <p className="font-medium text-neutral-900">
            {String(value || "Unknown")}
          </p>
          <p className="text-xs text-neutral-500">{row.userEmail || "N/A"}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (value: unknown) => {
        const { label, variant } = getTypeInfo(value as string);
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (value: unknown, row: PaymentData) => {
        const isDebit = row.type === "WITHDRAWAL" || row.type === "PAYMENT";
        return (
          <span
            className={`font-medium ${isDebit ? "text-red-600" : "text-green-600"}`}
          >
            {isDebit ? "-" : "+"}
            {formatCurrency(Number(value ?? 0))}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={getStatusVariant(value as string)}>
          {String(value || "PENDING")}
        </Badge>
      ),
    },
    {
      key: "providerReference",
      header: "Provider Ref",
      render: (value: unknown) => (
        <span className="font-mono text-xs text-neutral-500">
          {value ? String(value).slice(0, 12) + "..." : "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (value: unknown) =>
        value
          ? new Date(String(value)).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Payments</h2>
          <p className="text-neutral-500 mt-1">
            Manage transactions and refunds. Total: {total}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => paymentsQuery.refetch()}
            isLoading={paymentsQuery.isFetching}
          >
            Refresh
          </Button>
          <Button variant="outline" leftIcon={Calendar}>
            Date Range
          </Button>
          <Button variant="outline" leftIcon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="select-custom py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="select-custom py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
        >
          <option value="all">All Types</option>
          <option value="PAYMENT">Payment</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="REFUND">Refund</option>
        </select>
      </div>

      {/* Payments Table or Empty State */}
      {payments.length === 0 && !paymentsQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={CreditCard}
            title="No transactions found"
            description={
              statusFilter !== "all" || typeFilter !== "all"
                ? "No transactions match your filter criteria."
                : "No transactions have been recorded yet."
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            data={payments}
            columns={columns}
            keyField="id"
            isLoading={paymentsQuery.isLoading}
            emptyMessage="No transactions match your filters"
            onRowClick={(payment) => {
              console.log("View payment:", payment.id);
            }}
          />

          {/* Pagination */}
          {total > limit && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-neutral-600">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(total / limit)}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
