"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Plus, Tag } from "lucide-react";
import { Category } from "@prisma/client";
import { Separator } from "../atoms/separator";
import NewCategoryForm from "../molecules/new-category-form";
import { AnimatePresence } from "motion/react";

import CategoryItem from "../molecules/category-item";

interface CategoryPopOverProps {
  categories: Category[];
}

export default function CategoryPopOver({ categories }: CategoryPopOverProps) {
  const [categoryList, setCategories] = useState<Category[]>(categories);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center">
          <Tag />
          <span className="text-xs">Add category</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 space-y-2" align="start">
        <AnimatePresence>
          <div className="flex flex-col">
            {categoryList.map((category) => (
              <CategoryItem
                key={`category_${category.id}`}
                category={category}
                categories={categoryList}
                setCategories={setCategories}
              />
            ))}
          </div>
        </AnimatePresence>

        {categoryList.length > 0 && <Separator />}

        <NewCategoryForm categoryList={categoryList} setCategories={setCategories} />

        <div className="flex items-center gap-1">
          <Plus className="h-3 w-3" />
          <span className="text-sm">New category</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
