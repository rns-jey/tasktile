import CalendarSection from "@/components/organisms/CalendarSection";
import { Fragment } from "react";

export default function Analytics() {
  return (
    <Fragment>
      <header className="flex gap-10 pb-4">
        <h1 className="flex flex-col">
          <p className="font-display text-display-lg">6</p>
          <p className="text-body text-muted flex gap-1">day streak</p>
        </h1>

        <h1 className="flex flex-col">
          <p className="font-display text-display-lg text-muted">11</p>
          <p className="text-body text-muted flex gap-1">best</p>
        </h1>
      </header>

      <CalendarSection></CalendarSection>
    </Fragment>
  );
}
