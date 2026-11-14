import PageTitle from "@/components/atoms/PageTitle";
import { Fragment } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <header className="flex flex-col justify-between gap-4 pb-4">
        <PageTitle title="Tasks" />
      </header>

      {children}
    </Fragment>
  );
}
