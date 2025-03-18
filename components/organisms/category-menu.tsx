import React from "react";
import { PopoverContent } from "../atoms/popover";
import { AnimatePresence } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { Category } from "@prisma/client";

import { Button } from "../atoms/button";
import { Separator } from "../atoms/separator";
import NewCategoryForm from "../molecules/new-category-form";

export default function CategoryMenu({ children }: { children: React.ReactNode }) {
  const [isAdding, setIsAdding] = React.useState(false);

  const queryClient = useQueryClient();
  const categories = queryClient.getQueryData<Category[]>(["categories"]);

  return (
    <PopoverContent className="w-auto p-2 space-y-2" align="start">
      <AnimatePresence>
        <div className="flex flex-col">{children}</div>
      </AnimatePresence>

      {categories && <Separator />}

      {isAdding && <NewCategoryForm setIsAdding={setIsAdding} />}

      {!isAdding && (
        <Button
          variant={"ghost"}
          size={"xs"}
          className="w-full flex items-center gap-1"
          onClick={() => setIsAdding(true)}
        >
          <span className="text-sm">New category</span>
        </Button>
      )}
    </PopoverContent>
  );
}
