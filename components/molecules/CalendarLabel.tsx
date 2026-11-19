import { differenceInDays, format, parse } from "date-fns";
import { useMemo } from "react";
import { useTodayKey } from "../providers/TodayProvider";

export default function CalendarLabel({ date }: { date: Date | null }) {
  const todayKey = useTodayKey();
  const today = useMemo(
    () => parse(todayKey, "yyyy-MM-dd", new Date()),
    [todayKey],
  );

  if (!date) return "Select a date";

  if (differenceInDays(date, today) === 0) return "Today";

  if (differenceInDays(date, today) === 1) return "Tomorrow";

  return format(date, "dd MMM");
}
