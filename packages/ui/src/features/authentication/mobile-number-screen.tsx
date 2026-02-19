import {
  ApplicationType,
  MutationKeys,
  OtpApi,
  processApiError,
  StartOtpDtoIdentifierTypeEnum,
} from "@brocabs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getLocales } from "expo-localization";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { Regular } from "../../text";
import { AuthLayout } from "./auth-layout";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const schema = z.object({
  mobileNumber: z.string().min(1, "Mobile number is required"),
});

type FormFields = z.infer<typeof schema>;

interface MobileNumberScreenProps {
  otpApi: OtpApi;
  applicationType?: ApplicationType;
}

export function MobileNumberScreen({
  otpApi,
  applicationType = ApplicationType.Rider,
}: MobileNumberScreenProps) {
  const { action } = useLocalSearchParams<{ action?: string | string[] }>();
  const locales = getLocales();
  const defaultCountryCode = getCountryCode(locales);
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const { height, progress } = useReanimatedKeyboardAnimation();
  
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
  const insets = useSafeAreaInsets();

  const mobileNumber = watch("mobileNumber");

  const startOtpMutation = useMutation({
    mutationKey: [MutationKeys.START_OTP],
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
            applicationType,
          },
        });
      } catch (error) {
        throw await processApiError(error, "Failed to start OTP process");
      }
    },
    onSettled: () => {
      ModalBox.hide();
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

      await startOtpMutation.mutateAsync(e164);

      router.push({
        pathname: "/(auth)/mobile-verification",
        params: {
          mobileNumber: e164,
        },
      });
    },
    [countryCode, setError, startOtpMutation],
  );

  const handleCountryCodeChange = useCallback(
    (newCountryCode: string) => {
      setCountryCode(newCountryCode);
      setValue("mobileNumber", "");
      trigger("mobileNumber");
    },
    [trigger, setValue],
  );

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(height.value) }],
      paddingBottom: interpolate(
        progress.value,
        [0, 1],
        [20 + insets.bottom, 20],
      ),
    };
  });

  const isLoginAction = action === "login";

  return (
    <Fill backgroundColor="Bg Color">
      <AuthLayout
        title="Continue with Phone Number"
        description={`Enter your phone number to ${
          isLoginAction ? "Sign in" : "Sign up"
        } your account`}
      >
        <Container pt={20}>
          <FormPhoneInput
            name="mobileNumber"
            label="Phone Number"
            control={control}
            placeholder="Enter your mobile number"
            error={
              (isSubmitted ? errors.mobileNumber?.message : undefined) ||
              startOtpMutation.error?.message
            }
            autoFocus
            onCountryCodeChange={handleCountryCodeChange}
            countryCode={countryCode ?? ""}
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
        </Container>
      </AuthLayout>
      <AnimatedContainer
        px={20}
        pt={2}
        gap={16}
        backgroundColor="Bg Color"
        style={animationStyle}
      >
        <Button
          label="Continue"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          radius="rounded"
          isLoading={startOtpMutation.isPending}
          disabled={startOtpMutation.isPending || !isValid}
        />
        {!isLoginAction && (
          <Container>
            <Regular center fontSize={16} color="Primary/50">
              Already have an account?
              <Regular
                color="Primary/400"
                fontSize={16}
                onPress={() => router.push("/(auth)")}
              >
                {" "}
                Sign In
              </Regular>
            </Regular>
          </Container>
        )}
      </AnimatedContainer>
    </Fill>
  );
}
