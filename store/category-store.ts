import { Category } from "@prisma/client";
import { create } from "zustand";

interface CategoryStore {
  selectedCategory: Category | null;
  selectCategory: (category: Category) => void;
  deselectCategory: () => void; // Method to reset the selectedCategory
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  selectCategory: (category) => set({ selectedCategory: category }),
  deselectCategory: () => set({ selectedCategory: null }),
}));
