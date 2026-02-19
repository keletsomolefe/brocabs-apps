import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string(),
  filePath: z.string(),
});

export type FileType = z.infer<typeof fileSchema>;
