"use client";

import { Category } from "@prisma/client";

import { motion } from "motion/react";
import { Button } from "../atoms/button";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useCategoryStore } from "@/store/category-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CategoryItemProps {
  category: Category;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const { selectCategory, deselectCategory } = useCategoryStore();

  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/categories/${category.id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      deselectCategory();
    },
  });

  return (
    <motion.div
      key={category.id}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between p-1 rounded cursor-pointer hover:bg-accent"
    >
      <div className="p-0 flex items-center gap-1 w-full" onClick={() => selectCategory(category)}>
        <div className={`rounded-full bg-${category.color} h-3 w-3`} />
        <span className="text-sm">{category.name}</span>
      </div>

      <Button variant={"ghost"} size={"xs"} className="hover:text-red-500" onClick={() => deleteCategory.mutate()}>
        <X />
      </Button>
    </motion.div>
  );
}
