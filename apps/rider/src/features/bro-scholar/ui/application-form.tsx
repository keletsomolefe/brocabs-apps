import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import { FormIDPicker } from "~/shared/ui/form/form-id-picker";
import { FormInput } from "~/shared/ui/form/form-input";
import { BroScholarFormFields } from "../schema";
import { InstituteSelector } from "./institute-selector";
import { useTranslation } from "~/i18n/LocaleContext";

interface Props {
  control: Control<BroScholarFormFields>;
  errors: FieldErrors<BroScholarFormFields>;
  isSubmitted: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onSubmit?: () => void;
  showContinueButton?: boolean;
}

export function ApplicationForm({
  control,
  errors,
  isSubmitted,
  disabled = false,
  isLoading = false,
  onSubmit,
  showContinueButton = true,
}: Props) {
  const { t } = useTranslation();
  return (
    <Container px={20} gap={24} pt={32}>
      {/* Introduction Text */}
      <Regular fontSize={14} color="Neutrals/400" style={styles.introText}>
        {t("common.formIntro")}
      </Regular>

      {/* Student Name Input */}
      <FormInput
        control={control}
        name="studentName"
        innerLabel={t("common.studentName")}
        placeholder={t("common.namePlaceholder")}
        icon="profile-fill"
        error={isSubmitted ? errors.studentName?.message : undefined}
        required
        iconColor="white"
        iconBackgroundColor="Primary/400"
        editable={!disabled}
      />

      {/* Select Institute */}
      <Container gap={8}>
        <Controller
          control={control}
          name="institute"
          render={({ field: { onChange, value } }) => (
            <Container gap={8}>
              <InstituteSelector
                value={value || ""}
                placeholder={t("common.selectInstitute")}
                onChange={(val) => onChange(String(val))}
                error={isSubmitted ? errors.institute?.message : undefined}
                icon="institution"
                disabled={disabled}
              />
              {isSubmitted && errors.institute && (
                <Regular fontSize={12} color="Secondary/600">
                  {errors.institute.message}
                </Regular>
              )}
            </Container>
          )}
        />
      </Container>

      {/* Document Upload Sections */}
      <Container gap={16}>
        {/* Confirm Identity */}
        <Controller
          control={control}
          name="identityFile"
          render={({ field: { onChange, value } }) => (
            <FormIDPicker
              value={value}
              onChange={onChange}
              error={isSubmitted ? errors.identityFile?.message : undefined}
              required
              label={t("common.confirmIdentity")}
              description={t("common.scanFaceDesc")}
              buttonLabel={t("common.scan")}
              uploadButtonProps={{
                radius: "rounded",
                // @ts-ignore
                backgroundColor: Colors["Primary/100"],
              }}
              disabled={disabled}
            />
          )}
        />

        {/* Upload Student Card */}
        <Controller
          control={control}
          name="studentCardFile"
          render={({ field: { onChange, value } }) => (
            <FormIDPicker
              value={value}
              onChange={onChange}
              error={isSubmitted ? errors.studentCardFile?.message : undefined}
              required
              label={t("common.uploadStudentCard")}
              uploadButtonProps={{
                radius: "rounded",
                // @ts-ignore
                backgroundColor: Colors["Primary/100"],
              }}
              disabled={disabled}
            />
          )}
        />

        {/* Upload Selfie holding ID Card */}
        <Controller
          control={control}
          name="selfieFile"
          render={({ field: { onChange, value } }) => (
            <FormIDPicker
              value={value}
              onChange={onChange}
              error={isSubmitted ? errors.selfieFile?.message : undefined}
              required
              label={t("common.uploadSelfie")}
              uploadButtonProps={{
                radius: "rounded",
                // @ts-ignore
                backgroundColor: Colors["Primary/100"],
              }}
              disabled={disabled}
            />
          )}
        />
      </Container>

      {/* Continue Button */}
      {showContinueButton && onSubmit && (
        <Container pt={2}>
          <Button
            label={t("common.continue")}
            variant="primary"
            radius="rounded"
            size="md"
            onPress={onSubmit}
            isLoading={isLoading}
            disabled={disabled || isLoading}
          />
        </Container>
      )}

      {/* Footer Help Text */}
      <Text style={styles.helpText}>
        <Text style={styles.helpLink}>{t("common.needHelp")}</Text>
        {t("common.contactSupportDesc")}
        <Text style={styles.helpLink}>{t("common.help")}</Text>
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  introText: {
    lineHeight: 20,
  },
  helpText: {
    fontFamily: "BRHendrix-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: "#0A021A",
    textAlign: "center",
    marginTop: 8,
  },
  helpLink: {
    color: "#5500FF",
    textDecorationLine: "underline",
  },
});
