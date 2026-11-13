import UpcomingHeader from "@/components/molecules/UpcomingHeader";
import { Fragment } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <UpcomingHeader />
      {children}
    </Fragment>
  );
}
