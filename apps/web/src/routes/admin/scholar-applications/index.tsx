import {
  BroScholarApplication,
  ReviewBroScholarApplicationDtoStatusEnum,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Eye,
  FileText,
  GraduationCap,
  IdCard,
  Search,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { broScholarApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/scholar-applications/")({
  component: ScholarApplicationsPage,
  // Added comment to force HMR update
});

type ApplicationData = BroScholarApplication & { [key: string]: unknown };

function ScholarApplicationsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ReviewBroScholarApplicationDtoStatusEnum | "ALL"
  >(ReviewBroScholarApplicationDtoStatusEnum.Pending);
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);

  const appsQuery = useQuery({
    queryKey: ["admin", "scholar-applications", statusFilter],
    queryFn: async () => {
      const status = statusFilter === "ALL" ? undefined : statusFilter;
      const response = await broScholarApi.broScholarControllerGetApplications({
        status: status as any,
      });
      return response;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (params: {
      id: string;
      status: ReviewBroScholarApplicationDtoStatusEnum;
      reason?: string;
    }) =>
      broScholarApi.broScholarControllerReviewApplication({
        id: params.id,
        reviewBroScholarApplicationDto: {
          status: params.status,
          rejectionReason: params.reason,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "scholar-applications"],
      });
      setSelectedApp(null);
    },
  });

  const applications = (appsQuery.data ?? []) as ApplicationData[];

  const filteredApps = applications.filter(
    (app) =>
      !searchQuery ||
      app.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns = [
    {
      key: "studentName",
      header: "Student",
      sortable: true,
      render: (value: unknown, row: ApplicationData) => (
        <div>
          <p className="font-medium text-neutral-900">
            {String(value || "N/A")}
          </p>
          <p className="text-xs text-neutral-500">ID: {row.id.slice(0, 8)}</p>
        </div>
      ),
    },
    {
      key: "institution",
      header: "Institution",
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-700">
            {String(value || "N/A")}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value: unknown) => {
        const status = String(value);
        let variant:
          | "success"
          | "warning"
          | "danger"
          | "default"
          | "primary"
          | "info" = "default";

        if (status === "APPROVED") variant = "success";
        if (status === "PENDING") variant = "warning";
        if (status === "REJECTED") variant = "danger";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: unknown, row: ApplicationData) => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={Eye}
          onClick={() => setSelectedApp(row)}
        >
          Review
        </Button>
      ),
    },
  ];

  if (appsQuery.isLoading) {
    return (
      <div className="p-8 text-center text-neutral-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Scholar Applications
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage student verification requests
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full sm:w-64 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500 font-medium">
              Status:
            </span>
            <select
              title="Filter applications by status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | ReviewBroScholarApplicationDtoStatusEnum
                    | "ALL",
                )
              }
              className="h-10 px-3 rounded-lg border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="ALL">All Applications</option>
              <option value={ReviewBroScholarApplicationDtoStatusEnum.Pending}>
                Pending
              </option>
              <option value={ReviewBroScholarApplicationDtoStatusEnum.Approved}>
                Approved
              </option>
              <option value={ReviewBroScholarApplicationDtoStatusEnum.Rejected}>
                Rejected
              </option>
            </select>
          </div>
        </div>

        {filteredApps.length > 0 ? (
          <DataTable data={filteredApps} columns={columns} keyField="id" />
        ) : (
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="There are no scholar applications to review at this time."
          />
        )}
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Review Application
                </h2>
                <p className="text-sm text-neutral-500">ID: {selectedApp.id}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Close review"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Applicant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">
                    Student Name
                  </h3>
                  <p className="font-semibold text-neutral-900 text-lg flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-400" />
                    {selectedApp.studentName}
                  </p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">
                    Institution
                  </h3>
                  <p className="font-semibold text-neutral-900 text-lg flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-neutral-400" />
                    {selectedApp.institution}
                  </p>
                </div>
              </div>

              {/* Documents Grid */}
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-primary-600" />
                Submitted Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DocumentCard
                  title="Student Face"
                  url={selectedApp.studentFaceImageFile as string}
                />
                <DocumentCard
                  title="Student Card"
                  url={selectedApp.studentCardFile as string}
                />
                <DocumentCard
                  title="Selfie w/ Card"
                  url={selectedApp.selfieWithStudentCardFile as string}
                />
              </div>

              {/* Status Banner */}
              {selectedApp.status !== "PENDING" && (
                <div
                  className={`mt-8 p-4 rounded-lg flex items-center gap-3 ${
                    selectedApp.status === "APPROVED"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {selectedApp.status === "APPROVED" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  <div>
                    <p className="font-bold">
                      Application {selectedApp.status}
                    </p>
                    {selectedApp.rejectionReason && (
                      <p className="text-sm mt-1 opacity-90">
                        Reason: {selectedApp.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {selectedApp.status === "PENDING" && (
              <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-3 rounded-b-xl">
                <Button variant="outline" onClick={() => setSelectedApp(null)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  leftIcon={X}
                  onClick={() => {
                    const reason = prompt("Reason for rejection:");
                    if (reason) {
                      reviewMutation.mutate({
                        id: selectedApp.id,
                        status:
                          ReviewBroScholarApplicationDtoStatusEnum.Rejected,
                        reason,
                      });
                    }
                  }}
                >
                  Reject Application
                </Button>
                <Button
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  leftIcon={Check}
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to approve this application?",
                      )
                    ) {
                      reviewMutation.mutate({
                        id: selectedApp.id,
                        status:
                          ReviewBroScholarApplicationDtoStatusEnum.Approved,
                      });
                    }
                  }}
                >
                  Approve Application
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentCard({ title, url }: { title: string; url?: string }) {
  if (!url) {
    return (
      <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50">
        <FileText className="w-8 h-8 mb-2" />
        <span className="text-xs font-medium">{title} Not Found</span>
      </div>
    );
  }

  return (
    <div className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm transition-all hover:shadow-md">
      <img src={url} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <p className="text-white font-medium text-sm">{title}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-white/80 hover:text-white hover:underline flex items-center gap-1"
        >
          <Eye className="w-3 h-3" /> View Full
        </a>
      </div>
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
        {title}
      </div>
    </div>
  );
}
