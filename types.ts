import { Category, Task } from "@prisma/client";

export type TaskWithCategory = Task & { category: Category | null };
