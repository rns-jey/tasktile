import { z } from "zod";

// schema.ts (zod)
export const stackFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give your stack a name")
    .max(40, "Keep it under 40 characters"),
});

export type StackFormValues = z.infer<typeof stackFormSchema>;
