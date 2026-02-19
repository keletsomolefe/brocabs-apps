import {
  MutationKeys,
  OtpApi,
  StartOtpDtoForEnum,
  StartOtpDtoIdentifierTypeEnum,
  processApiError,
} from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getLocales } from "expo-localization";
import { useCallback, useState } from "react";
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
import { FormPhoneInput } from "../../form/form-phone-input";
import { Container, Fill } from "../../layout";
import { ModalBox } from "../../modal-box";
import {
  detectCountryCode,
  getCountryCode,
  getISOCountryCodeFromDialCode,
  parsePhone,
} from "../../phone-field/helpers";
import { AuthLayout } from "./auth-layout";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const schema = z.object({
  mobileNumber: z.string().min(1, "Phone number is required"),
});

type FormFields = z.infer<typeof schema>;

export interface ForgotPasswordScreenProps {
  otpApi: OtpApi;
  applicationType: string;
  onNavigateToVerification: (identifier: string) => void;
}

export function ForgotPasswordScreen({
  otpApi,
  applicationType,
  onNavigateToVerification,
}: ForgotPasswordScreenProps) {
  const locales = getLocales();
  const defaultDialCode = getCountryCode(locales);
  const [countryCode, setCountryCode] = useState(defaultDialCode ?? "+27");
  const { height } = useReanimatedKeyboardAnimation();
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    trigger,
    watch,
    formState: { errors, isValid, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<
      FormFields,
      any,
      FormFields
    >,
    mode: "onChange",
    defaultValues: {
      mobileNumber: "",
    },
  });

  const startOtpMutation = useMutation({
    mutationKey: [MutationKeys.START_OTP, "forgot-password"],
    mutationFn: async (formattedNumber: string) => {
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
        return await otpApi.otpControllerStartOtp({
          startOtpDto: {
            identifier: formattedNumber,
            identifierType: StartOtpDtoIdentifierTypeEnum.PhoneNumber,
            applicationType: applicationType as any,
            _for: StartOtpDtoForEnum.ForgotPassword,
          },
        });
      } catch (error) {
        throw await processApiError(error, "Failed to start OTP process");
      }
    },
    onSuccess: (_, formattedNumber) => {
      onNavigateToVerification(formattedNumber);
    },
    onError: (error: any) => {
      ModalBox.hide(); // Hide loader first
      const errorMessage =
        error?.message || "Failed to send OTP. Please try again.";
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Error"
            description={errorMessage}
            icon="cancel-outline"
            iconColor="#EF4444"
            buttonLabel="Try Again"
            onPress={() => {
              ModalBox.hide();
            }}
          />
        ),
      });
    },
    onSettled: () => {
      // Only hide if there's no error (error dialog will handle its own dismissal)
      if (!startOtpMutation.isError) {
        ModalBox.hide();
      }
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      startOtpMutation.reset();
      const phoneNumberInput = data.mobileNumber?.trim();
      if (!phoneNumberInput) {
        setError("mobileNumber", { message: "Phone number is required" });
        return;
      }

      const isoCountryCode = getISOCountryCodeFromDialCode(countryCode);
      const phoneNumber = parsePhone(phoneNumberInput, isoCountryCode);
      if (!phoneNumber?.isValid) {
        setError("mobileNumber", { message: "Invalid phone number" });
        return;
      }

      const formattedNumber = phoneNumber.e164;
      if (!formattedNumber) {
        setError("mobileNumber", { message: "Invalid phone number format" });
        return;
      }

      await startOtpMutation.mutateAsync(formattedNumber);
    },
    [countryCode, setError, startOtpMutation],
  );

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(height.value) }],
    };
  });

  const handleChangeNumber = useCallback(
    (number: string) => {
      setValue("mobileNumber", number);
      const detected = detectCountryCode(number);
      if (detected) {
        setCountryCode(detected);
      }

      if (isSubmitted) {
        trigger("mobileNumber");
      }
    },
    [setValue, isSubmitted, trigger, setCountryCode],
  );

  return (
    <Fill backgroundColor="Bg Color">
      <AuthLayout
        title="Forgot Password"
        description="Enter your number for the verification process, we will send a 6-digit code to your number"
      >
        <Container gap={14}>
          <FormPhoneInput
            label="Phone Number"
            control={control}
            name="mobileNumber"
            countryCode={countryCode ?? ""}
            onCountryCodeChange={setCountryCode}
            onChangeText={handleChangeNumber}
            placeholder="345 3250 378"
            error={errors.mobileNumber?.message}
          />
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
          label="Continue"
          variant="primary"
          isLoading={startOtpMutation.isPending}
          radius="rounded"
          disabled={!isValid}
          onPress={handleSubmit(onSubmit)}
        />
      </AnimatedContainer>
    </Fill>
  );
}
