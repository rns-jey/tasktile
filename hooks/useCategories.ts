import { Category } from "@/lib/generated/prisma/client";
import { CategoryWithCounts } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isPendingDelete } from "./useDeleteCategory";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");
      return response.data;
    },
    staleTime: Infinity, // never refetch unless you manually invalidate
  });
}

export function useCategoriesWithCount(
  initialCategories?: CategoryWithCounts[],
) {
  return useQuery<CategoryWithCounts[]>({
    queryKey: ["categories", "settings"],
    queryFn: async () => {
      const response = await axios.get("/api/categories?counts=true");
      return response.data;
    },
    initialData: initialCategories,
    select: (categories) => categories.filter((c) => !isPendingDelete(c.id)),
    staleTime: 60 * 1000,
  });
}
