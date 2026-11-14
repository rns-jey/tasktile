import { z } from "zod";

export const stackFormSchema = z.object({
  name: z.string().trim().min(1, "Stack name is required"),
});

export type StackFormValues = z.infer<typeof stackFormSchema>;
