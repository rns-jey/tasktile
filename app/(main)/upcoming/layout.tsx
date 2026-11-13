import { localDay } from "@/lib/date";
import { format } from "date-fns";
import { Fragment } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <header>
        <h1 className="flex flex-col pb-1">
          <span className="text-xs leading-6 font-medium tracking-[.08em] uppercase">
            {format(localDay(), "MMMM yyyy")}
          </span>
          <span className="font-heading text-4xl leading-none">Upcoming</span>
        </h1>
        <p>22 planned</p>
      </header>
      {children}
    </Fragment>
  );
}
