import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Truck,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, EmptyState, Input } from "../../../components/ui";
import {
  type PaginatedMakesResponseDto,
  type PaginatedModelsResponseDto,
  type VehicleMakeResponseDto,
  type VehicleModelResponseDto,
  type VehicleVariantResponseDto,
  vehiclesApi,
} from "../../../lib/api";
import { QueryKeys } from "../../../lib/query";

export const Route = createFileRoute("/admin/vehicles/")({
  component: VehiclesPage,
});

/* ------------------------------------------------------------------ */
/*  Shared Modal Shell                                                 */
/* ------------------------------------------------------------------ */

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-neutral-500">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Make Modal (Add / Edit)                                            */
/* ------------------------------------------------------------------ */

function MakeModal({
  make,
  onClose,
}: {
  make?: VehicleMakeResponseDto;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(make?.name ?? "");
  const isEdit = !!make;

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? vehiclesApi.vehiclesControllerUpdateMake({
            id: make.id,
            updateMakeDto: { name: name.trim() },
          })
        : vehiclesApi.vehiclesControllerCreateMake({
            createMakeDto: { name: name.trim() },
          }),
    onSuccess: () => {
      toast.success(isEdit ? "Make updated" : "Make created");
      queryClient.invalidateQueries({ queryKey: QueryKeys.VEHICLE_MAKES });
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || `Failed to ${isEdit ? "update" : "create"} make`);
    },
  });

  return (
    <ModalShell
      title={isEdit ? "Edit Vehicle Make" : "Add Vehicle Make"}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) mutation.mutate();
        }}
        className="p-6 space-y-4"
      >
        <Input
          label="Make Name"
          placeholder="e.g. Toyota, BMW, Mercedes-Benz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={!name.trim() || (isEdit && name.trim() === make.name)}
          >
            {isEdit ? "Save" : "Add Make"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Model Modal (Add / Edit)                                           */
/* ------------------------------------------------------------------ */

function ModelModal({
  make,
  model,
  onClose,
}: {
  make: VehicleMakeResponseDto;
  model?: VehicleModelResponseDto;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(model?.name ?? "");
  const isEdit = !!model;

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? vehiclesApi.vehiclesControllerUpdateModel({
            id: model.id,
            updateModelDto: { name: name.trim() },
          })
        : vehiclesApi.vehiclesControllerCreateModel({
            createModelDto: { makeId: make.id, name: name.trim() },
          }),
    onSuccess: () => {
      toast.success(isEdit ? "Model updated" : "Model created");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.VEHICLE_MODELS(make.id),
      });
      onClose();
    },
    onError: (err: Error) => {
      toast.error(
        err.message || `Failed to ${isEdit ? "update" : "create"} model`,
      );
    },
  });

  return (
    <ModalShell
      title={isEdit ? "Edit Model" : "Add Model"}
      subtitle={`for ${make.name}`}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) mutation.mutate();
        }}
        className="p-6 space-y-4"
      >
        <Input
          label="Model Name"
          placeholder="e.g. Corolla, 3 Series, C-Class"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            disabled={!name.trim() || (isEdit && name.trim() === model.name)}
          >
            {isEdit ? "Save" : "Add Model"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant Modal (Add / Edit)                                         */
/* ------------------------------------------------------------------ */

function VariantModal({
  model,
  variant,
  onClose,
}: {
  model: VehicleModelResponseDto;
  variant?: VehicleVariantResponseDto;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const isEdit = !!variant;

  const [yearFrom, setYearFrom] = useState(
    variant?.yearFrom ?? new Date().getFullYear(),
  );
  const [yearTo, setYearTo] = useState(
    variant?.yearTo != null ? String(variant.yearTo as unknown as number) : "",
  );
  const [trim, setTrim] = useState(
    (variant?.trim as unknown as string) ?? "",
  );

  const mutation = useMutation({
    mutationFn: () =>
      isEdit
        ? vehiclesApi.vehiclesControllerUpdateVariant({
            id: variant.id,
            updateVariantDto: {
              yearFrom,
              yearTo: yearTo ? Number(yearTo) : null,
              trim: trim.trim() || null,
            },
          })
        : vehiclesApi.vehiclesControllerCreateVariant({
            createVariantDto: {
              modelId: model.id,
              yearFrom,
              yearTo: yearTo ? Number(yearTo) : undefined,
              trim: trim.trim() || undefined,
            },
          }),
    onSuccess: () => {
      toast.success(isEdit ? "Variant updated" : "Variant created");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.VEHICLE_VARIANTS(model.id),
      });
      onClose();
    },
    onError: (err: Error) => {
      toast.error(
        err.message || `Failed to ${isEdit ? "update" : "create"} variant`,
      );
    },
  });

  return (
    <ModalShell
      title={isEdit ? "Edit Variant" : "Add Variant"}
      subtitle={`for ${model.name}`}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="p-6 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Year From"
            type="number"
            min={1900}
            max={2100}
            value={yearFrom}
            onChange={(e) => setYearFrom(Number(e.target.value))}
            autoFocus
          />
          <Input
            label="Year To"
            type="number"
            min={1900}
            max={2100}
            placeholder="Ongoing"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            helperText="Leave empty for current"
          />
        </div>
        <Input
          label="Trim"
          placeholder="e.g. SE, XLE, Sport"
          value={trim}
          onChange={(e) => setTrim(e.target.value)}
          helperText="Optional trim level"
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEdit ? "Save" : "Add Variant"}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant List (nested inside a model row)                           */
/* ------------------------------------------------------------------ */

function VariantList({ model }: { model: VehicleModelResponseDto }) {
  const [modalVariant, setModalVariant] = useState<
    VehicleVariantResponseDto | "new" | null
  >(null);

  const { data: variants, isLoading } = useQuery({
    queryKey: QueryKeys.VEHICLE_VARIANTS(model.id),
    queryFn: () =>
      vehiclesApi.vehiclesControllerSearchVariants({ modelId: model.id }),
  });

  return (
    <div className="pl-8 pr-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
          Variants
        </span>
        <button
          onClick={() => setModalVariant("new")}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-8 bg-neutral-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : !variants?.length ? (
        <p className="text-xs text-neutral-400 italic py-2">
          No variants yet
        </p>
      ) : (
        <div className="space-y-1.5">
          {variants.map((v: VehicleVariantResponseDto) => (
            <div
              key={v.id}
              className="group flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-sm"
            >
              <span className="text-neutral-700 font-medium">
                {v.yearFrom}
                {v.yearTo ? `–${v.yearTo as unknown as number}` : "–present"}
              </span>
              {v.trim && (
                <Badge variant="info" size="sm">
                  {v.trim as unknown as string}
                </Badge>
              )}
              <button
                onClick={() => setModalVariant(v)}
                className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {modalVariant && (
        <VariantModal
          model={model}
          variant={modalVariant === "new" ? undefined : modalVariant}
          onClose={() => setModalVariant(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Model List (nested inside a make row)                              */
/* ------------------------------------------------------------------ */

function ModelList({ make }: { make: VehicleMakeResponseDto }) {
  const [modalModel, setModalModel] = useState<
    VehicleModelResponseDto | "new" | null
  >(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const { data, isLoading } = useQuery<PaginatedModelsResponseDto>({
    queryKey: QueryKeys.VEHICLE_MODELS(make.id),
    queryFn: () =>
      vehiclesApi.vehiclesControllerSearchModels({
        makeId: make.id,
        limit: 100,
      }),
  });

  const models = data?.data ?? [];

  return (
    <div className="border-t border-neutral-100 bg-neutral-50/50">
      <div className="px-6 py-3 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
          Models ({data?.total ?? "..."})
        </span>
        <button
          onClick={() => setModalModel("new")}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Model
        </button>
      </div>

      {isLoading ? (
        <div className="px-6 pb-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-neutral-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : models.length === 0 ? (
        <p className="px-6 pb-4 text-sm text-neutral-400 italic">
          No models added yet
        </p>
      ) : (
        <div className="px-6 pb-4 space-y-1">
          {models.map((model) => {
            const isExpanded = expandedModel === model.id;
            return (
              <div
                key={model.id}
                className="bg-white rounded-xl border border-neutral-100 overflow-hidden"
              >
                <div className="group flex items-center">
                  <button
                    onClick={() =>
                      setExpandedModel(isExpanded ? null : model.id)
                    }
                    className="flex-1 flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    )}
                    <span className="text-sm font-medium text-neutral-800">
                      {model.name}
                    </span>
                  </button>
                  <button
                    onClick={() => setModalModel(model)}
                    className="mr-3 opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                {isExpanded && <VariantList model={model} />}
              </div>
            );
          })}
        </div>
      )}

      {modalModel && (
        <ModelModal
          make={make}
          model={modalModel === "new" ? undefined : modalModel}
          onClose={() => setModalModel(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Vehicles Page                                                 */
/* ------------------------------------------------------------------ */

function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [expandedMake, setExpandedMake] = useState<string | null>(null);
  const [modalMake, setModalMake] = useState<
    VehicleMakeResponseDto | "new" | null
  >(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery<PaginatedMakesResponseDto>({
    queryKey: [...QueryKeys.VEHICLE_MAKES, search, page],
    queryFn: () =>
      vehiclesApi.vehiclesControllerSearchMakes({
        search: search || undefined,
        page,
        limit,
      }),
  });

  const makes = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Vehicles</h1>
          <p className="text-neutral-500">
            Manage vehicle makes, models, and variants
          </p>
        </div>
        <Button leftIcon={Plus} onClick={() => setModalMake("new")}>
          Add Make
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search makes..."
          leftIcon={Search}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Makes List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="px-6 py-4 border-b border-neutral-100 animate-pulse"
            >
              <div className="h-5 bg-neutral-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : makes.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No vehicle makes found"
          description={
            search
              ? "Try a different search term."
              : "Get started by adding your first vehicle make."
          }
          action={
            !search
              ? {
                  label: "Add Make",
                  onClick: () => setModalMake("new"),
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            {makes.map((make) => {
              const isExpanded = expandedMake === make.id;
              return (
                <div
                  key={make.id}
                  className="border-b border-neutral-100 last:border-b-0"
                >
                  <div className="group flex items-center">
                    <button
                      onClick={() =>
                        setExpandedMake(isExpanded ? null : make.id)
                      }
                      className="flex-1 flex items-center gap-3 px-6 py-4 hover:bg-neutral-50 transition-colors text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-neutral-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                      )}
                      <span className="flex-1 font-medium text-neutral-900">
                        {make.name}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(make.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                    <button
                      onClick={() => setModalMake(make)}
                      className="mr-4 opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  {isExpanded && <ModelList make={make} />}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Showing {(page - 1) * limit + 1}–
                {Math.min(page * limit, total)} of {total} makes
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Make Modal (Add / Edit) */}
      {modalMake && (
        <MakeModal
          make={modalMake === "new" ? undefined : modalMake}
          onClose={() => setModalMake(null)}
        />
      )}
    </div>
  );
}
