"use client";

import { Category } from "@prisma/client";

import { motion } from "motion/react";
import { Button } from "../atoms/button";
import { X } from "lucide-react";
import { useState } from "react";
import axios from "axios";

interface CategoryItemProps {
  category: Category;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function CategoryItem({ category, categories, setCategories }: CategoryItemProps) {
  const [isLoading, setLoading] = useState(false);

  async function deleteCategory(id: string) {
    try {
      setLoading(true);
      await axios.delete(`/api/category/${category.id}`);

      setCategories(categories.filter((category) => category.id !== id));

      setLoading(false);
    } catch (error) {
      console.error("Failed to delete task", error);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between p-1 rounded cursor-pointer hover:bg-accent"
    >
      <Button variant={"ghost"} size={"xs"} className="p-0 flex items-center gap-1" disabled={isLoading}>
        <div className={`rounded-full ${category.color} h-3 w-3`} />
        <span className="text-sm">{category.name}</span>
      </Button>

      <Button
        variant={"ghost"}
        size={"xs"}
        className="hover:text-red-500"
        onClick={() => deleteCategory(category.id)}
        disabled={isLoading}
      >
        <X />
      </Button>
    </motion.div>
  );
}
