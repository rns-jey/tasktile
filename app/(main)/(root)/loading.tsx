"use client";

import { useTodayKey } from "@/components/providers/TodayProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import { fromDbDay } from "@/lib/date";
import { format } from "date-fns";
import { Fragment } from "react";

export default function RootLoading() {
  const todayKey = useTodayKey();
  const today = fromDbDay(`${todayKey}T00:00:00Z`);

  return (
    <Fragment>
      <header className="flex justify-between pb-4">
        <div>
          <h1 className="flex flex-col">
            <span className="text-meta text-muted-2 font-medium tracking-[.08em] uppercase">
              {format(today, "eeee")}
            </span>
            <span className="font-display text-display-lg">
              {format(today, "LLLL d")}
            </span>
          </h1>

          <Skeleton className="h-5 w-28" />
        </div>

        <div className="bg-paper-3 font-display flex size-17 items-center justify-center rounded-[15px] text-[28px]">
          <Skeleton className="size-10" />
        </div>
      </header>

      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((t) => (
          <div
            key={t}
            className="border-line flex h-16 items-center gap-3.5 border-b px-2 hover:bg-white"
          >
            <Skeleton className="size-4" />

            <Skeleton className="size-6" />

            <Skeleton className="h-6 w-28" />
          </div>
        ))}
      </div>
    </Fragment>
  );
}
