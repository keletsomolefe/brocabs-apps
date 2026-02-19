import { FileControllerGetUploadUrlFileTypeEnum, IdentityDtoGenderEnum } from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { z } from "zod";

import { Lottie } from "@brocabs/ui/animations";
import { Button } from "@brocabs/ui/button";
import { Dialog } from "@brocabs/ui/dialogs";
import { FormField } from "@brocabs/ui/form/form-field";
import { Container, Fill, Row } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { uploadFile } from "@brocabs/ui/utils";
import { filesApi } from "~/api";
import { fileSchema } from "~/constants";
import { useUser } from "~/hooks/use-auth";
import { useDriverProfile, useUpdateDriverProfile } from "~/hooks/use-driver-profile";
import { FormAvatar } from "~/shared/ui/form/form-avatar";
import { FormDropdown } from "~/shared/ui/form/form-dropdown";
import { FormInput } from "~/shared/ui/form/form-input";
import { Icon } from "~/shared/ui/icons";

const GENDER_OPTIONS = [
  { label: "Male", value: IdentityDtoGenderEnum.Male },
  { label: "Female", value: IdentityDtoGenderEnum.Female },
];

const schema = z.object({
  avatar: fileSchema.nullable(),
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum([IdentityDtoGenderEnum.Male, IdentityDtoGenderEnum.Female], {
    message: "Gender is required",
  }),
});

type FormFields = z.infer<typeof schema>;

export default function EditProfileScreen() {
  const { data: user, isLoading: isProfileLoading } = useUser();
  const { data: profile } = useDriverProfile();
  const updateDriverProfileMutation = useUpdateDriverProfile();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: profile?.avatar?.publicUrl
        ? { filePath: profile.avatar.publicUrl, fileName: "avatar" }
        : null,
      fullName: profile?.fullName || "",
      gender: (user?.gender as IdentityDtoGenderEnum) || undefined,
    },
  });

  const onSubmit = async (data: FormFields) => {
    try {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Processing...."
            description="Please wait! Your action is under process"
          />
        ),
      });

      let avatarDetails = undefined;

      if (data.avatar?.filePath && data.avatar.filePath !== profile?.avatar?.publicUrl) {
        const uploadUrlResponse = await filesApi.fileControllerGetUploadUrl({
          fileName: data.avatar.fileName,
          fileType: FileControllerGetUploadUrlFileTypeEnum.Avatar,
        });

        await uploadFile(data.avatar.filePath, uploadUrlResponse.uploadUri);

        avatarDetails = {
          filename: uploadUrlResponse.fileName,
          storagePath: uploadUrlResponse.storagePath,
        };
      } else if (data.avatar === null && profile?.avatar) {
        avatarDetails = null;
      }

      await updateDriverProfileMutation.mutateAsync({
        fullName: data.fullName,
        gender: data.gender,
        avatar: avatarDetails,
      });

      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Success"
            description="Your profile has been updated successfully"
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
      console.error("Update failed:", error);
      ModalBox.hide();
      // TODO: Show error toast
    }
  };

  if (isProfileLoading) {
    return null;
  }

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={20} pb={30}>
        <Container alignItems="center" mb={20}>
          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <FormAvatar onChange={field.onChange} value={field.value} disabled={isSubmitting} />
            )}
          />
        </Container>

        <Container gap={20}>
          <FormInput
            name="fullName"
            control={control as any}
            placeholder="Full Name"
            rightIcon="edit-fill2"
            error={errors.fullName?.message}
            editable={!isSubmitting}
          />
          <TouchableOpacity
            onPress={() => router.push("/profile-settings/update-email")}
            activeOpacity={0.7}>
            <FormField>
              <Row
                backgroundColor="Input Color"
                borderRadius={10}
                height={56}
                px={10}
                alignItems="center"
                justifyContent="space-between"
                borderWidth={1}
                borderColor="Input Color">
                <Regular fontSize={16} color={user?.email ? "Primary/50" : "Neutrals/400"}>
                  {user?.email || "Email"}
                </Regular>
                <Icon name="edit-fill2" width={22} height={22} color={Colors["Primary/400"]} />
              </Row>
            </FormField>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/profile-settings/update-phone-number")}
            activeOpacity={0.7}>
            <FormField>
              <Row
                backgroundColor="Input Color"
                borderRadius={10}
                height={56}
                px={10}
                alignItems="center"
                justifyContent="space-between"
                borderWidth={1}
                borderColor="Input Color">
                <Regular fontSize={16} color={user?.phoneNumber ? "Primary/50" : "Neutrals/400"}>
                  {user?.phoneNumber || "Phone Number"}
                </Regular>
                <Icon name="edit-fill2" width={22} height={22} color={Colors["Primary/400"]} />
              </Row>
            </FormField>
          </TouchableOpacity>

          <FormDropdown
            name="gender"
            control={control as any}
            placeholder="Gender"
            data={GENDER_OPTIONS}
            error={errors.gender?.message}
            disabled={isSubmitting}
          />

          <Button
            label="Save"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
            isLoading={isSubmitting}
          />
        </Container>
      </Container>
    </Fill>
  );
}
