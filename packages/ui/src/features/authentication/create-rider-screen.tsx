import {
  AuthApi,
  FileControllerGetUploadUrlFileTypeEnum,
  FilesApi,
  UploadUrlResponseDto,
  processApiError,
} from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { z } from "zod";

import { Lottie } from "../../animations";
import { Button } from "../../button";
import { Dialog } from "../../dialogs";
import { FormAvatar } from "../../form/form-avatar";
import { FormInput } from "../../form/form-input";
import { Container, Fill } from "../../layout";
import { ModalBox } from "../../modal-box";
import { Regular } from "../../text";
import { fileSchema } from "../../types";
import { AuthLayout } from "./auth-layout";

import { uploadFile } from "../../utils";

const schema = z.object({
  avatar: fileSchema.nullable(),
  fullName: z.string().min(1, "Full name is required"),
});

type FormFields = z.infer<typeof schema>;
type FileUploadKey = "avatar";
type FileUploadInfo = {
  fileName: string;
  fileType: FileControllerGetUploadUrlFileTypeEnum;
  filePath: string;
};

interface CreateRiderScreenProps {
  filesApi: FilesApi;
  authApi: AuthApi;
  onSuccess?: () => Promise<void>;
}

export function CreateRiderScreen({
  filesApi,
  authApi,
  onSuccess,
}: CreateRiderScreenProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<
      FormFields,
      any,
      FormFields
    >,
    mode: "onChange",
    defaultValues: {
      avatar: null,
      fullName: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationKey: ["create-rider-profile"],
    mutationFn: async (data: FormFields) => {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Processing...."
            description="Please wait! Your action is under process"
          />
        ),
      });

      const fileMap: Partial<Record<FileUploadKey, FileUploadInfo>> = {};

      if (data.avatar?.filePath) {
        fileMap["avatar"] = {
          fileName: data.avatar.fileName,
          fileType: FileControllerGetUploadUrlFileTypeEnum.Avatar,
          filePath: data.avatar.filePath,
        };
      }

      const keys = Object.keys(fileMap) as FileUploadKey[];
      const uploadUrlResponses = await Promise.all(
        keys.map((key) => filesApi.fileControllerGetUploadUrl(fileMap[key]!)),
      );

      const uploadPromises = keys.map((key, index) => {
        const fileInfo = fileMap[key]!;
        const urlResponse = uploadUrlResponses[index];

        return uploadFile(fileInfo.filePath, urlResponse.uploadUri);
      });

      await Promise.all(uploadPromises);

      const keyedUploadUrls = keys.reduce((acc, key, index) => {
        acc[key] = uploadUrlResponses[index];
        return acc;
      }, {} as Record<FileUploadKey, UploadUrlResponseDto>);

      const avatarDetails = keyedUploadUrls["avatar"];

      try {
        return await authApi.authControllerCreateRiderProfile({
          createProfileDto: {
            fullName: data.fullName,
            avatar: avatarDetails
              ? {
                  filename: avatarDetails.fileName,
                  storagePath: avatarDetails.storagePath,
                }
              : null,
          },
        });
      } catch (error) {
        throw await processApiError(error, "Profile creation failed");
      }
    },
    onSuccess: async () => {
      if (onSuccess) {
        await onSuccess();
      } else {
        router.dismissAll();
        router.replace("/(app)");
      }
    },
    onSettled: () => {
      ModalBox.hide();
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      createProfileMutation.reset();
      await createProfileMutation.mutate(data);
    },
    [createProfileMutation],
  );
  const isSubmitting = createProfileMutation.isPending;

  return (
    <Fill backgroundColor="Bg Color">
      <AuthLayout>
        <Container gap={20}>
          <Container alignItems="center" justifyContent="center" py={16}>
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <FormAvatar
                  onChange={field.onChange}
                  value={field.value}
                  disabled={createProfileMutation.isPending}
                />
              )}
            />
          </Container>
          <FormInput
            name="fullName"
            control={control}
            placeholder="Full name"
            error={
              (isSubmitted ? errors.fullName?.message : undefined) ||
              createProfileMutation.error?.message
            }
            errorBorderOnly={Boolean(createProfileMutation.error?.message)}
            returnKeyType="done"
            editable={!isSubmitting}
          />
          {createProfileMutation.error?.message && (
            <Regular color="Secondary/600" fontSize={16}>
              {createProfileMutation.error?.message}
            </Regular>
          )}
          <Button
            label="Continue"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Container>
      </AuthLayout>
    </Fill>
  );
}
