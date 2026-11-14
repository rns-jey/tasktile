import { Category, Stack, Task } from "./lib/generated/prisma/client";

export type TaskWithCategory = Task & { category: Category | null } & {
  stack: Stack | null;
};

export type CategoryWithCounts = Category & {
  openCount: number;
  closedCount: number;
};

export type CalendarDay = {
  completedAt: Date;
  isCurrentMonth: boolean;
  _count: {
    completed: number;
  };
};

export type DayStat = {
  _count: { completed: number };
  completedOn: Date | string | null;
};
