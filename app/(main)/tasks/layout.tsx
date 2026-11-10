import { Fragment } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Fragment>
      <header className="flex flex-col justify-between gap-4 pb-4">
        <h1 className="flex flex-col">
          <span className="font-heading text-4xl">Tasks</span>
        </h1>
      </header>

      {children}
    </Fragment>
  );
}
