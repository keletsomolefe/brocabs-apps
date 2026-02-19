import { AuthApi, ForgotPasswordDto, processApiError } from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { z } from "zod";

import { Lottie } from "../../animations";
import { Button } from "../../button";
import { Dialog } from "../../dialogs";
import { FormInput } from "../../form/form-input";
import { Container, Fill } from "../../layout";
import { ModalBox } from "../../modal-box";
import { Regular } from "../../text";
import { AuthLayout } from "./auth-layout";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
      });
    }
  });

type FormFields = z.infer<typeof schema>;

export interface ResetPasswordScreenProps {
  authApi: AuthApi;
  onNavigateToSuccess: () => void;
}

export function ResetPasswordScreen({
  authApi,
  onNavigateToSuccess,
}: ResetPasswordScreenProps) {
  const { height } = useReanimatedKeyboardAnimation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<
      FormFields,
      any,
      FormFields
    >,
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordDto) => {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Resetting password...."
            description="Please wait! Your password is being reset"
          />
        ),
      });
      try {
        return await authApi.authControllerForgotPassword({
          forgotPasswordDto: data,
        });
      } catch (error) {
        ModalBox.hide();
        throw await processApiError(error, "Failed to reset password");
      }
    },
    onSuccess: () => {
      ModalBox.hide();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Password Reset"
            description="Your password has been reset successfully. You can now sign in with your new password."
            icon="double-ticks"
            buttonLabel="Go to Sign In"
            onPress={() => {
              ModalBox.hide();
              onNavigateToSuccess();
            }}
          />
        ),
      });
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      resetPasswordMutation.reset();
      await resetPasswordMutation.mutateAsync({
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
    },
    [resetPasswordMutation],
  );

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(height.value) }],
    };
  });

  return (
    <Fill backgroundColor="Bg Color">
      <AuthLayout title="Reset Password" description="Enter new password">
        <Container gap={14}>
          <FormInput
            label="Password"
            control={control}
            name="newPassword"
            placeholder="Enter your password"
            secureTextEntry
            icon="lock"
            error={errors.newPassword?.message}
          />
          <FormInput
            label="Confirm Password"
            control={control}
            name="confirmNewPassword"
            placeholder="Enter your password"
            secureTextEntry
            icon="lock"
            error={errors.confirmNewPassword?.message}
          />
          {resetPasswordMutation.error && (
            <Regular color="Secondary/600" fontSize={14}>
              {resetPasswordMutation.error.message}
            </Regular>
          )}
        </Container>
      </AuthLayout>
      <AnimatedContainer
        px={20}
        pb={20}
        pt={2}
        backgroundColor="Bg Color"
        style={animationStyle}
      >
        <Button
          label="Reset"
          variant="primary"
          isLoading={resetPasswordMutation.isPending}
          radius="rounded"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
      </AnimatedContainer>
    </Fill>
  );
}
