import SignOutSection from "@/components/molecules/SignOutSection";
import ThemeSettings from "@/components/organisms/ThemeSettings";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChevronRight, LayoutGridIcon } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default function Loading() {
  return (
    <Fragment>
      <header className="flex flex-col justify-between gap-4 pb-4">
        <h1 className="flex flex-col">
          <span className="font-display text-display-lg">Settings</span>
        </h1>
      </header>

      <div>
        <p className="text-label text-muted-2 mx-2 mt-6 mb-2 font-medium tracking-[.08em] uppercase">
          Tasks
        </p>

        <Button
          className="flex h-11 w-full items-center justify-between bg-white text-base"
          variant={"outline"}
          nativeButton={false}
          disabled
          render={<Link href="/settings/categories" />}
        >
          <div className="flex items-center gap-1">
            <LayoutGridIcon className="size-6" />
            <span className="leading-none [text-box:trim-both_cap_alphabetic]">
              Categories
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <ChevronRight />
          </div>
        </Button>
      </div>

      <ThemeSettings />

      <SignOutSection />
    </Fragment>
  );
}
