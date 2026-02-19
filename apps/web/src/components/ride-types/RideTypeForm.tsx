import { useNavigate } from "@tanstack/react-router";
import { Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../ui";

// Define local types matching the expected API DTOs
export interface RideTypeFormData {
  code: string;
  displayName: string;
  description?: string;
  capacity: number;
  order: number;
  dispatchRank: number;
  baseFare: number;
  perMinuteRate: number;
  perKmRate: number;
  minFare: number;
  active: boolean;
}

interface RideTypeFormProps {
  initialData?: RideTypeFormData;
  onSubmit: (data: RideTypeFormData) => Promise<void>;
  isSubmitting?: boolean;
  title: string;
}

export function RideTypeForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  title,
}: RideTypeFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RideTypeFormData>(
    initialData || {
      code: "",
      displayName: "",
      description: "",
      capacity: 4,
      order: 0,
      dispatchRank: 1,
      baseFare: 0,
      perMinuteRate: 0,
      perKmRate: 0,
      minFare: 0,
      active: true,
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value)
            : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/admin/ride-types" })}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
            Vehicle Configuration (Read-only)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75">
            <Input
              label="Method Code"
              name="code"
              value={formData.code}
              readOnly
              disabled
              className="bg-neutral-100"
            />

            <Input
              label="Display Name"
              name="displayName"
              value={formData.displayName}
              readOnly
              disabled
              className="bg-neutral-100"
            />
          </div>

          <div className="mt-4 opacity-75">
            <Input
              label="Description"
              name="description"
              value={formData.description || ""}
              readOnly
              disabled
              className="bg-neutral-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4 opacity-75">
            <Input
              label="Capacity"
              type="number"
              name="capacity"
              value={formData.capacity}
              readOnly
              disabled
              className="bg-neutral-100"
            />

            <Input
              label="Order"
              type="number"
              name="order"
              value={formData.order}
              readOnly
              disabled
              className="bg-neutral-100"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Dispatch Logic
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Dispatch Rank"
              type="number"
              name="dispatchRank"
              value={formData.dispatchRank}
              onChange={handleChange}
              min={1}
              step="1"
              required
              helperText="Lower rank (1) gets priority in cascading dispatch"
            />
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-2">
          <h3 className="text-sm font-medium text-primary-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            Pricing Configuration
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Base Fare"
              type="number"
              name="baseFare"
              value={formData.baseFare}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
            <Input
              label="Min Fare"
              type="number"
              name="minFare"
              value={formData.minFare}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
            <Input
              label="Per Minute Rate"
              type="number"
              name="perMinuteRate"
              value={formData.perMinuteRate}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
            <Input
              label="Per Km Rate"
              type="number"
              name="perKmRate"
              value={formData.perKmRate}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <label
            htmlFor="active"
            className="text-sm font-medium text-neutral-700"
          >
            Active
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/ride-types" })}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Ride Type
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
