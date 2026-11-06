"use client";

import { useStats } from "@/hooks/useStats";
import { computeStreaks } from "@/lib/stats";
import { useMemo } from "react";
import { useTodayKey } from "../providers/TodayProvider";

export default function AnalyticsHeader() {
  const { data: stats = [] } = useStats();

  const todayKey = useTodayKey();

  const { current, best } = useMemo(
    () => computeStreaks(stats, todayKey),
    [stats, todayKey],
  );

  return (
    <header className="flex gap-5 pb-4">
      <h1 className="flex flex-col">
        <p className="font-display text-display-lg">{current}</p>
        <p className="text-body flex gap-1">day streak</p>
      </h1>

      <h1 className="flex flex-col">
        <p className="font-display text-display-lg">{best}</p>
        <p className="text-body flex gap-1">best</p>
      </h1>
    </header>
  );
}
