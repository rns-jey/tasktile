"use client";

import { computeStreaks } from "@/lib/stats";
import { DayStat } from "@/types";
import { useMemo } from "react";
import { useTodayKey } from "../providers/TodayProvider";

export default function AnalyticsHeader({ stats }: { stats: DayStat[] }) {
  const todayKey = useTodayKey();
  const { current, best } = useMemo(
    () => computeStreaks(stats, todayKey),
    [stats, todayKey],
  );

  return (
    <header className="flex gap-5 pb-4">
      <h1 className="flex flex-col">
        <p className="font-display text-display-lg">{current}</p>
        <p className="text-body text-muted flex gap-1">day streak</p>
      </h1>

      <h1 className="flex flex-col">
        <p className="font-display text-display-lg text-muted">{best}</p>
        <p className="text-body text-muted flex gap-1">best</p>
      </h1>
    </header>
  );
}
