import {
  differenceInCalendarDays,
  format,
  isToday,
  isTomorrow,
} from "date-fns";

export { cn } from "cn";

export function formatDueDate(date: Date) {
  const days = differenceInCalendarDays(date, new Date());

  if (days < 0) {
    const late = Math.abs(days);

    return {
      label: `${late} ${late === 1 ? "day" : "days"} overdue`,
      overdue: true,
    };
  }

  if (isToday(date))
    return {
      label: "due today",
      overdue: false,
    };

  if (isTomorrow(date))
    return {
      label: "due tomorrow",
      overdue: false,
    };

  if (days > 0 && days < 7)
    if (isTomorrow(date))
      return {
        label: `due ${format(date, "EEE")}`,
        overdue: false,
      };
}
