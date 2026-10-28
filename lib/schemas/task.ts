import { z } from "zod";

export const taskFormSchema = z.object({
  name: z.string().min(3, "Task name is required"),
  description: z.string().max(120),
  categoryId: z.string().nullable(),
  dueDate: z.date().nullable(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
