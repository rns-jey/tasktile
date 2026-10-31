import { Skeleton } from "@/components/ui/Skeleton";
import { Fragment } from "react";

export default function Loading() {
  return (
    <Fragment>
      <div className="mt-5.5 rounded-lg border bg-white px-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border-line flex h-15 w-full items-center justify-between border-b text-left last:border-0"
          >
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-6 w-5" />
          </div>
        ))}
      </div>
    </Fragment>
  );
}
