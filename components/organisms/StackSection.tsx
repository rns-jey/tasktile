"use client";

import { useStacks } from "@/hooks/useStacks";
import { ChevronsUpDown, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../atoms/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/Collapsible";
import NewStackDrawer from "./NewStackDrawer";

export default function StackSection() {
  const { data: stacks = [] } = useStacks();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <div className="flex items-center">
        <p className="text-label ml-2 font-medium uppercase">Stack</p>

        <NewStackDrawer />

        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon" className="size-11">
              <ChevronsUpDown />
              <span className="sr-only">Toggle stacks</span>
            </Button>
          }
        />
      </div>

      <CollapsibleContent className="mt-2 flex flex-col gap-2 rounded-lg bg-white px-4 py-2">
        {stacks.map((stack) => (
          <Link
            key={stack.id}
            href={`/stacks/${stack.id}`}
            className="flex h-11 items-center justify-between border-b py-2 last:border-0"
          >
            <span className="inline-flex gap-4">
              <Layers /> {stack.name}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {stack._count.tasks}
            </span>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
