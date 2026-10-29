import {
  differenceInCalendarDays,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { fromDbDay } from "./date";

export { cn } from "cn";

export function formatDueDate(value: Date | string, todayKey: string) {
  const date = fromDbDay(value);
  const today = fromDbDay(`${todayKey}T00:00:00Z`);
  const days = differenceInCalendarDays(date, today);

  if (days < 0) {
    const late = Math.abs(days);

    return {
      label: `${late} ${late === 1 ? "day" : "days"} overdue`,
      overdue: true,
    };
  }

  if (days === 0)
    return {
      label: "due today",
      overdue: false,
    };

  if (days === 1)
    return {
      label: "due tomorrow",
      overdue: false,
    };

  if (days > 1 && days < 7)
    return {
      label: `due ${format(date, "EEE")}`,
      overdue: false,
    };

  return {
    label: `due ${format(date, "MMM d")}`,
    overdue: false,
  };
}

export function formatClosedDate(date: Date) {
  const days = differenceInCalendarDays(date, new Date());

  if (isToday(date)) return "Done today";

  if (isYesterday(date)) return "Done yesterday";
}
