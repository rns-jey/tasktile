"use client";

import { useUpcoming } from "@/hooks/useTasks";
import { localDay } from "@/lib/date";
import { format } from "date-fns";
import PageTitle from "../atoms/PageTitle";

export default function UpcomingHeader() {
  const { data: tasks = [] } = useUpcoming();

  return (
    <header className="pb-2">
      <h1 className="flex flex-col pb-1">
        <span className="text-xs leading-6 font-medium tracking-[.08em] uppercase">
          {format(localDay(), "MMMM yyyy")}
        </span>
        <PageTitle title="Upcoming" />
      </h1>
      <p>{tasks.length} tasks planned</p>
    </header>
  );
}
