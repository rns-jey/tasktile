import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
