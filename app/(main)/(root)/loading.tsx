"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { Fragment } from "react";

export default function RootLoading() {
  return (
    <Fragment>
      <header className="flex justify-between pb-4">
        <Skeleton className="h-21 w-48" />

        <Skeleton className="size-17" />
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
