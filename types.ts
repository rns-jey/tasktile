import { Category, Task } from "@prisma/client";

export type TaskWithCategory = Task & { category: Category | null };

export type RawContribution = {
  completedAt: string;
  _count: {
    completed: number;
  };
};

export type CalendarDay = {
  completedAt: Date;
  isCurrentMonth: boolean;
  _count: {
    completed: number;
  };
};
