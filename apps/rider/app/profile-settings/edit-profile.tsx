import { FileControllerGetUploadUrlFileTypeEnum, IdentityDtoGenderEnum } from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
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
import { TouchableOpacity } from "react-native";
import { filesApi } from "~/api";
import { fileSchema } from "~/constants";
import { useUser } from "~/hooks/use-auth";
import { useRiderProfile, useUpdateRiderProfile } from "~/hooks/use-rider-profile";
import { useTranslation } from "~/i18n/LocaleContext";
import { FormAvatar } from "~/shared/ui/form/form-avatar";
import { FormDropdown } from "~/shared/ui/form/form-dropdown";
import { FormInput } from "~/shared/ui/form/form-input";
import { Icon } from "~/shared/ui/icons";

const schema = z.object({
  avatar: fileSchema.nullable(),
  fullName: z.string().min(1, "Full name is required"),
  gender: z.enum([IdentityDtoGenderEnum.Male, IdentityDtoGenderEnum.Female], {
    message: "Gender is required",
  }),
});

type FormFields = z.infer<typeof schema>;

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { data: user, isLoading: isProfileLoading } = useUser();
  const { data: profile } = useRiderProfile();
  const updateRiderProfileMutation = useUpdateRiderProfile();

  const GENDER_OPTIONS = [
    { label: t("common.male"), value: IdentityDtoGenderEnum.Male },
    { label: t("common.female"), value: IdentityDtoGenderEnum.Female },
  ];

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
            title={t("common.processing")}
            description={t("common.pleaseWait")}
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

      await updateRiderProfileMutation.mutateAsync({
        fullName: data.fullName,
        gender: data.gender,
        avatar: avatarDetails,
      });

      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title={t("common.success")}
            description={t("profile.profileUpdated")}
            icon="double-ticks"
            buttonLabel={t("profile.backToProfile")}
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
            placeholder={t("common.fullName")}
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
                borderRadius={20}
                height={56}
                px={16}
                alignItems="center"
                justifyContent="space-between"
                borderWidth={1}
                borderColor="Input Color">
                <Regular fontSize={16} color={user?.email ? "Primary/50" : "Neutrals/400"}>
                  {user?.email || t("common.email")}
                </Regular>
                <Icon name="edit-fill2" width={20} height={20} color={Colors["Primary/400"]} />
              </Row>
            </FormField>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/profile-settings/update-phone-number")}
            activeOpacity={0.7}>
            <FormField>
              <Row
                backgroundColor="Input Color"
                borderRadius={20}
                height={56}
                px={16}
                alignItems="center"
                justifyContent="space-between"
                borderWidth={1}
                borderColor="Input Color">
                <Regular fontSize={16} color={user?.phoneNumber ? "Primary/50" : "Neutrals/400"}>
                  {user?.phoneNumber || t("common.phoneNumber")}
                </Regular>
                <Icon name="edit-fill2" width={20} height={20} color={Colors["Primary/400"]} />
              </Row>
            </FormField>
          </TouchableOpacity>

          <FormDropdown
            name="gender"
            control={control as any}
            placeholder={t("common.gender")}
            data={GENDER_OPTIONS}
            error={errors.gender?.message}
            disabled={isSubmitting}
          />

          <Button
            label={t("common.save")}
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
