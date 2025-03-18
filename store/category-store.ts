import { Category } from "@prisma/client";
import { create } from "zustand";

interface CategoryStore {
  selectedCategory: Category | null;
  selectCategory: (category: Category) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  selectCategory: (category) => set({ selectedCategory: category }),
}));
