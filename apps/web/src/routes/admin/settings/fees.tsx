import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../../../components/ui";
import { settingsApi } from "../../../lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/fees")({
  component: FeesSettingsPage,
});

function FeesSettingsPage() {
  const [fee, setFee] = useState<string>("");

  const { data: adminFeeSetting, isLoading } = useQuery({
    queryKey: ["settings", "ADMIN_FEE"],
    queryFn: async () => {
      const setting = await settingsApi.settingsControllerFindOne({ key: "ADMIN_FEE" });
      setFee(setting.value);
      return setting;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newValue: string) => {
      return settingsApi.settingsControllerUpdate({
        key: "ADMIN_FEE",
        updateSettingDto: { value: newValue },
      });
    },
    onSuccess: () => {
      toast.success("Admin fee updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update admin fee");
    },
  });

  const handleSave = () => {
    mutation.mutate(fee);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-8 w-8 text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Fees & Pricing</h2>
        <p className="text-neutral-500 mt-1">
          Configure application fees and pricing models.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-neutral-900">Driver Registration</h3>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium text-neutral-700">
              One-Time Admin Fee (ZAR)
            </label>
            <p className="text-sm text-neutral-500 mb-2">
              The amount charged to drivers upon first payment method addition.
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  type="number"
                  value={fee}
                  onChange={(e: any) => setFee(e.target.value)}
                  placeholder="300"
                />
              </div>
              <Button 
                onClick={handleSave} 
                disabled={mutation.isPending}
                className="w-32"
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
            </div>
            {adminFeeSetting?.updatedAt && (
              <p className="text-xs text-neutral-400 mt-1">
                Last updated: {new Date(adminFeeSetting.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
