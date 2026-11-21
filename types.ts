import { Stack, Tag, Task } from "./lib/generated/prisma/client";

export type TaskWithTags = Task & {
  tags: Tag[];
  stack: Stack | null;
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
