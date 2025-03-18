import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Tag, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "../atoms/separator";

import NewCategoryForm from "../molecules/new-category-form";
import { useCategoryStore } from "@/store/category-store";

export default function CategoryPopOver() {
  const { selectedCategory, selectCategory } = useCategoryStore();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");

      return response.data;
    },
  });

  const [isAdding, setIsAdding] = React.useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center w-fit">
          <Tag />
          <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 space-y-2" align="start">
        <AnimatePresence>
          <div className="flex flex-col">
            {categories &&
              categories.map((category) => (
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

                  <Button variant={"ghost"} size={"xs"} className="hover:text-red-500">
                    <X />
                  </Button>
                </motion.div>
              ))}
          </div>
        </AnimatePresence>

        {categories && <Separator />}

        {isAdding && <NewCategoryForm setIsAdding={setIsAdding} />}

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

// import React from "react";
// import { Popover, PopoverTrigger } from "../atoms/popover";
// import { Button } from "../atoms/button";
// import { Tag } from "lucide-react";
// import CategoryMenu from "./category-menu";
// import { Category } from "@prisma/client";

// interface CategoryPopOverProps {
//   isLoading: boolean;
//   categories: Category[];
//   setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
//   selectedCategory: Category | null;
//   setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
// }

// export default function CategoryPopOver({
//   isLoading,
//   categories,
//   setCategories,
//   selectedCategory,
//   setSelectedCategory,
// }: CategoryPopOverProps) {
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant={"outline"} size={"xs"} className="flex items-center w-fit" disabled={isLoading}>
//           <Tag />
//           <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
//         </Button>
//       </PopoverTrigger>
//       <CategoryMenu
//         categories={categories}
//         setCategories={setCategories}
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//       />
//     </Popover>
//   );
// }
