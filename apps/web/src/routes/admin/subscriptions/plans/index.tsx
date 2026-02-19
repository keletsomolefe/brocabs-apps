/**
 * Admin Subscription Plans Page
 *
 * Manage subscription plans - create, edit, activate/deactivate.
 */

import type {
  AdminPlanListResponseDto,
  AdminPlanResponseDto,
  CreatePlanDto,
  UpdatePlanDto,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Edit,
  Loader2,
  Package,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, EmptyState, Input } from "../../../../components/ui";
import { adminSubscriptionsApi } from "../../../../lib/api";

export const Route = createFileRoute("/admin/subscriptions/plans/")({
  component: AdminPlansPage,
});

/**
 * Format currency in ZAR
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Plan Card Component
 */
interface PlanCardProps {
  plan: AdminPlanResponseDto;
  onEdit: (plan: AdminPlanResponseDto) => void;
  onToggleActive: (plan: AdminPlanResponseDto) => void;
  isToggling: boolean;
}

function PlanCard({ plan, onEdit, onToggleActive, isToggling }: PlanCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border ${
        plan.isActive
          ? "border-neutral-100"
          : "border-neutral-200 bg-neutral-50"
      } overflow-hidden`}
    >
      {/* Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-neutral-900">
                {plan.name}
              </h3>
              {plan.isPopular && (
                <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">
                  POPULAR
                </Badge>
              )}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {plan.durationDays} days
            </p>
          </div>
          <Badge variant={plan.isActive ? "success" : "default"}>
            {plan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="text-3xl font-bold text-primary-600 mt-4">
          {formatCurrency(plan.price)}
        </p>
      </div>

      {/* Details */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {plan.description && (
          <p className="text-sm text-neutral-600">{String(plan.description)}</p>
        )}

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Features
            </p>
            <ul className="space-y-1">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-neutral-700"
                >
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Settings */}
        <div className="pt-4 border-t border-neutral-100 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Requires Approval</span>
            <Badge variant={plan.requiresApproval ? "warning" : "default"}>
              {plan.requiresApproval ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Active Subscriptions</span>
            <span className="font-medium text-neutral-900">
              {plan.activeSubscriptionsCount}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Total Subscriptions</span>
            <span className="font-medium text-neutral-900">
              {plan.totalSubscriptionsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={Edit}
          onClick={() => onEdit(plan)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button
          variant={plan.isActive ? "danger" : "primary"}
          size="sm"
          leftIcon={plan.isActive ? PowerOff : Power}
          onClick={() => onToggleActive(plan)}
          isLoading={isToggling}
          className="flex-1"
        >
          {plan.isActive ? "Deactivate" : "Activate"}
        </Button>
      </div>
    </div>
  );
}

/**
 * Plan Form Modal
 */
interface PlanFormProps {
  plan?: AdminPlanResponseDto | null;
  onClose: () => void;
  onSubmit: (data: CreatePlanDto | UpdatePlanDto) => void;
  isSubmitting: boolean;
}

function PlanForm({ plan, onClose, onSubmit, isSubmitting }: PlanFormProps) {
  const [name, setName] = useState(plan?.name || "");
  const [price, setPrice] = useState(plan?.price?.toString() || "");
  const [durationDays, setDurationDays] = useState(
    plan?.durationDays?.toString() || "30",
  );
  const [description, setDescription] = useState(
    plan?.description ? String(plan.description) : "",
  );
  const [features, setFeatures] = useState(plan?.features?.join("\n") || "");
  const [requiresApproval, setRequiresApproval] = useState(
    plan?.requiresApproval || false,
  );
  const [isPopular, setIsPopular] = useState(plan?.isPopular || false);
  const [isActive, setIsActive] = useState(plan?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      price: parseFloat(price),
      durationDays: parseInt(durationDays),
      description: description || undefined,
      features: features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      requiresApproval,
      isPopular,
      isActive,
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            {plan ? "Edit Plan" : "Create New Plan"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Plan Name *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Basic Plan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Price (ZAR) *
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 299"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Duration (Days) *
              </label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="e.g., 30"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this plan..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Features (one per line)
            </label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Priority ride matching&#10;Lower commission rate&#10;24/7 support"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">
                Requires Admin Approval
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              {" "}
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Popular Plan</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              {" "}
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex-1"
            >
              {plan ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPlansPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminPlanResponseDto | null>(
    null,
  );
  const [togglingPlanId, setTogglingPlanId] = useState<string | null>(null);

  // Fetch plans list
  const plansQuery = useQuery<AdminPlanListResponseDto>({
    queryKey: ["admin", "subscriptions", "plans", searchQuery],
    queryFn: () =>
      adminSubscriptionsApi.adminSubscriptionControllerListPlans({
        search: searchQuery || undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
      }),
  });

  // Create plan mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePlanDto) =>
      adminSubscriptionsApi.adminSubscriptionControllerCreatePlan({
        createPlanDto: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "subscriptions", "plans"],
      });
      setShowForm(false);
    },
  });

  // Update plan mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanDto }) =>
      adminSubscriptionsApi.adminSubscriptionControllerUpdatePlan({
        id,
        updatePlanDto: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "subscriptions", "plans"],
      });
      setEditingPlan(null);
      setShowForm(false);
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (plan: AdminPlanResponseDto) => {
      setTogglingPlanId(plan.id);
      if (plan.isActive) {
        return adminSubscriptionsApi.adminSubscriptionControllerDeactivatePlan({
          id: plan.id,
        });
      } else {
        return adminSubscriptionsApi.adminSubscriptionControllerActivatePlan({
          id: plan.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "subscriptions", "plans"],
      });
    },
    onSettled: () => {
      setTogglingPlanId(null);
    },
  });

  const plans = plansQuery.data?.data ?? [];

  const handleFormSubmit = (data: CreatePlanDto | UpdatePlanDto) => {
    if (editingPlan) {
      updateMutation.mutate({
        id: editingPlan.id,
        data: data as UpdatePlanDto,
      });
    } else {
      createMutation.mutate(data as CreatePlanDto);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/subscriptions">
            <Button variant="ghost" leftIcon={ArrowLeft} size="sm">
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              Subscription Plans
            </h2>
            <p className="text-neutral-500 mt-1">
              Create and manage subscription plans for drivers
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={RefreshCw}
            onClick={() => plansQuery.refetch()}
            isLoading={plansQuery.isFetching}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            leftIcon={Plus}
            onClick={() => setShowForm(true)}
          >
            Create Plan
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search plans..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
        />
      </div>

      {/* Plans Grid */}
      {plansQuery.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100">
          <EmptyState
            icon={Package}
            title="No plans found"
            description={
              searchQuery
                ? "No plans match your search criteria."
                : "Create your first subscription plan to get started."
            }
            action={
              !searchQuery
                ? {
                    label: "Create Plan",
                    onClick: () => setShowForm(true),
                  }
                : undefined
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={(p) => setEditingPlan(p)}
              onToggleActive={(p) => toggleActiveMutation.mutate(p)}
              isToggling={togglingPlanId === plan.id}
            />
          ))}
        </div>
      )}

      {/* Plan Form Modal */}
      {(showForm || editingPlan) && (
        <PlanForm
          plan={editingPlan}
          onClose={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
          onSubmit={handleFormSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
