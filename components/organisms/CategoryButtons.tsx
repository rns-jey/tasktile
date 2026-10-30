"use client";

import { useCategoriesWithCount } from "@/hooks/useCategories";
import { CategoryWithCounts } from "@/types";
import { AnimatePresence, motion } from "motion/react";
import CategoryCard from "../molecules/CategoryCard";
import { Skeleton } from "../ui/Skeleton";

export default function CategoryButtons({
  initialCategories,
}: {
  initialCategories: CategoryWithCounts[];
}) {
  const { data: categories } = useCategoriesWithCount(initialCategories);

  if (!categories)
    return (
      <div className="mt-5.5 rounded-lg border bg-white px-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="border-line flex h-15 w-full cursor-pointer items-center justify-between border-b text-left last:border-0"
          >
            <div className="flex items-center gap-3.5">
              <Skeleton className="h-7 w-7" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-6 w-5" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="mt-5.5 rounded-lg border bg-white px-4">
      <AnimatePresence initial={false}>
        {categories.map((c) => (
          <motion.button
            key={c.id}
            layout
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-line flex h-15 w-full cursor-pointer items-center justify-between border-b text-left last:border-0"
          >
            <CategoryCard category={c} />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
