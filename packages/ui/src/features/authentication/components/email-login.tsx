import {
  AuthApi,
  LoginDtoApplicationTypeEnum,
  LoginDtoIdentifierTypeEnum,
  MutationKeys,
  processApiError,
  VerifyOtpResponseDtoDataNextStepEnum,
} from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { InteractionManager } from "react-native";
import { z } from "zod";

import { Lottie } from "../../../animations";
import { Button } from "../../../button";
import { Dialog } from "../../../dialogs";
import { FormCheckbox } from "../../../form/form-checkbox";
import { FormDivider } from "../../../form/form-divider";
import { FormInput } from "../../../form/form-input";
import { Container, Row } from "../../../layout";
import { ModalBox } from "../../../modal-box";
import { Regular } from "../../../text";

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type FormFields = z.infer<typeof schema>;

interface EmailLoginProps {
  authApi: AuthApi;
  applicationType: LoginDtoApplicationTypeEnum;
  onLoginSuccess: () => Promise<void>;
  onNavigateToProfile: (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  isFocused?: boolean;
}

export function EmailLogin({
  authApi,
  applicationType,
  onLoginSuccess,
  onNavigateToProfile,
  onForgotPassword,
  onRegister,
  isFocused,
}: EmailLoginProps) {
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
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationKey: [MutationKeys.LOGIN],
    mutationFn: async (data: { identifier: string; password: string }) => {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Logging in..."
            description="Please wait while we verify your credentials"
          />
        ),
      });
      try {
        return await authApi.loginControllerLogin({
          loginDto: {
            applicationType: applicationType,
            identifier: data.identifier,
            password: data.password,
            identifierType: LoginDtoIdentifierTypeEnum.Email,
          },
        });
      } catch (error) {
        throw await processApiError(error, "Login failed");
      }
    },
    onSettled: () => {
      ModalBox.hide();
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      loginMutation.reset();
      const email = data.email.trim();

      await loginMutation.mutateAsync(
        { identifier: email, password: data.password },
        {
          onSuccess: async (result) => {
            if (
              result.data.nextStep ===
                VerifyOtpResponseDtoDataNextStepEnum.RegisterUser ||
              result.data.nextStep ===
                VerifyOtpResponseDtoDataNextStepEnum.RegisterProfile
            ) {
              ModalBox.show("popup", {
                content: (
                  <Dialog.Confirmation
                    title="Congratulations"
                    description="Your account is ready to use. Before we redirect you home, please set up your profile."
                    icon="double-ticks"
                    onPress={() => {
                      ModalBox.hide();
                      InteractionManager.runAfterInteractions(() => {
                        onNavigateToProfile(result.data.nextStep);
                      });
                    }}
                  />
                ),
              });
              return;
            }

            if (
              result.data.nextStep ===
              VerifyOtpResponseDtoDataNextStepEnum.Dashboard
            ) {
              await onLoginSuccess();
            }
          },
        },
      );
    },
    [loginMutation, onLoginSuccess, onNavigateToProfile],
  );

  return (
    <Container mt={24}>
      <Container gap={20}>
        <FormInput
          icon="message"
          name="email"
          label="Email"
          control={control}
          autoFocus={isFocused}
          placeholder="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          error={
            (isSubmitted ? errors.email?.message : undefined) ||
            loginMutation.error?.message
          }
          errorBorderOnly={Boolean(loginMutation.error?.message)}
        />
        <FormInput
          icon="lock"
          name="password"
          label="Password"
          control={control}
          placeholder="Enter your password"
          secureTextEntry
          returnKeyType="done"
          autoComplete="password"
          textContentType="password"
          error={
            (isSubmitted ? errors.password?.message : undefined) ||
            loginMutation.error?.message
          }
          errorBorderOnly={Boolean(loginMutation.error?.message)}
        />
      </Container>

      {loginMutation.error?.message && (
        <Container mt={10}>
          <Regular color="Secondary/600" fontSize={16}>
            {loginMutation.error?.message}
          </Regular>
        </Container>
      )}

      <Container mt={16}>
        <Row alignItems="center" justifyContent="space-between">
          <FormCheckbox
            name="rememberMe"
            control={control}
            label="Keep me logged in"
          />
          {onForgotPassword && (
            <Regular
              color="Primary/600"
              fontSize={14}
              style={{ textDecorationLine: "underline" }}
              onPress={onForgotPassword}
            >
              Forgot Password?
            </Regular>
          )}
        </Row>
      </Container>

      <Container mt={20} gap={20}>
        <Button
          label="Sign In"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          radius="rounded"
          isLoading={loginMutation.isPending}
          disabled={loginMutation.isPending}
        />
        <FormDivider label="Or" />
        <Regular color="Primary/50" fontSize={14} textAlign="center">
          Don&apos;t have an account?{" "}
          {onRegister && (
            <Regular color="Primary/600" fontSize={14} onPress={onRegister}>
              Sign Up
            </Regular>
          )}
        </Regular>
      </Container>
    </Container>
  );
}
