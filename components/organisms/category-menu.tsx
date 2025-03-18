import React from "react";
import { PopoverContent } from "../atoms/popover";
import { AnimatePresence } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import axios from "axios";
import { Button } from "../atoms/button";
import { Separator } from "../atoms/separator";
import NewCategoryForm from "../molecules/new-category-form";
import CategoryItem from "../molecules/category-item";

export default function CategoryMenu() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");

      return response.data;
    },
  });

  const [isAdding, setIsAdding] = React.useState(false);

  return (
    <PopoverContent className="w-auto p-2 space-y-2" align="start">
      <AnimatePresence>
        <div className="flex flex-col">
          {categories && categories.map((category) => <CategoryItem category={category} key={category.id} />)}
        </div>
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
