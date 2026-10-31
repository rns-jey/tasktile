import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default function Loading() {
  return (
    <Fragment>
      <Link
        href={"/settings"}
        className="text-muted inline-flex h-11 items-center gap-1 text-base font-medium"
      >
        <ChevronLeft /> Settings
      </Link>

      <header className="flex flex-col justify-between gap-2 pb-4">
        <h1 className="font-display text-display-lg pt-1.5 tracking-[-.01em]">
          Categories
        </h1>
        <p className="text-body text-muted">
          Each category has its own colour. Tap one to rename it or change its
          colour.
        </p>
      </header>

      <div className="mt-5.5 rounded-lg border bg-white px-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border-line flex h-15 w-full cursor-pointer items-center justify-between border-b text-left last:border-0"
          >
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-6 w-5" />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant={"outline"}
        className="mt-2.5 flex h-14 w-full cursor-pointer items-center justify-start gap-3.5 px-4"
      >
        <span className="ring-stroke text-muted grid size-7 place-items-center rounded-[7px] text-xl ring-[1.5px] ring-inset">
          +
        </span>
        <span className="text-task font-medium">New category</span>
      </Button>

      <p className="text-meta text-muted-2 px-5 pt-4 leading-[1.45]">
        Swipe left on a category to delete it…
      </p>
    </Fragment>
  );
}
