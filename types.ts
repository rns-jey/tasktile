import { Category, Task } from "./lib/generated/prisma/client";

export type TaskWithCategory = Task & { category: Category | null };

export type CategoryWithCount = Category & {
  openCount: number;
  closedCount: number;
};

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
