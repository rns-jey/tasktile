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
import CategoryMenu from "./category-menu";

export default function CategoryPopOver() {
  const { selectedCategory, selectCategory } = useCategoryStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center w-fit">
          <Tag />
          <span className="text-xs">{selectedCategory ? selectedCategory.name : "Add category"}</span>
        </Button>
      </PopoverTrigger>
      <CategoryMenu />
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
