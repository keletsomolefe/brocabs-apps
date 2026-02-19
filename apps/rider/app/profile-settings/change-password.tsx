import { MutationKeys, processApiError } from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ModalBox } from "@brocabs/ui/modal-box";
import { Regular } from "@brocabs/ui/text";
import { authApi } from "~/api";
import { Button } from "@brocabs/ui/button";
import { Dialog } from "@brocabs/ui/dialogs";
import { Lottie } from "@brocabs/ui/animations";
import { FormInput } from "~/shared/ui/form/form-input";
import { Container, Fill } from "@brocabs/ui/layout";
import { useTranslation } from "~/i18n/LocaleContext";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormFields = z.infer<typeof schema>;

export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: [MutationKeys.CHANGE_PASSWORD],
    mutationFn: async (data: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title={t("common.processing")}
            description={t("common.pleaseWait")}
          />
        ),
      });
      try {
        return await authApi.authControllerChangePassword({
          changePasswordDto: {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
        });
      } catch (error) {
        throw await processApiError(error, t("profile.failedToChangePassword"));
      }
    },
    onSettled: () => {
      ModalBox.hide();
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      changePasswordMutation.reset();
      await changePasswordMutation.mutateAsync(
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          onSuccess: () => {
            ModalBox.show("popup", {
              content: (
                <Dialog.Confirmation
                  title={t("profile.passwordChangedTitle")}
                  description={t("profile.passwordChangedDesc")}
                  icon="check-circle"
                  buttonLabel={t("common.done")}
                  onPress={() => {
                    ModalBox.hide();
                    router.back();
                  }}
                />
              ),
            });
          },
        }
      );
    },
    [changePasswordMutation, t]
  );

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={10} pb={30}>
        {/* Description */}
        <Container mb={20}>
          <Regular fontSize={16} lineHeight={19.2} color="Primary/50">
            {t("profile.passwordUpdateIntro")}
          </Regular>
        </Container>

        {/* Form */}
        <Container gap={14}>
          <FormInput
            name="oldPassword"
            control={control as any}
            label={t("common.oldPassword")}
            placeholder={t("common.enterPassword")}
            secureTextEntry
            icon="lock2"
            error={
              (isSubmitted ? errors.oldPassword?.message : undefined) ||
              changePasswordMutation.error?.message
            }
            errorBorderOnly={Boolean(changePasswordMutation.error?.message)}
            editable={!changePasswordMutation.isPending}
          />

          <FormInput
            name="newPassword"
            control={control as any}
            label={t("common.newPassword")}
            placeholder={t("common.enterPassword")}
            secureTextEntry
            icon="lock2"
            error={isSubmitted ? errors.newPassword?.message : undefined}
            editable={!changePasswordMutation.isPending}
          />

          <FormInput
            name="confirmPassword"
            control={control as any}
            label={t("common.confirmPassword")}
            placeholder={t("common.enterPassword")}
            secureTextEntry
            icon="lock2"
            error={isSubmitted ? errors.confirmPassword?.message : undefined}
            editable={!changePasswordMutation.isPending}
          />

          {changePasswordMutation.error?.message && (
            <Container mt={10}>
              <Regular color="Secondary/600" fontSize={16}>
                {changePasswordMutation.error?.message}
              </Regular>
            </Container>
          )}

          <Container mt={20}>
            <Button
              label={t("common.save")}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              radius="rounded"
              isLoading={changePasswordMutation.isPending}
              disabled={changePasswordMutation.isPending}
            />
          </Container>
        </Container>
      </Container>
    </Fill>
  );
}
