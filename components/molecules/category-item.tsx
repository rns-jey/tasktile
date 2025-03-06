"use client";

import { Category } from "@prisma/client";

import { motion } from "motion/react";
import { Button } from "../atoms/button";
import { X } from "lucide-react";

interface CategoryItemProps {
  category: Category;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between p-1 rounded cursor-pointer hover:bg-accent"
    >
      <div className="flex items-center gap-1">
        <div className={`rounded-full ${category.color} h-3 w-3`} />
        <span className="text-sm">{category.name}</span>
      </div>

      <Button variant={"ghost"} size={"xs"} className="hover:text-red-500">
        <X />
      </Button>
    </motion.div>
  );
}
