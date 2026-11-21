import { z } from "zod";

export const taskFormSchema = z.object({
  name: z.string().trim().min(1, "Task name is required"),
  description: z.string(),
  stackId: z.string().nullable(),
  dueOn: z.iso.date().nullable(),
  tags: z.array(z.string().trim().min(1)),
});

export const taskUpdateSchema = taskFormSchema.partial();

export type TaskFormValues = z.infer<typeof taskFormSchema>;
