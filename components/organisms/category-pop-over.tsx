"use client";

import React, { useState } from "react";
import { PopoverContent } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Category } from "@prisma/client";
import { Separator } from "../atoms/separator";
import NewCategoryForm from "../molecules/new-category-form";
import { AnimatePresence } from "motion/react";

import CategoryItem from "../molecules/category-item";

interface CategoryPopOverProps {
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
}

export default function CategoryPopOver({ categories, selectedCategory, setSelectedCategory }: CategoryPopOverProps) {
  const [categoryList, setCategories] = useState<Category[]>(categories);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <PopoverContent className="w-auto p-2 space-y-2" align="start">
      <AnimatePresence>
        <div className="flex flex-col">
          {categoryList.map((category) => (
            <CategoryItem
              key={`category_${category.id}`}
              category={category}
              categories={categoryList}
              setCategories={setCategories}
              setSelectedCategory={setSelectedCategory}
            />
          ))}
        </div>
      </AnimatePresence>

      {categoryList.length > 0 && <Separator />}

      {isAdding && (
        <NewCategoryForm categoryList={categoryList} setCategories={setCategories} setIsAdding={setIsAdding} />
      )}

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
