import { Category, Task } from "@prisma/client";

export type TaskWithCategory = Task & { category: Category | null };

export type RawContribution = {
  date: string;
  count: number;
};

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  count: number;
};
