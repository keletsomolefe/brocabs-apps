import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { ActivityIndicator, Dimensions, ScrollView } from "react-native";
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
import { useVehicleConfig } from "~/hooks/use-config";
import { FormDropdown } from "~/shared/ui/form/form-dropdown";
import { FormInput } from "~/shared/ui/form/form-input";
import { AssetFiles } from "~/theme/assets";

const uploadImages = async (
  files: FileType[] | null,
  type: FileControllerGetUploadUrlFileTypeEnum
) => {
  if (!files || files.length === 0) return [];

  const uploadUrlResponses = await Promise.all(
    files.map((f) =>
      filesApi.fileControllerGetUploadUrl({
        fileName: f.fileName || `image-${Date.now()}`,
        fileType: type,
      })
    )
  );

  await Promise.all(files.map((f, i) => uploadFile(f.filePath, uploadUrlResponses[i].uploadUri)));

  return uploadUrlResponses.map((r, i) => ({
    storagePath: r.storagePath,
    filename: files[i].fileName || `image-${Date.now()}`,
  }));
};

const filesArraySchema = z.array(fileSchema).nullable();

const schema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  colour: z.string().min(1, "Colour is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
});

type FormFields = z.infer<typeof schema>;

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 20 * 4;
const IMAGE_HEIGHT = IMAGE_WIDTH * (219 / 336);

export default function VehicleInfoScreen() {
  const insets = useSafeAreaInsets();
  const { data: vehicleConfig, isLoading: isLoadingConfig } = useVehicleConfig();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<FormFields, any, FormFields>,
    mode: "onChange",
    defaultValues: {
      make: "",
      model: "",
      colour: "",
      vehicleNumber: "",
    },
  });

  const onSubmit = useCallback(async (data: FormFields) => {
    try {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Processing...."
            description="Saving vehicle details..."
          />
        ),
      });

      await profilesApi.driverProfileControllerUpdateVehicle({
        updateVehicleDto: {
          make: data.make,
          model: data.model,
          colour: data.colour,
          registrationNumber: data.vehicleNumber,
          exteriorImages: [],
          interiorImages: [],
        },
      });

      ModalBox.hide();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Vehicle Updated"
            description="Your vehicle information has been updated."
            icon="double-ticks"
            buttonLabel="Back to Profile"
            onPress={() => {
              ModalBox.hide();
              router.back();
            }}
          />
        ),
      });
    } catch (error) {
      console.error(error);
      ModalBox.hide();
      // TODO: Show error
    }
  }, []);

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

  return (
    <Fill backgroundColor="Neutrals/50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20 + insets.bottom,
          paddingTop: 20,
        }}>
        <Container gap={20} px={20}>
          <Container alignItems="center" justifyContent="center">
            <Image
              source={AssetFiles.images["car-icon"]}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              contentFit="contain"
            />
          </Container>

          <FormDropdown
            name="make"
            control={control}
            placeholder="Make (e.g. Toyota)"
            data={vehicleConfig?.makes || []}
            rightIconColor="#5905ff"
            error={isSubmitted ? errors.make?.message : undefined}
            required
          />

          <FormDropdown
            name="model"
            control={control}
            placeholder="Model"
            data={vehicleConfig?.models || []}
            rightIconColor="#5905ff"
            error={isSubmitted ? errors.model?.message : undefined}
            required
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

          <Button
            label="Edit"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
          />
        </Container>
      </ScrollView>
    </Fill>
  );
}
