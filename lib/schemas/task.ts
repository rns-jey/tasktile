import { z } from "zod";

export const taskFormSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  description: z.string(),
  categoryId: z.string().nullable(),
  dueOn: z.iso.date().nullable(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
