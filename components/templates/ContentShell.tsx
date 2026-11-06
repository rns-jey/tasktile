import React from "react";
import { ScrollArea } from "../ui/ScrollArea";

export default function ContentShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ScrollArea className="flex-1">{children}</ScrollArea>;
}
