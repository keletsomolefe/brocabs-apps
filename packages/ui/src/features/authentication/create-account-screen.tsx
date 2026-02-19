import {
  AuthApi,
  CreateAccountDtoGenderEnum,
  FileControllerGetUploadUrlFileTypeEnum,
  FilesApi,
  MutationKeys,
  UploadUrlResponseDto,
  processApiError,
} from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { z } from "zod";

import { Lottie } from "../../animations";
import { Button } from "../../button";
import { Dialog } from "../../dialogs";
import { FormAvatar } from "../../form/form-avatar";
import { FormDropdown } from "../../form/form-dropdown";
import { FormInput } from "../../form/form-input";
import { Container, Fill } from "../../layout";
import { ModalBox } from "../../modal-box";
import { Regular } from "../../text";
import { fileSchema } from "../../types";
import { AuthLayout } from "./auth-layout";

import { uploadFile } from "../../utils";

const baseSchema = z
  .object({
    avatar: fileSchema.nullable(),
    fullName: z.string().min(1, "Full name is required"),
    gender: z.enum(CreateAccountDtoGenderEnum, {
      message: "Gender is required",
    }),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const avatarRequiredSchema = z
  .object({
    avatar: fileSchema.nullable().refine((val) => val !== null, {
      message: "Profile photo is required",
    }),
    fullName: z.string().min(1, "Full name is required"),
    gender: z.enum(CreateAccountDtoGenderEnum, {
      message: "Gender is required",
    }),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormFields = z.infer<typeof baseSchema>;
type FileUploadKey = "avatar";
type FileUploadInfo = {
  fileName: string;
  fileType: FileControllerGetUploadUrlFileTypeEnum;
  filePath: string;
};

interface CreateAccountScreenProps {
  filesApi: FilesApi;
  authApi: AuthApi;
  avatarRequired?: boolean;
  onSuccess?: () => Promise<void>;
}

export function CreateAccountScreen({
  filesApi,
  authApi,
  avatarRequired = false,
  onSuccess,
}: CreateAccountScreenProps) {
  const schema = useMemo(
    () => (avatarRequired ? avatarRequiredSchema : baseSchema),
    [avatarRequired],
  );

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
      gender: undefined,
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerDriverMutation = useMutation({
    mutationKey: [MutationKeys.REGISTER_DRIVER],
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
        return await authApi.authControllerCreateAccount({
          createAccountDto: {
            email: data.email,
            fullName: data.fullName,
            gender: data.gender,
            avatar: avatarDetails
              ? {
                  filename: avatarDetails.fileName,
                  storagePath: avatarDetails.storagePath,
                }
              : null,
            password: data.password,
            confirmPassword: data.confirmPassword,
          },
        });
      } catch (error) {
        throw await processApiError(error, "Registration failed");
      }
    },
    onSuccess: async (response) => {
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
      registerDriverMutation.reset();
      await registerDriverMutation.mutate(data);
    },
    [registerDriverMutation],
  );
  const isSubmitting = registerDriverMutation.isPending;

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
                  disabled={registerDriverMutation.isPending}
                  error={isSubmitted ? errors.avatar?.message : undefined}
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
              registerDriverMutation.error?.message
            }
            errorBorderOnly={Boolean(registerDriverMutation.error?.message)}
            returnKeyType="done"
            editable={!isSubmitting}
          />
          <FormInput
            name="email"
            control={control}
            placeholder="Email"
            error={
              (isSubmitted ? errors.email?.message : undefined) ||
              registerDriverMutation.error?.message
            }
            errorBorderOnly={Boolean(registerDriverMutation.error?.message)}
            returnKeyType="done"
            editable={!isSubmitting}
          />
          <FormDropdown
            name="gender"
            control={control}
            placeholder="Gender"
            required
            data={[
              { label: "Male", value: CreateAccountDtoGenderEnum.Male },
              { label: "Female", value: CreateAccountDtoGenderEnum.Female },
            ]}
            error={
              (isSubmitted ? errors.gender?.message : undefined) ||
              registerDriverMutation.error?.message
            }
            errorBorderOnly={Boolean(registerDriverMutation.error?.message)}
            disabled={isSubmitting}
          />
          <FormInput
            name="password"
            control={control}
            placeholder="Password"
            error={
              (isSubmitted ? errors.password?.message : undefined) ||
              registerDriverMutation.error?.message
            }
            errorBorderOnly={Boolean(registerDriverMutation.error?.message)}
            returnKeyType="done"
            secureTextEntry
            editable={!isSubmitting}
            textContentType="oneTimeCode"
            autoComplete="off"
          />
          <FormInput
            name="confirmPassword"
            control={control}
            placeholder="Confirm password"
            error={
              (isSubmitted ? errors.confirmPassword?.message : undefined) ||
              registerDriverMutation.error?.message
            }
            errorBorderOnly={Boolean(registerDriverMutation.error?.message)}
            returnKeyType="done"
            secureTextEntry
            editable={!isSubmitting}
            textContentType="oneTimeCode"
            autoComplete="off"
          />
          {registerDriverMutation.error?.message && (
            <Regular color="Secondary/600" fontSize={16}>
              {registerDriverMutation.error?.message}
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
