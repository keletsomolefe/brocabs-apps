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
import { getLocales } from "expo-localization";
import { useCallback, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { InteractionManager } from "react-native";
import { z } from "zod";

import { Lottie } from "../../../animations";
import { Button } from "../../../button";
import { Dialog } from "../../../dialogs";
import { FormCheckbox } from "../../../form/form-checkbox";
import { FormDivider } from "../../../form/form-divider";
import { FormInput } from "../../../form/form-input";
import {
  FormPhoneInput,
  FormPhoneInputHandle,
} from "../../../form/form-phone-input";
import { Container, Row } from "../../../layout";
import { ModalBox } from "../../../modal-box";
import {
  detectCountryCode,
  getCountryCode,
  getISOCountryCodeFromDialCode,
  parsePhone,
} from "../../../phone-field/helpers";
import { Regular } from "../../../text";

const schema = z.object({
  mobileNumber: z.string().min(1, "Mobile number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormFields = z.infer<typeof schema>;

interface PhoneLoginProps {
  authApi: AuthApi;
  applicationType: LoginDtoApplicationTypeEnum;
  onLoginSuccess: () => Promise<void>;
  onNavigateToProfile: (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  inputRef?: React.RefObject<FormPhoneInputHandle | null>;
  isFocused?: boolean;
}

export function PhoneLogin({
  authApi,
  applicationType,
  onLoginSuccess,
  onNavigateToProfile,
  onForgotPassword,
  onRegister,
  inputRef,
  isFocused,
}: PhoneLoginProps) {
  const locales = getLocales();
  const defaultCountryCode = getCountryCode(locales) ?? "ZA";
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<
      FormFields,
      any,
      FormFields
    >,
    mode: "onChange",
    defaultValues: {
      mobileNumber: "",
      password: "",
    },
  });

  const mobileNumber = watch("mobileNumber");

  const handleCountryCodeChange = useCallback(
    (newCountryCode: string) => {
      setCountryCode(newCountryCode);
      setValue("mobileNumber", "");
      trigger("mobileNumber");
    },
    [trigger, setValue],
  );

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
            identifierType: LoginDtoIdentifierTypeEnum.PhoneNumber,
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
      const phoneNumberInput = data.mobileNumber?.trim();
      if (!phoneNumberInput) {
        setError("mobileNumber", { message: "Phone number is required" });
        return;
      }

      if (!countryCode) {
        setError("mobileNumber", { message: "Please select a country" });
        return;
      }

      const isoCountryCode = getISOCountryCodeFromDialCode(countryCode);
      const { isValid, e164 } = parsePhone(phoneNumberInput, isoCountryCode);

      if (!isValid || !e164) {
        setError("mobileNumber", { message: "Invalid mobile number" });
        return;
      }

      await loginMutation.mutateAsync(
        { identifier: e164, password: data.password },
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
    [loginMutation, countryCode, setError, onLoginSuccess, onNavigateToProfile],
  );

  return (
    <Container mt={24}>
      <Container gap={20}>
        <FormPhoneInput
          ref={inputRef}
          name="mobileNumber"
          autoFocus={isFocused}
          label="Phone Number"
          control={control}
          placeholder="345 3250 378"
          error={
            (isSubmitted ? errors.mobileNumber?.message : undefined) ||
            loginMutation.error?.message
          }
          onCountryCodeChange={handleCountryCodeChange}
          countryCode={countryCode ?? ""}
          errorBorderOnly={Boolean(loginMutation.error?.message)}
          showCountryCodeInSelection={!mobileNumber?.startsWith("+")}
          onChangeText={(text) => {
            if (!text) {
              setCountryCode(defaultCountryCode);
              return;
            }
            const detectedCode = detectCountryCode(text);
            if (detectedCode && detectedCode !== countryCode) {
              setCountryCode(detectedCode);
            }
          }}
        />
        <FormInput
          name="password"
          label="Password"
          control={control}
          icon="lock"
          placeholder="Enter your password"
          error={
            (isSubmitted ? errors.password?.message : undefined) ||
            loginMutation.error?.message
          }
          returnKeyType="done"
          secureTextEntry
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
