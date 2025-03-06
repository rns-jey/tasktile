import React from "react";
import { Popover, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Tag } from "lucide-react";
import CategoryMenu from "./category-menu";
import { Category } from "@prisma/client";

interface CategoryPopOverProps {
  isLoading: boolean;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
}

export default function CategoryPopOver({
  isLoading,
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
}: CategoryPopOverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center w-fit" disabled={isLoading}>
          <Tag />
          <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
        </Button>
      </PopoverTrigger>
      <CategoryMenu
        categories={categories}
        setCategories={setCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </Popover>
  );
}
