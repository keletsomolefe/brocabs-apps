import {
  CreateBroScholarApplicationDto,
  FileControllerGetUploadUrlFileTypeEnum,
} from "@brocabs/client";
import { uploadFile } from "@brocabs/ui";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { ModalBox } from "@brocabs/ui/modal-box";
import { useMutation } from "@tanstack/react-query";
import { broScholarApi, filesApi } from "~/api";

export type BroScholarApplicationFormMock = {
  studentName: string;
  institute: string;
  identityFile: { fileName: string; filePath: string } | null;
  studentCardFile: { fileName: string; filePath: string } | null;
  selfieFile: { fileName: string; filePath: string } | null;
};

export const useBroSCLRApplication = () => {
  return useMutation({
    mutationFn: async (data: BroScholarApplicationFormMock) => {
      try {
        ModalBox.show("popup", {
          content: (
            <Dialog.Loader
              source={Lottie.loader}
              title="Submitting...."
              description="Uploading documents and creating application..."
            />
          ),
        });

        // 1. Prepare files to upload
        // Map form fields to backend expected structure and file types
        const filesToUpload = [
          {
            file: data.identityFile,
            type: FileControllerGetUploadUrlFileTypeEnum.StudentFaceImage,
            field: "studentFaceImage",
          },
          {
            file: data.studentCardFile,
            type: FileControllerGetUploadUrlFileTypeEnum.StudentCard,
            field: "studentCard",
          },
          {
            file: data.selfieFile,
            type: FileControllerGetUploadUrlFileTypeEnum.SelfieWithStudentCard,
            field: "selfieWithStudentCard",
          },
        ];

        // 2. Get upload URLs
        const uploadPromises = filesToUpload.map((item) => {
          if (!item.file?.filePath) {
            throw new Error(`File for ${item.field} is missing`);
          }
          return filesApi.fileControllerGetUploadUrl({
            fileName: item.file.fileName,
            fileType: item.type,
          });
        });

        const uploadUrlResponses = await Promise.all(uploadPromises);

        // 3. Upload files to storage
        const fileUploadPromises = uploadUrlResponses.map((res, index) => {
          const item = filesToUpload[index];
          if (!item.file?.filePath) throw new Error("File path missing");
          return uploadFile(item.file.filePath, res.uploadUri);
        });

        await Promise.all(fileUploadPromises);

        // 4. Construct DTO with storage paths
        const applicationDto: CreateBroScholarApplicationDto = {
          studentName: data.studentName,
          institution: data.institute,
          studentFaceImage: {
            storagePath: uploadUrlResponses[0].storagePath,
            filename: data.identityFile!.fileName,
          },
          studentCard: {
            storagePath: uploadUrlResponses[1].storagePath,
            filename: data.studentCardFile!.fileName,
          },
          selfieWithStudentCard: {
            storagePath: uploadUrlResponses[2].storagePath,
            filename: data.selfieFile!.fileName,
          },
        };

        // 5. Submit application
        const response = await broScholarApi.broScholarControllerCreateApplication({
          createBroScholarApplicationDto: applicationDto,
        });

        return response;
      } catch (error) {
        console.error("Bro Scholar Application Error:", error);
        throw error;
      } finally {
        await new Promise<void>((resolve) => {
          ModalBox.update("popup", {
            onHide: () => {
              resolve();
              return true;
            },
          });
          ModalBox.hide();
        });
      }
    },
  });
};
