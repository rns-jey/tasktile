import React from "react";
import { Popover, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Tag } from "lucide-react";
import CategoryMenu from "./category-menu";
import { Category } from "@prisma/client";

interface CategoryPopOverProps {
  isLoading: boolean;
  selectedCategory: Category | null;
  categories: Category[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
}

export default function CategoryPopOver({
  isLoading,
  selectedCategory,
  categories,
  setSelectedCategory,
}: CategoryPopOverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center" disabled={isLoading}>
          <Tag />
          <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
        </Button>
      </PopoverTrigger>
      <CategoryMenu
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </Popover>
  );
}
