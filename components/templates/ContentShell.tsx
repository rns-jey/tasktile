import React from "react";
import { ScrollArea } from "../ui/ScrollArea";

export default function ContentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1 p-4">{children}</ScrollArea>
    </main>
  );
}
