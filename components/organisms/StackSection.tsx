"use client";

import { useStacks } from "@/hooks/useStacks";
import { cn } from "@/lib/utils";
import { ChevronRight, Layers } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../atoms/Button";
import NewStackDrawer from "./NewStackDrawer";

export default function StackSection() {
  const { data: stacks = [] } = useStacks();

  const [stackVisible, setStackVisible] = useState(true);

  return (
    <div className="mt-6">
      <div className="flex items-center">
        <p className="text-label font-medium uppercase">Stack</p>

        <NewStackDrawer />

        <Button
          type="button"
          variant="ghost"
          className="size-11"
          onClick={() => setStackVisible(!stackVisible)}
        >
          <ChevronRight />
        </Button>
      </div>

      <div
        className={cn(
          "min-h-11 w-full flex-col rounded-lg bg-white px-4 py-2 transition-all duration-500",
          stackVisible ? "flex" : "hidden",
        )}
      >
        {stacks.map((stack) => (
          <Link
            key={stack.id}
            href={`/stacks/${stack.id}`}
            className="flex h-11 items-center justify-between border-b py-2"
          >
            <span className="inline-flex gap-4">
              <Layers /> {stack.name}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {stack._count.tasks}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
