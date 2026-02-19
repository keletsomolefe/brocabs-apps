/**
 * Admin Content Management Page
 *
 * CMS interface for managing FAQ, Privacy Policy, Terms & Conditions,
 * and Contact Support content displayed in mobile apps.
 */

import type {
  ContentListResponseDto,
  ContentResponseDto,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Edit2,
  FileText,
  HelpCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Scale,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, DataTable, EmptyState } from "../../../components/ui";
import { contentApi } from "../../../lib/api";

export const Route = createFileRoute("/admin/content/")({
  component: AdminContentPage,
});

/**
 * Content type configuration
 */
const contentTypes = [
  {
    value: "faq",
    label: "FAQs",
    icon: HelpCircle,
    color: "bg-blue-500",
  },
  {
    value: "privacy_policy",
    label: "Privacy Policy",
    icon: Shield,
    color: "bg-green-500",
  },
  {
    value: "terms_and_conditions",
    label: "Terms & Conditions",
    icon: Scale,
    color: "bg-purple-500",
  },
  {
    value: "contact_support",
    label: "Contact Support",
    icon: MessageSquare,
    color: "bg-orange-500",
  },
] as const;

const targetTypes = [
  { value: "all", label: "All Users", color: "bg-neutral-500" },
  { value: "rider", label: "Rider", color: "bg-teal-500" },
  { value: "driver", label: "Driver", color: "bg-amber-500" },
] as const;

type ContentType = (typeof contentTypes)[number]["value"];
type ContentTarget = (typeof targetTypes)[number]["value"];

/**
 * Extended content type for DataTable compatibility
 */
type ContentData = ContentResponseDto & { [key: string]: unknown };

function AdminContentPage() {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<ContentType | "all">("all");
  const [selectedTarget, setSelectedTarget] = useState<
    ContentTarget | "all_filter"
  >("all_filter");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] =
    useState<ContentResponseDto | null>(null);

  // Fetch content list
  const contentQuery = useQuery<ContentListResponseDto>({
    queryKey: ["admin", "content", selectedType, selectedTarget],
    queryFn: async () => {
      const type =
        selectedType === "all"
          ? undefined
          : (selectedType as
              | "privacy_policy"
              | "terms_and_conditions"
              | "faq"
              | "contact_support");
      const target =
        selectedTarget === "all_filter"
          ? undefined
          : (selectedTarget as "driver" | "rider" | "all");
      return contentApi.contentControllerListContent({ type, target });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      contentApi.contentControllerDeleteContent({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });

  const content = (contentQuery.data?.data ?? []) as ContentData[];

  const getTypeConfig = (type: string) =>
    contentTypes.find((t) => t.value === type) || contentTypes[0];

  const getTargetConfig = (target: string) =>
    targetTypes.find((t) => t.value === target) || targetTypes[0];

  const columns = [
    {
      key: "type",
      header: "Type",
      render: (value: unknown) => {
        const config = getTypeConfig(String(value));
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${config.color}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">{config.label}</span>
          </div>
        );
      },
    },
    {
      key: "target",
      header: "Target",
      render: (value: unknown) => {
        const config = getTargetConfig(String(value));
        return (
          <Badge variant="default" className={config.color + " text-white"}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "title",
      header: "Title",
      render: (value: unknown) => (
        <span className="font-medium text-neutral-900">
          {String(value || "Untitled")}
        </span>
      ),
    },
    {
      key: "body",
      header: "Content Preview",
      render: (value: unknown) => (
        <span className="text-neutral-500 text-sm truncate max-w-xs block">
          {String(value || "").slice(0, 100)}
          {String(value || "").length > 100 ? "..." : ""}
        </span>
      ),
    },
    {
      key: "sortOrder",
      header: "Order",
      render: (value: unknown) => (
        <span className="text-neutral-600">{String(value ?? 0)}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (value: unknown) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (value: unknown) =>
        value
          ? new Date(String(value)).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_: unknown, row: ContentData) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingContent(row);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this content?")) {
                deleteMutation.mutate(row.id);
              }
            }}
            className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Content Management
          </h2>
          <p className="text-neutral-500 mt-1">
            Manage FAQ, Privacy Policy, Terms & Conditions, and Contact Support
            content.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => contentQuery.refetch()}
            isLoading={contentQuery.isFetching}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => {
              setEditingContent(null);
              setIsModalOpen(true);
            }}
          >
            Add Content
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm font-medium text-neutral-500 mr-2">
            Type:
          </span>
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedType === "all"
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            All Types
          </button>
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedType === type.value
                    ? "bg-primary-600 text-white"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>
        {/* Target Filter */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm font-medium text-neutral-500 mr-2">
            Target:
          </span>
          <button
            onClick={() => setSelectedTarget("all_filter")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedTarget === "all_filter"
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
            }`}
            aria-pressed={selectedTarget === "all_filter"}
          >
            All Targets
          </button>
          {targetTypes.map((target) => (
            <button
              key={target.value}
              onClick={() => setSelectedTarget(target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedTarget === target.value
                  ? "bg-primary-600 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
              aria-pressed={selectedTarget === target.value}
            >
              {target.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table or Empty State */}
      {content.length === 0 && !contentQuery.isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={FileText}
            title="No content found"
            description={
              selectedType !== "all"
                ? `No ${getTypeConfig(selectedType).label} content has been added yet.`
                : "No content has been added yet. Start by adding FAQ, Privacy Policy, or other content."
            }
            action={{
              label: "Add Content",
              onClick: () => {
                setEditingContent(null);
                setIsModalOpen(true);
              },
            }}
          />
        </div>
      ) : (
        <DataTable
          data={content}
          columns={columns}
          keyField="id"
          isLoading={contentQuery.isLoading}
          emptyMessage="No content available"
        />
      )}

      {/* Content Editor Modal */}
      {isModalOpen && (
        <ContentEditorModal
          content={editingContent}
          defaultType={selectedType !== "all" ? selectedType : "faq"}
          defaultTarget={
            selectedTarget !== "all_filter" ? selectedTarget : "all"
          }
          onClose={() => {
            setIsModalOpen(false);
            setEditingContent(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
            setIsModalOpen(false);
            setEditingContent(null);
          }}
        />
      )}
    </div>
  );
}

/**
 * Content Editor Panel Component (Full-height slide-out drawer)
 */
interface ContentEditorModalProps {
  content: ContentResponseDto | null;
  defaultType: ContentType;
  defaultTarget: ContentTarget;
  onClose: () => void;
  onSuccess: () => void;
}

function ContentEditorModal({
  content,
  defaultType,
  defaultTarget,
  onClose,
  onSuccess,
}: ContentEditorModalProps) {
  const isEditing = !!content;

  const [formData, setFormData] = useState({
    type: content?.type || (defaultType as ContentType),
    target: (content?.target as ContentTarget) || defaultTarget,
    title: content?.title || "",
    body: content?.body || "",
    sortOrder: content?.sortOrder ?? 0,
    isActive: content?.isActive ?? true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get helpful labels based on content type
  const getContentLabels = () => {
    switch (formData.type) {
      case "faq":
        return { title: "Question", body: "Answer" };
      case "privacy_policy":
        return { title: "Title", body: "Privacy Policy Content" };
      case "terms_and_conditions":
        return { title: "Title", body: "Terms & Conditions Content" };
      case "contact_support":
        return { title: "Contact Method", body: "Contact Details" };
      default:
        return { title: "Title", body: "Content" };
    }
  };

  const labels = getContentLabels();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing && content) {
        await contentApi.contentControllerUpdateContent({
          id: content.id,
          updateContentDto: {
            title: formData.title,
            body: formData.body,
            target: formData.target as "driver" | "rider" | "all",
            sortOrder: formData.sortOrder,
            isActive: formData.isActive,
          },
        });
      } else {
        await contentApi.contentControllerCreateContent({
          createContentDto: {
            type: formData.type as
              | "privacy_policy"
              | "terms_and_conditions"
              | "faq"
              | "contact_support",
            target: formData.target as "driver" | "rider" | "all",
            title: formData.title,
            body: formData.body,
            sortOrder: formData.sortOrder,
            isActive: formData.isActive,
          },
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the type config for display
  const currentTypeConfig = contentTypes.find((t) => t.value === formData.type);

  return (
    <div className="fixed inset-0 z-50">
      {/* Full Screen Panel */}
      <div className="absolute inset-0 bg-white flex flex-col">
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {currentTypeConfig && (
              <div className={`p-2 rounded-xl ${currentTypeConfig.color}`}>
                <currentTypeConfig.icon className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">
                {isEditing ? "Edit Content" : "Add New Content"}
              </h3>
              {currentTypeConfig && (
                <p className="text-sm text-neutral-500">
                  {currentTypeConfig.label}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Panel Body */}
        <form
          id="content-editor-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 bg-neutral-50"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Content Type (only for new content) */}
            {!isEditing && (
              <div className="bg-white p-6 rounded-2xl border border-neutral-200">
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Content Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            type: type.value as ContentType,
                          })
                        }
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span
                          className={`text-sm font-medium ${isSelected ? "text-primary-700" : "text-neutral-700"}`}
                        >
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Target Audience */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Target Audience
              </label>
              <div className="flex gap-3 flex-wrap">
                {targetTypes.map((target) => {
                  const isSelected = formData.target === target.value;
                  return (
                    <button
                      key={target.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          target: target.value as ContentTarget,
                        })
                      }
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-primary-500 bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${target.color}`} />
                      <span
                        className={`text-sm font-medium ${isSelected ? "text-primary-700" : "text-neutral-700"}`}
                      >
                        {target.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Choose who should see this content. "All Users" shows to both
                riders and drivers.
              </p>
            </div>

            {/* Title */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {labels.title || "Title"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder={`Enter ${(labels.title || "title")?.toLowerCase()}...`}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                required
              />
            </div>

            {/* Body / Content */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {labels.body}
              </label>
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                {/* Minimalistic toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-neutral-200 bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.getElementById(
                        "content-body",
                      ) as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = formData.body;
                      const selectedText = text.substring(start, end);
                      const newText =
                        text.substring(0, start) +
                        `**${selectedText}**` +
                        text.substring(end);
                      setFormData({ ...formData, body: newText });
                    }}
                    className="px-2 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-200 rounded"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.getElementById(
                        "content-body",
                      ) as HTMLTextAreaElement;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const text = formData.body;
                      const selectedText = text.substring(start, end);
                      const newText =
                        text.substring(0, start) +
                        `<u>${selectedText}</u>` +
                        text.substring(end);
                      setFormData({ ...formData, body: newText });
                    }}
                    className="px-2 py-1 text-sm underline text-neutral-600 hover:bg-neutral-200 rounded"
                    title="Underline"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url) {
                        const textarea = document.getElementById(
                          "content-body",
                        ) as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = formData.body;
                        const selectedText =
                          text.substring(start, end) || "Link text";
                        const newText =
                          text.substring(0, start) +
                          `[${selectedText}](${url})` +
                          text.substring(end);
                        setFormData({ ...formData, body: newText });
                      }
                    }}
                    className="px-2 py-1 text-sm text-blue-600 hover:bg-neutral-200 rounded"
                    title="Add Link"
                  >
                    🔗
                  </button>
                  <div className="w-px h-5 bg-neutral-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        body: formData.body + "\n\n",
                      });
                    }}
                    className="px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 rounded"
                    title="Add Paragraph Break"
                  >
                    ¶
                  </button>
                </div>
                <textarea
                  id="content-body"
                  value={formData.body}
                  onChange={(e) =>
                    setFormData({ ...formData, body: e.target.value })
                  }
                  placeholder="Enter content body..."
                  rows={15}
                  className="w-full px-4 py-3 text-sm focus:outline-none resize-none"
                  required
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Supports basic formatting: **bold**,
                &lt;u&gt;underline&lt;/u&gt;, [link text](url)
              </p>
            </div>

            {/* Settings Row */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200">
              <div className="flex flex-wrap items-center gap-6">
                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                    className="w-24 px-4 py-2 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Lower = first</p>
                </div>

                {/* Divider */}
                <div className="h-16 w-px bg-neutral-200 hidden sm:block" />

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-neutral-700 block"
                    >
                      Active
                    </label>
                    <span className="text-xs text-neutral-500">
                      Visible to users when active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Panel Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex justify-between items-center bg-white">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={() => {
              const form = document.getElementById(
                "content-editor-form",
              ) as HTMLFormElement;
              form?.requestSubmit();
            }}
            isLoading={isSubmitting}
          >
            {isEditing ? "Update Content" : "Create Content"}
          </Button>
        </div>
      </div>
    </div>
  );
}
