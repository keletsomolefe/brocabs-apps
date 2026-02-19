import { z } from "zod";
import { fileSchema } from "~/constants";

export const broScholarApplicationSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  institute: z.string().min(1, "Institute is required"),
  identityFile: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "Identity confirmation is required",
  }),
  studentCardFile: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "Student card is required",
  }),
  selfieFile: fileSchema.nullable().refine((file) => !!file?.filePath, {
    message: "Selfie with ID card is required",
  }),
});

export type BroScholarFormFields = z.infer<typeof broScholarApplicationSchema>;
