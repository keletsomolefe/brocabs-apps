import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { useUser } from "~/hooks/use-auth";
import { navigateBasedOnSession } from "~/utils/session-navigation";

import { Button } from "@brocabs/ui/button";
import { AuthLayout } from "@brocabs/ui/features/authentication/auth-layout";
import { Container, Fill } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { fileSchema } from "~/constants";
import { FormIDPicker } from "~/shared/ui/form/form-id-picker";

import {
  FileControllerGetUploadUrlFileTypeEnum,
  UploadDocumentDtoDocumentTypeEnum,
} from "@brocabs/client";
import { uploadFile } from "@brocabs/ui";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { ModalBox } from "@brocabs/ui/modal-box";
import { filesApi, profilesApi } from "~/api";

const schema = z.object({
  nationalIdOrPassport: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "National ID or Passport is required",
  }),
  drivingLicense: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "Driving License is required",
  }),
  licenseDisk: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "License Disk is required",
  }),
  insurance: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "Insurance is required",
  }),
  selfieWithId: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "Selfie holding ID is required",
  }),
  nationalIdOrPassportDate: z.date().optional(),
  drivingLicenseDate: z.date().optional(),
  insuranceDate: z.date().optional(),
  licenseDiskDate: z.date().optional(),
});

type FormFields = z.infer<typeof schema>;

const DOCUMENT_TYPE_MAP: Record<string, FileControllerGetUploadUrlFileTypeEnum> = {
  nationalIdOrPassport: FileControllerGetUploadUrlFileTypeEnum.NationalId,
  drivingLicense: FileControllerGetUploadUrlFileTypeEnum.DriverLicense,
  licenseDisk: FileControllerGetUploadUrlFileTypeEnum.VehicleRegistration,
  insurance: FileControllerGetUploadUrlFileTypeEnum.VehicleInsurance,
  selfieWithId: FileControllerGetUploadUrlFileTypeEnum.SelfieWithId,
};

const DOCUMENT_UPLOAD_TYPE_MAP: Record<string, UploadDocumentDtoDocumentTypeEnum> = {
  nationalIdOrPassport: UploadDocumentDtoDocumentTypeEnum.NationalId,
  drivingLicense: UploadDocumentDtoDocumentTypeEnum.DriverLicense,
  licenseDisk: UploadDocumentDtoDocumentTypeEnum.VehicleRegistration,
  insurance: UploadDocumentDtoDocumentTypeEnum.VehicleInsurance,
  selfieWithId: UploadDocumentDtoDocumentTypeEnum.SelfieWithId,
};

type DocumentFieldKey =
  | "nationalIdOrPassport"
  | "drivingLicense"
  | "licenseDisk"
  | "insurance"
  | "selfieWithId";

interface DocumentUploadInfo {
  key: DocumentFieldKey;
  fileName: string;
  fileType: FileControllerGetUploadUrlFileTypeEnum;
  filePath: string;
  expirationDate?: string;
}

interface DocumentField {
  key: DocumentFieldKey;
  label: string;
  hasDatePicker?: boolean;
}

const DOCUMENT_FIELDS: DocumentField[] = [
  { key: "nationalIdOrPassport", label: "National ID or Passport" },
  { key: "drivingLicense", label: "Driving License", hasDatePicker: true },
  { key: "insurance", label: "Insurance", hasDatePicker: true },
  { key: "licenseDisk", label: "License Disk" },
  { key: "selfieWithId", label: "Selfie holding ID in hand" },
];

export default function DriverDocumentsScreen() {
  const { refetch, data: user } = useUser({ enabled: false });
  const insets = useSafeAreaInsets();

  // Check if application was rejected
  const stateData = user?.state?.data as any;
  const isRejected = stateData?.onboardingStatus === "REJECTED";
  const rejectionReasons = stateData?.rejectionReasons || [];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<FormFields, any, FormFields>,
    mode: "onChange",
    defaultValues: {
      nationalIdOrPassport: null,
      drivingLicense: null,
      licenseDisk: null,
      insurance: null,
      selfieWithId: null,
      nationalIdOrPassportDate: undefined,
      drivingLicenseDate: undefined,
      insuranceDate: undefined,
      licenseDiskDate: undefined,
    },
  });

  const onSubmit = useCallback(
    async (data: FormFields) => {
      try {
        ModalBox.show("popup", {
          content: (
            <Dialog.Loader
              source={Lottie.loader}
              title="Uploading...."
              description="Uploading documents..."
            />
          ),
        });

        // 1. Build file map with all documents to upload
        const documentsToUpload: DocumentUploadInfo[] = [];

        for (const field of DOCUMENT_FIELDS) {
          const key = field.key;
          const file = data[key] as { fileName: string; filePath: string } | null;
          if (!file?.filePath) continue;

          const dateKey = `${key}Date` as keyof FormFields;
          const dateValue = data[dateKey];
          const expirationDate = dateValue instanceof Date ? dateValue.toISOString() : undefined;

          documentsToUpload.push({
            key,
            fileName: file.fileName,
            fileType: DOCUMENT_TYPE_MAP[key],
            filePath: file.filePath,
            expirationDate,
          });
        }

        // 2. Get all upload URLs in parallel
        const uploadUrlResponses = await Promise.all(
          documentsToUpload.map((doc) =>
            filesApi.fileControllerGetUploadUrl({
              fileName: doc.fileName,
              fileType: doc.fileType,
            })
          )
        );

        // 3. Upload all files in parallel
        await Promise.all(
          documentsToUpload.map((doc, index) =>
            uploadFile(doc.filePath, uploadUrlResponses[index].uploadUri)
          )
        );

        // 4. Notify backend for all documents in parallel
        await Promise.all(
          documentsToUpload.map((doc, index) =>
            profilesApi.driverProfileControllerUploadDocument({
              uploadDocumentDto: {
                documentType: DOCUMENT_UPLOAD_TYPE_MAP[doc.key],
                file: {
                  storagePath: uploadUrlResponses[index].storagePath,
                  filename: doc.fileName,
                },
                expirationDate: doc.expirationDate,
              },
            })
          )
        );

        const { data: session } = await refetch();
        ModalBox.hide();
        navigateBasedOnSession(session);
      } catch (e) {
        console.error(e);
        ModalBox.hide();
      }
    },
    [refetch]
  );

  return (
    <Fill backgroundColor="Neutrals/50">
      <AuthLayout
        description={
          <Regular color="black-500" fontSize={18} lineHeight={24}>
            Use clear photos or PDFs. Recommended dimensions: 1600×1200 or 2MB max per file.
          </Regular>
        }>
        <Container gap={20} pt={20} pb={insets.bottom + 20}>
          {/* Show rejection notice if application was rejected */}
          {isRejected && rejectionReasons.length > 0 && (
            <Container backgroundColor="Secondary/50" borderRadius={12} px={16} py={12} gap={8}>
              <Bold fontSize={16} color="Secondary/600">
                Application Rejected
              </Bold>
              <Regular fontSize={14} color="Secondary/600" lineHeight={20}>
                Please fix the following issues and resubmit:
              </Regular>
              <Container pl={12} gap={4}>
                {rejectionReasons.map((reason: string, index: number) => (
                  <Container key={index} flexDirection="row" gap={8}>
                    <Regular fontSize={14} color="Secondary/600">
                      •
                    </Regular>
                    <Regular fontSize={14} color="Secondary/600" flex={1} lineHeight={20}>
                      {reason}
                    </Regular>
                  </Container>
                ))}
              </Container>
            </Container>
          )}

          {DOCUMENT_FIELDS.map((field) => (
            <Controller
              key={field.key}
              name={field.key}
              control={control}
              render={({ field: formField }) => (
                <Controller
                  key={`${field.key}-date`}
                  name={`${field.key}Date` as any}
                  control={control}
                  render={({ field: dateField }) => (
                    <FormIDPicker
                      label={field.label}
                      error={isSubmitted ? errors[field.key]?.message : undefined}
                      onChange={formField.onChange}
                      value={formField.value}
                      errorBorderOnly={false}
                      hasDatePicker={field.hasDatePicker}
                      date={dateField.value}
                      onDateChange={dateField.onChange}
                    />
                  )}
                />
              )}
            />
          ))}

          <Button
            label="Upload & Continue"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
          />
        </Container>
      </AuthLayout>
    </Fill>
  );
}
