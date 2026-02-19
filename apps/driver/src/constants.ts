import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string(),
  filePath: z.string(),
  storagePath: z.string().optional(),
  status: z.enum(["pending", "uploading", "completed", "error"]).optional(),
  progress: z.number().optional(),
});

export type FileType = z.infer<typeof fileSchema>;
