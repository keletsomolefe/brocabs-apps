import { z } from "zod";

export const mqttEnvelopeSchema = z.object({
  messageId: z.string(),
  type: z.string(),
  data: z.any(),
});

export type MqttEnvelope = z.infer<typeof mqttEnvelopeSchema>;
