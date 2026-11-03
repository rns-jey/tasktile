import { DayStat } from "@/types";
import { format, subDays } from "date-fns";

const prevKey = (key: string) =>
  format(subDays(new Date(key + "T00:00:00"), 1), "yyyy-MM-dd");

export function computeStreaks(stats: DayStat[], todayKey: string) {
  const days = new Set<string>();

  for (const stat of stats) {
    if (stat.completedOn)
      days.add(new Date(stat.completedOn).toISOString().slice(0, 10));
  }

  let current = 0;
  let cursor = days.has(todayKey) ? todayKey : prevKey(todayKey);

  while (days.has(cursor)) {
    current++;
    cursor = prevKey(cursor);
  }

  let best = 0,
    run = 0,
    last: string | null = null;

  for (const day of [...days].sort()) {
    run = last && prevKey(day) === last ? run + 1 : 1;
    best = Math.max(best, run);
    last = day;
  }

  return { current, best };
}
