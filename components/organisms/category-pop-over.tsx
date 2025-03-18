import React from "react";
import { Popover, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Tag } from "lucide-react";
import { useCategoryStore } from "@/store/category-store";
import CategoryMenu from "./category-menu";

interface CategoryPopOverProps {
  isLoading: boolean;
}

export default function CategoryPopOver({ isLoading }: CategoryPopOverProps) {
  const { selectedCategory } = useCategoryStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center w-fit" disabled={isLoading}>
          <Tag />
          <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
        </Button>
      </PopoverTrigger>
      <CategoryMenu />
    </Popover>
  );
}
