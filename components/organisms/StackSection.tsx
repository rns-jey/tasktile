"use client";

import { StackWithTaskCount } from "@/lib/models/stacks/types";
import { cn } from "@/lib/utils";
import { ChevronRight, Layers, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../atoms/Button";

export default function StackSection({
  stacks,
}: {
  stacks: StackWithTaskCount[];
}) {
  const [stackVisible, setStackVisible] = useState(false);

  return (
    <div className="mt-6">
      <div className="flex items-center">
        <p className="text-label font-medium uppercase">Stack</p>

        <Button type="button" variant="ghost" className="ml-auto size-11">
          <Plus />
        </Button>

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
          <div
            key={stack.id}
            className="flex h-11 items-center justify-between border-b py-2"
          >
            <span className="inline-flex gap-4">
              <Layers /> Project 2
            </span>
            <span className="text-muted-foreground tabular-nums">
              {stack._count.tasks}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
