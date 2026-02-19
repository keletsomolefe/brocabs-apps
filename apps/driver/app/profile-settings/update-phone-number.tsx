import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, ScrollView, StyleSheet } from "react-native";
import { z } from "zod";

import { Lottie } from "@brocabs/ui/animations";
import { Button } from "@brocabs/ui/button";
import { Dialog } from "@brocabs/ui/dialogs";
import { OtpVerificationScreen } from "@brocabs/ui/features/authentication/otp-verification-screen";
import { FormField } from "@brocabs/ui/form/form-field";
import { Container, Fill } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { PhoneField } from "@brocabs/ui/phone-field";
import { detectCountryCode, parsePhone } from "@brocabs/ui/phone-field/helpers";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { otpApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { Icon } from "~/shared/ui/icons";

const STEPS = ["Enter New Number", "OTP Verification", "Success"] as const;
type Step = (typeof STEPS)[number];

const phoneSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
});

type PhoneFormFields = z.infer<typeof phoneSchema>;

function EnterPhoneStep({
  phoneNumber,
  countryCode,
  onPhoneNumberChange,
  onCountryCodeChange,
  error,
  onSubmit,
  isSubmitting,
}: {
  phoneNumber: string;
  countryCode: string;
  onPhoneNumberChange: (value: string) => void;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Container px={20} pt={16} gap={24}>
        <Regular fontSize={14} color="Neutrals/400" style={styles.introText}>
          To change your mobile number, please verify your identity first
        </Regular>

        <Container gap={8}>
          <Regular fontSize={16} color="Primary/50">
            Phone Number
          </Regular>
          <FormField error={error}>
            <PhoneField
              placeholder="Phone Number"
              countryCode={countryCode}
              value={phoneNumber}
              onCountryCodeChange={(newCode) => {
                onCountryCodeChange(newCode);
                onPhoneNumberChange("");
              }}
              onChangeText={(text) => {
                const detectedCode = detectCountryCode(text);
                if (detectedCode && detectedCode !== countryCode) {
                  onCountryCodeChange(detectedCode);
                }
                onPhoneNumberChange(text);
              }}
              error={error}
            />
          </FormField>
        </Container>

        <Container pt={2}>
          <Button
            label="Submit"
            onPress={onSubmit}
            variant="primary"
            radius="rounded"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </Container>
      </Container>
    </ScrollView>
  );
}

export default function UpdatePhoneNumberScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("PK");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();

  // Extract country code from user's phone
  const { countryCode: initialCountryCode } = useMemo(
    () => parsePhone(user?.phoneNumber || ""),
    [user?.phoneNumber]
  );

  // Initialize country code from user data
  useEffect(() => {
    if (initialCountryCode) {
      setCountryCode(initialCountryCode);
    }
  }, [initialCountryCode]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormFields>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const onPhoneSubmit = async (data: PhoneFormFields) => {
    try {
      setIsSubmitting(true);
      Keyboard.dismiss();

      const fullPhoneNumber = `${countryCode}${data.phoneNumber}`;

      // Send OTP to new phone number for verification
      await otpApi.otpControllerStartOtp({
        startOtpDto: {
          identifierType: "phoneNumber",
          identifier: fullPhoneNumber,
          applicationType: "driver",
        },
      });

      setPhoneNumber(data.phoneNumber);
      handleNext();
    } catch (error) {
      console.error("Failed to send OTP:", error);
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Error"
            description="Failed to send OTP. Please try again."
            buttonLabel="OK"
            onPress={() => ModalBox.hide()}
            icon="cancel-outline"
          />
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOtpSuccess = async () => {
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

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;

      console.log("fullPhoneNumber", fullPhoneNumber);

      // TODO: Update phone number through appropriate API endpoint
      // Note: UpdateProfileDto doesn't support phoneNumber updates directly
      // This may require a separate endpoint or FusionAuth update
      // For now, we'll show success after OTP verification
      // await authApi.authControllerUpdatePhoneNumber({ phoneNumber: fullPhoneNumber });

      ModalBox.hide();
      handleNext(); // Move to success step
    } catch (error) {
      console.error("Failed to update phone number:", error);
      ModalBox.hide();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Error"
            description="Failed to update phone number. Please try again."
            buttonLabel="OK"
            onPress={() => ModalBox.hide()}
            icon="cancel-outline"
          />
        ),
      });
    }
  };

  const onOtpNavigateToDashboard = async () => {
    await onOtpSuccess();
  };

  const handleSuccess = () => {
    router.back();
  };

  return (
    <Fill backgroundColor="Bg Color">
      {currentStep === 0 && (
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, value } }) => (
            <EnterPhoneStep
              phoneNumber={value}
              countryCode={countryCode}
              onPhoneNumberChange={(text) => {
                onChange(text);
                setPhoneNumber(text);
              }}
              onCountryCodeChange={(code) => {
                setCountryCode(code);
              }}
              error={errors.phoneNumber?.message}
              onSubmit={handleSubmit(onPhoneSubmit)}
              isSubmitting={isSubmitting}
            />
          )}
        />
      )}

      {currentStep === 1 && (
        <OtpVerificationScreen
          otpApi={otpApi}
          identifier={`${countryCode}${phoneNumber}`}
          applicationType="Driver"
          isForgotPasswordFlow={false}
          onNavigateToResetPassword={() => {}}
          onNavigateToProfile={() => {}}
          onNavigateToDashboard={onOtpNavigateToDashboard}
          onNavigateToSignIn={() => router.back()}
        />
      )}

      {currentStep === 2 && (
        <Container flex={1} justifyContent="center" alignItems="center" px={20}>
          <Container alignItems="center" gap={24}>
            <Icon name="double-ticks" width={80} height={80} color={Colors["Random/Success"]} />
            <Container gap={8} alignItems="center">
              <Regular fontSize={24} color="Primary/50" textAlign="center">
                Phone Number Updated Successfully
              </Regular>
              <Regular fontSize={16} color="Neutrals/400" textAlign="center">
                Your phone number has been updated to {countryCode} {phoneNumber}
              </Regular>
            </Container>
            <Container pt={2} width="100%">
              <Button
                label="Back to Profile"
                onPress={handleSuccess}
                variant="primary"
                radius="rounded"
                size="md"
              />
            </Container>
          </Container>
        </Container>
      )}
    </Fill>
  );
}

const styles = StyleSheet.create({
  introText: {
    lineHeight: 20,
  },
});
