import { Skeleton } from "@/components/ui/Skeleton";
import { heatClass } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const legends = [
  { min: 0, label: "0" },
  { min: 1, label: "1-3" },
  { min: 4, label: "4-6" },
  { min: 7, label: "7-9" },
  { min: 10, label: "10+" },
];

export default function AnalyticsLoading() {
  return (
    <Fragment>
      <header className="flex gap-5 pb-4">
        <Skeleton className="h-16 w-18 rounded-md" />
        <Skeleton className="h-16 w-18 rounded-md" />{" "}
      </header>

      <div className="space-y-2 px-2">
        <div className="mx-auto flex items-center justify-between">
          <Skeleton className="h-12 w-52 rounded-md" />

          <div className="flex items-center gap-1">
            <Skeleton className="h-11 w-11 rounded-md" />
            <Skeleton className="h-11 w-11 rounded-md" />
          </div>
        </div>

        <div className="mx-auto grid w-full grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>

        <div className="mx-auto grid w-full grid-cols-7 gap-2">
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>

        <Skeleton className="mx-auto h-22 w-full rounded-md" />

        <div className="flex gap-2">
          <span>Tasks done</span>
          {legends.map((legend) => (
            <div key={legend.label} className="flex flex-col items-center">
              <div
                className={cn(
                  "size-6 shrink-0 rounded-[5px]",
                  heatClass(legend.min),
                )}
              />
              <p className="text-xs">{legend.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}
