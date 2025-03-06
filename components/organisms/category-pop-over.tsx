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
import { cn } from "@/lib/utils";

interface CategoryPopOverProps {
  categories: Category[];
}

export default function CategoryPopOver({ categories }: CategoryPopOverProps) {
  const [categoryList, setCategories] = useState<Category[]>(categories);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center">
          <Tag />
          <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
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
    </Popover>
  );
}
