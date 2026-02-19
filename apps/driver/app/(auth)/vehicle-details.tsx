import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { ActivityIndicator, Dimensions, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import { FileControllerGetUploadUrlFileTypeEnum } from "@brocabs/client";
import { uploadFile } from "@brocabs/ui";
import { Lottie } from "@brocabs/ui/animations";
import { Button } from "@brocabs/ui/button";
import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill, Image } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Regular } from "@brocabs/ui/text";
import { filesApi, profilesApi } from "~/api";
import { fileSchema, FileType } from "~/constants";
import { MakeSelector } from "~/features/authentication/components/make-selector";
import { ModelSelector } from "~/features/authentication/components/model-selector";
import { useUser } from "~/hooks/use-auth";
import { useVehicleConfig } from "~/hooks/use-config";
import { FormDropdown } from "~/shared/ui/form/form-dropdown";
import { FormImageUpload } from "~/shared/ui/form/form-image-upload";
import { FormInput } from "~/shared/ui/form/form-input";
import { AssetFiles } from "~/theme/assets";
import { navigateBasedOnSession } from "~/utils/session-navigation";

const filesArraySchema = z.array(fileSchema).nullable();

const schema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  colour: z.string().min(1, "Colour is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  exteriorImages: filesArraySchema.refine((files) => files && files.length > 0, {
    message: "Exterior images are required",
  }),
  interiorImages: filesArraySchema.refine((files) => files && files.length > 0, {
    message: "Interior images are required",
  }),
});

type FormFields = z.infer<typeof schema>;

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 20 * 4;
const IMAGE_HEIGHT = IMAGE_WIDTH * (219 / 336);

export default function VehicleDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { rideTypeId } = useLocalSearchParams<{ rideTypeId: string }>();
  const userQuery = useUser({ enabled: false });
  const { data: vehicleConfig, isLoading: isLoadingConfig } = useVehicleConfig();
  const [selectedMakeId, setSelectedMakeId] = useState<string | undefined>(undefined);
  const [uploadProgress, setUploadProgress] = useState<Record<string, Partial<FileType>>>({});

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<FormFields, any, FormFields>,
    mode: "onChange",
    defaultValues: {
      make: "",
      model: "",
      colour: "",
      vehicleNumber: "",
      exteriorImages: null,
      interiorImages: null,
    },
  });

  const handleFilesChange = useCallback(
    async (
      newFiles: FileType[] | null,
      onChange: (files: FileType[] | null) => void,
      fieldName: "exteriorImages" | "interiorImages",
      fileType: FileControllerGetUploadUrlFileTypeEnum
    ) => {
      onChange(newFiles);

      if (!newFiles) return;

      for (const file of newFiles) {
        // Only upload if not already uploaded/uploading and strictly new (no storagePath)
        const currentProgress = uploadProgress[file.filePath];
        if (!file.storagePath && !file.status && !currentProgress?.status) {
          // Initialize progress state
          setUploadProgress((prev) => ({
            ...prev,
            [file.filePath]: { status: "uploading", progress: 0 },
          }));

          // Start upload
          try {
            const fileName = file.fileName || `image-${Date.now()}`;
            const { uploadUri, storagePath } = await filesApi.fileControllerGetUploadUrl({
              fileName,
              fileType,
            });

            await uploadFile(file.filePath, uploadUri, (progress) => {
              setUploadProgress((prev) => ({
                ...prev,
                [file.filePath]: { status: "uploading", progress },
              }));
            });

            // Mark completed in local state
            setUploadProgress((prev) => ({
              ...prev,
              [file.filePath]: { status: "completed", progress: 100, storagePath },
            }));

            // Update form value with storagePath
            const currentList = getValues(fieldName) || [];
            const updatedList = currentList.map((f) =>
              f.filePath === file.filePath ? { ...f, storagePath, status: "completed" } : f
            );
            // We use setValue to persist the storagePath which is needed for submission
            // We cast to any because zod inference might be strict about exact shape vs internal optional fields
            setValue(fieldName, updatedList as any);
          } catch (e) {
            console.error("Upload failed", e);
            setUploadProgress((prev) => ({
              ...prev,
              [file.filePath]: { status: "error", progress: 0 },
            }));
          }
        }
      }
    },
    [getValues, setValue, uploadProgress]
  );

  const onSubmit = useCallback(
    async (data: FormFields) => {
      try {
        // Validate all files are uploaded
        const allExterior = data.exteriorImages || [];
        const allInterior = data.interiorImages || [];

        const allFiles = [...allExterior, ...allInterior];

        const failedUploads = allFiles.filter(
          (f) => uploadProgress[f.filePath]?.status === "error"
        );
        const ongoingUploads = allFiles.filter(
          (f) => !f.storagePath && uploadProgress[f.filePath]?.status === "uploading"
        );
        // Also catch files that are not completed, not uploading, not error, and don't have storagePath (stuck pending?)
        const pendingUploads = allFiles.filter(
          (f) =>
            !f.storagePath &&
            uploadProgress[f.filePath]?.status !== "completed" &&
            uploadProgress[f.filePath]?.status !== "uploading" &&
            uploadProgress[f.filePath]?.status !== "error"
        );

        if (failedUploads.length > 0) {
          ModalBox.show("popup", {
            content: (
              <Dialog.Confirmation
                title="Upload Failed"
                description="Some files failed to upload. Please remove them and try again."
                buttonLabel="OK"
                onPress={() => ModalBox.hide()}
                icon="cross"
              />
            ),
          });
          return;
        }

        if (ongoingUploads.length > 0 || pendingUploads.length > 0) {
          ModalBox.show("popup", {
            content: (
              <Dialog.Confirmation
                title="Uploads In Progress"
                description="Please wait for all images to finish uploading before continuing."
                buttonLabel="OK"
                onPress={() => ModalBox.hide()}
                icon="upload"
              />
            ),
          });
          return;
        }

        ModalBox.show("popup", {
          content: (
            <Dialog.Loader
              source={Lottie.loader}
              title="Processing...."
              description="Saving vehicle details..."
            />
          ),
        });

        // Map to API DTO format - ensure we use the storagePath from form data or fallback to progress state if sync lagged
        const getStoragePath = (f: FileType) =>
          f.storagePath || uploadProgress[f.filePath]?.storagePath;

        const exteriorPaths = allExterior.map((f) => ({
          storagePath: getStoragePath(f)!,
          filename: f.fileName,
        }));
        const interiorPaths = allInterior.map((f) => ({
          storagePath: getStoragePath(f)!,
          filename: f.fileName,
        }));

        await profilesApi.driverProfileControllerUpdateVehicle({
          updateVehicleDto: {
            make: data.make,
            model: data.model,
            colour: data.colour,
            registrationNumber: data.vehicleNumber,
            // @ts-ignore
            rideTypeId: rideTypeId ? Number(rideTypeId) : undefined,
            exteriorImages: exteriorPaths,
            interiorImages: interiorPaths,
          },
        });

        const { data: user } = await userQuery.refetch();

        if (user) {
          navigateBasedOnSession(user);
        }
      } catch (error) {
        console.error(error);
        // TODO: Show error
      } finally {
        ModalBox.hide();
      }
    },
    [rideTypeId, uploadProgress, userQuery]
  );

  if (isLoadingConfig) {
    return (
      <Fill backgroundColor="Neutrals/50">
        <Container flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" />
          <Regular color="black-500" fontSize={16} style={{ marginTop: 16 }}>
            Loading vehicle options...
          </Regular>
        </Container>
      </Fill>
    );
  }

  // Merge form values with upload progress for display
  const exteriorValue = (watch("exteriorImages") || []).map((f) => ({
    ...f,
    ...(uploadProgress[f.filePath] || {}),
  }));

  const interiorValue = (watch("interiorImages") || []).map((f) => ({
    ...f,
    ...(uploadProgress[f.filePath] || {}),
  }));

  return (
    <Fill backgroundColor="Neutrals/50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20 + insets.bottom,
          paddingTop: 20,
        }}>
        <Container gap={20} px={20}>
          {/* Vehicle Illustration */}
          <Container alignItems="center" justifyContent="center">
            <Image
              source={AssetFiles.images["car-icon"]}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              contentFit="contain"
            />
          </Container>

          {/* Form Fields */}
          <Controller
            name="make"
            control={control}
            render={({ field }) => (
              <View>
                <MakeSelector
                  value={field.value}
                  onChange={(id, label) => {
                    field.onChange(label);
                    setSelectedMakeId(id);
                    // Reset model when make changes
                    setValue("model", "");
                  }}
                  error={isSubmitted ? errors.make?.message : undefined}
                />
                {isSubmitted && errors.make?.message && (
                  <Regular
                    color="Secondary/600"
                    fontSize={14}
                    style={{ marginTop: 4, marginLeft: 4 }}>
                    {errors.make.message}
                  </Regular>
                )}
              </View>
            )}
          />

          <Controller
            name="model"
            control={control}
            render={({ field }) => (
              <View>
                <ModelSelector
                  value={field.value}
                  makeId={selectedMakeId}
                  onChange={(_id, label) => {
                    field.onChange(label);
                  }}
                  error={isSubmitted ? errors.model?.message : undefined}
                  disabled={!selectedMakeId}
                />
                {isSubmitted && errors.model?.message && (
                  <Regular
                    color="Secondary/600"
                    fontSize={14}
                    style={{ marginTop: 4, marginLeft: 4 }}>
                    {errors.model.message}
                  </Regular>
                )}
              </View>
            )}
          />

          <FormDropdown
            name="colour"
            control={control}
            placeholder="Colour"
            data={vehicleConfig?.colors || []}
            rightIconColor="#5905ff"
            error={isSubmitted ? errors.colour?.message : undefined}
            required
          />

          <FormInput
            name="vehicleNumber"
            control={control}
            placeholder="Vehicle Number"
            error={isSubmitted ? errors.vehicleNumber?.message : undefined}
            returnKeyType="done"
          />

          {/* Image Upload Sections */}
          <Controller
            name="exteriorImages"
            control={control}
            render={({ field }) => (
              <FormImageUpload
                label="Exterior Images"
                highlightText="Exterior"
                instructions="(All sides, Tires, Bonnet, Boot etc.)"
                value={exteriorValue}
                onChange={(files) =>
                  handleFilesChange(
                    files,
                    field.onChange,
                    "exteriorImages",
                    FileControllerGetUploadUrlFileTypeEnum.VehicleExterior
                  )
                }
                error={isSubmitted ? errors.exteriorImages?.message : undefined}
                errorBorderOnly={false}
              />
            )}
          />

          <Controller
            name="interiorImages"
            control={control}
            render={({ field }) => (
              <FormImageUpload
                label="Interior Images"
                highlightText="Interior"
                instructions="(Monitor, Mileage, passenger seats etc.)"
                value={interiorValue}
                onChange={(files) =>
                  handleFilesChange(
                    files,
                    field.onChange,
                    "interiorImages",
                    FileControllerGetUploadUrlFileTypeEnum.VehicleInterior
                  )
                }
                error={isSubmitted ? errors.interiorImages?.message : undefined}
                errorBorderOnly={false}
              />
            )}
          />

          <Button
            label="Continue"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
          />
        </Container>
      </ScrollView>
    </Fill>
  );
}
