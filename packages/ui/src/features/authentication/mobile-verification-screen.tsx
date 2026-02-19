import {
  MutationKeys,
  OtpApi,
  VerifyOtpResponseDtoDataNextStepEnum,
  processApiError,
} from "@brocabs/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  Dimensions,
  InteractionManager,
  Platform,
  StyleSheet,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
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
import { ColorName, Colors } from "../../theme/colors";
import { AuthLayout } from "./auth-layout";

const CELL_COUNT = 6;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const AnimatedContainer = Animated.createAnimatedComponent(Container);

export interface MobileVerificationScreenProps {
  otpApi: OtpApi;
  mobileNumber?: string;
  isForgotPasswordFlow?: boolean;
  onNavigateToResetPassword: (mobileNumber?: string) => void;
  onNavigateToProfile: (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => void;
  onNavigateToDashboard: () => Promise<void>;
}

export function MobileVerificationScreen({
  otpApi,
  mobileNumber,
  isForgotPasswordFlow,
  onNavigateToResetPassword,
  onNavigateToProfile,
  onNavigateToDashboard,
}: MobileVerificationScreenProps) {
  const [otpValue, setOtpValue] = useState("");
  const [touched, setTouched] = useState(false);
  const { height } = useReanimatedKeyboardAnimation();

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
        return await otpApi.otpControllerVerifyOtp({
          verifyOtpDto: { code: otp, identifier: mobileNumber! },
        });
      } catch (error) {
        throw await processApiError(error, "Invalid OTP code");
      }
    },
    onSettled: () => {
      ModalBox.hide();
    },
  });

  const error = verifyOtpMutation.error;
  const ref = useBlurOnFulfill({ value: otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: handleOtpChange,
  });

  const handleOtpBlur = useCallback(() => {
    const canAutoSubmit = otpValue.length === CELL_COUNT;
    if (canAutoSubmit) {
      // Optional: Auto-submit logic
    }
  }, [otpValue]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(height.value) }],
    };
  });

  const onSubmit = useCallback(async () => {
    verifyOtpMutation.reset();
    await verifyOtpMutation.mutateAsync(otpValue, {
      onSuccess: async (result) => {
        if (
          result.data.nextStep ===
          VerifyOtpResponseDtoDataNextStepEnum.ResetPassword
        ) {
          setOtpValue("");
          ModalBox.hide();
          onNavigateToResetPassword(mobileNumber);
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
    mobileNumber,
    onNavigateToResetPassword,
    onNavigateToProfile,
    onNavigateToDashboard,
  ]);

  const showError = error && !touched;
  const renderOtpCell = ({ index, symbol, isFocused }: any) => (
    <Container
      key={index}
      style={[
        styles.cell,
        isFocused && styles.focusCell,
        showError && styles.errorCell,
      ]}
      borderColor={
        showError
          ? Colors["Secondary/600"]
          : isFocused
          ? Colors["Primary/600"]
          : Colors["Input Color"]
      }
      backgroundColor={Colors["Input Color"] as ColorName}
      onLayout={getCellOnLayoutHandler(index)}
    >
      <Regular color="black" fontSize={20}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Regular>
    </Container>
  );

  return (
    <Fill backgroundColor="Bg Color">
      <AuthLayout
        title="Enter code"
        description={
          <Regular color="black" fontSize={16} lineHeight={24}>
            We sent a verification code to your phone number{" "}
            <Regular color="Primary/600" fontSize={16} lineHeight={24}>
              {mobileNumber}
            </Regular>
          </Regular>
        }
      >
        <Container gap={16}>
          <Container mt={3}>
            <Container alignItems="center">
              <CodeField
                ref={ref}
                {...props}
                value={otpValue}
                onChangeText={handleOtpChange}
                autoFocus
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                onBlur={handleOtpBlur}
                autoComplete={
                  Platform.OS === "android" ? "sms-otp" : "one-time-code"
                }
                renderCell={renderOtpCell}
              />
            </Container>
            {showError && error && (
              <Regular
                color="Secondary/600"
                style={styles.errorText}
                fontSize={16}
              >
                {error.message}
              </Regular>
            )}
          </Container>
          <Regular color="black">
            Didn&apos;t receive a code?{" "}
            <Regular color="Primary/600">Resend Code</Regular>
          </Regular>
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
        />
        {!isForgotPasswordFlow && (
          <Container>
            <Regular center fontSize={16}>
              Already have an account?
              <Regular color="Primary/600" fontSize={16}>
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

const styles = StyleSheet.create({
  focusCell: {
    borderColor: Colors["black-400"],
  },
  cell: {
    width: (SCREEN_WIDTH - 90) / CELL_COUNT,
    height: (SCREEN_WIDTH - 90) / CELL_COUNT,
    borderWidth: 2,
    backgroundColor: Colors["Input Color"],
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  errorCell: {
    borderColor: Colors["Danger/600"],
  },
  errorText: {
    marginTop: 4,
  },
});
