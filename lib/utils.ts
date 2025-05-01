import { CalendarDay, RawContribution } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, endOfMonth, endOfWeek, isSameDay, parseISO, startOfMonth, startOfWeek } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateMonthCalendar(contributions: RawContribution[], targetDate: Date = new Date()): CalendarDay[] {
  const start = startOfWeek(startOfMonth(targetDate), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(targetDate), { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({ start, end });

  return calendarDays.map((day) => {
    const match = contributions.find((item) => isSameDay(parseISO(item.completedAt), day));

    return {
      completedAt: day,
      _count: {
        completed: match ? match._count.completed : 0,
      },
      isCurrentMonth: day.getMonth() === targetDate.getMonth(),
    };
  });
}
