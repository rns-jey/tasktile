"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Plus, Tag } from "lucide-react";
import { Category } from "@prisma/client";
import { Separator } from "../atoms/separator";
import NewCategoryForm from "../molecules/new-category-form";
import { AnimatePresence, motion } from "motion/react";

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
              <motion.div
                key={`category_${category.id}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1 p-1 rounded cursor-pointer hover:bg-accent"
              >
                <div className={`rounded-full ${category.color} h-3 w-3`} />
                <span className="text-sm">{category.name}</span>
              </motion.div>
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
