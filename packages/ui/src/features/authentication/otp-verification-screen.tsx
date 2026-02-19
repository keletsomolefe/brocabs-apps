import {
  MutationKeys,
  OtpApi,
  StartOtpDtoForEnum,
  StartOtpDtoIdentifierTypeEnum,
  VerifyOtpResponseDtoDataNextStepEnum,
  processApiError,
} from "@brocabs/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { InteractionManager } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Lottie } from "../../animations";
import { Button } from "../../button";
import { Dialog } from "../../dialogs";
import { Container, Fill } from "../../layout";
import { ModalBox } from "../../modal-box";
import { Regular } from "../../text";
import { AuthLayout } from "./auth-layout";
import { OtpInput } from "./components/otp-input";

const AnimatedContainer = Animated.createAnimatedComponent(Container);

const RESEND_COOLDOWN = 35; // seconds

export interface OtpVerificationScreenProps {
  otpApi: OtpApi;
  identifier?: string;
  applicationType: string;
  isForgotPasswordFlow?: boolean;
  onNavigateToResetPassword: (identifier?: string) => void;
  onNavigateToProfile: (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => void;
  onNavigateToDashboard: () => Promise<void>;
  onNavigateToSignIn?: () => void;
}

export function OtpVerificationScreen({
  otpApi,
  identifier,
  applicationType,
  isForgotPasswordFlow,
  onNavigateToResetPassword,
  onNavigateToProfile,
  onNavigateToDashboard,
  onNavigateToSignIn,
}: OtpVerificationScreenProps) {
  const [otpValue, setOtpValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const { height } = useReanimatedKeyboardAnimation();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  const handleOtpChange = useCallback((text: string) => {
    setTouched(true);
    setOtpValue(text);
  }, []);

  const verifyOtpMutation = useMutation({
    mutationKey: [MutationKeys.VERIFY_OTP],
    mutationFn: async (otp: string) => {
      setTouched(false);
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Processing...."
            description="Please wait! Your action is under process"
          />
        ),
      });
      try {
        if (!identifier) {
          throw new Error("Identifier is required for OTP verification");
        }
        return await otpApi.otpControllerVerifyOtp({
          verifyOtpDto: { code: otp, identifier },
        });
      } catch (error) {
        throw await processApiError(error, "Invalid OTP code");
      }
    },
    onSettled: () => {
      ModalBox.hide();
    },
  });

  const resendOtpMutation = useMutation({
    mutationKey: [MutationKeys.START_OTP, "resend"],
    mutationFn: async () => {
      ModalBox.show("popup", {
        content: (
          <Dialog.Loader
            source={Lottie.loader}
            title="Resending code...."
            description="Please wait while we send you a new code"
          />
        ),
      });
      try {
        if (!identifier) {
          throw new Error("Identifier is required to resend OTP");
        }
        // Use the same API call as initial OTP request
        // This would need to be passed from parent or use stored params
        return await otpApi.otpControllerStartOtp({
          startOtpDto: {
            identifier,
            identifierType: identifier.includes("@")
              ? StartOtpDtoIdentifierTypeEnum.Email
              : StartOtpDtoIdentifierTypeEnum.PhoneNumber,
            applicationType: applicationType as any,
            _for: isForgotPasswordFlow
              ? StartOtpDtoForEnum.ForgotPassword
              : StartOtpDtoForEnum.SignIn,
          },
        });
      } catch (error) {
        throw await processApiError(error, "Failed to resend code");
      }
    },
    onSuccess: () => {
      setCountdown(RESEND_COOLDOWN);
      setIsResendEnabled(false);
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Code Sent"
            description={`A new verification code has been sent to your ${
              identifier?.includes("@") ? "email" : "phone number"
            }`}
            icon="double-ticks"
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    },
    onSettled: () => {
      ModalBox.hide();
    },
  });

  const error = verifyOtpMutation.error;

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(height.value) }],
    };
  });

  const onSubmit = useCallback(async () => {
    if (otpValue.length !== 6) return;

    verifyOtpMutation.reset();
    await verifyOtpMutation.mutateAsync(otpValue, {
      onSuccess: async (result) => {
        // Handle forgot password flow - navigate to reset password
        if (
          result.data.nextStep ===
          VerifyOtpResponseDtoDataNextStepEnum.ResetPassword
        ) {
          setOtpValue("");
          ModalBox.hide();
          onNavigateToResetPassword(identifier);
          return;
        }

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
                  setOtpValue("");
                  ModalBox.hide();

                  InteractionManager.runAfterInteractions(() => {
                    onNavigateToProfile(result.data.nextStep);
                  });
                }}
              />
            ),
          });
        }

        if (
          result.data.nextStep ===
          VerifyOtpResponseDtoDataNextStepEnum.Dashboard
        ) {
          await onNavigateToDashboard();
        }
      },
    });
  }, [
    verifyOtpMutation,
    otpValue,
    identifier,
    onNavigateToResetPassword,
    onNavigateToProfile,
    onNavigateToDashboard,
  ]);

  const handleResend = useCallback(() => {
    if (isResendEnabled && !resendOtpMutation.isPending) {
      resendOtpMutation.mutate();
    }
  }, [isResendEnabled, resendOtpMutation]);

  const showError = error && !touched;

  return (
    <Fill backgroundColor="Bg Color">
      <AuthLayout
        title="Enter Code"
        description={
          <Regular color="Neutrals/900" fontSize={16} lineHeight={24}>
            We sent a verification code to your{" "}
            {identifier?.includes("@") ? "email" : "phone number"}{" "}
            <Regular color="Primary/600" fontSize={16} lineHeight={24}>
              {identifier}
            </Regular>
          </Regular>
        }
      >
        <Container gap={24}>
          <Container>
            <OtpInput
              value={otpValue}
              onChange={handleOtpChange}
              error={!!showError}
              disabled={verifyOtpMutation.isPending}
            />
            {showError && error && (
              <Regular
                color="Secondary/600"
                style={{ marginTop: 8 }}
                fontSize={14}
              >
                {error.message}
              </Regular>
            )}
          </Container>

          <Container flexDirection="row" justifyContent="space-between">
            <Regular color="black" fontSize={14}>
              You didn&apos;t receive any code?{" "}
              <Regular
                color={isResendEnabled ? "Primary/400" : "Neutrals/400"}
                fontSize={14}
                onPress={handleResend}
              >
                Resend Code
              </Regular>
            </Regular>
            {!isResendEnabled && (
              <Regular color="Neutrals/400" fontSize={14}>
                00:{countdown.toString().padStart(2, "0")}
              </Regular>
            )}
          </Container>
        </Container>
      </AuthLayout>
      <AnimatedContainer
        px={20}
        pb={20}
        pt={2}
        gap={16}
        backgroundColor="Bg Color"
        style={animationStyle}
      >
        <Button
          label="Continue"
          variant="primary"
          isLoading={verifyOtpMutation.isPending}
          radius="rounded"
          onPress={onSubmit}
          disabled={otpValue.length !== 6}
        />
        {!isForgotPasswordFlow && onNavigateToSignIn && (
          <Container>
            <Regular center fontSize={16}>
              Already have an account?
              <Regular
                color="Primary/600"
                fontSize={16}
                onPress={onNavigateToSignIn}
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
