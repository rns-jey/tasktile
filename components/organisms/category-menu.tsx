import React from "react";
import { PopoverContent } from "../atoms/popover";
import { AnimatePresence, motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import axios from "axios";
import { Button } from "../atoms/button";
import { X } from "lucide-react";
import { useCategoryStore } from "@/store/category-store";
import { Separator } from "../atoms/separator";
import NewCategoryForm from "../molecules/new-category-form";
import CategoryItem from "../molecules/category-item";

export default function CategoryMenu() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");

      return response.data;
    },
  });

  const [isAdding, setIsAdding] = React.useState(false);

  return (
    <PopoverContent className="w-auto p-2 space-y-2" align="start">
      <AnimatePresence>
        <div className="flex flex-col">
          {categories && categories.map((category) => <CategoryItem category={category} key={category.id} />)}
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
  );
}

// "use client";

// import React, { useState } from "react";
// import { PopoverContent } from "../atoms/popover";
// import { Button } from "../atoms/button";
// import { Category } from "@prisma/client";
// import { Separator } from "../atoms/separator";
// import NewCategoryForm from "../molecules/new-category-form";
// import { AnimatePresence } from "motion/react";

// import CategoryItem from "../molecules/category-item";

// interface CategoryMenuProps {
//   categories: Category[];
//   setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
//   selectedCategory: Category | null;
//   setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
// }

// export default function CategoryMenu({
//   categories,
//   setCategories,
//   selectedCategory,
//   setSelectedCategory,
// }: CategoryMenuProps) {
//   const [isAdding, setIsAdding] = useState(false);

//   return (
//     <PopoverContent className="w-auto p-2 space-y-2" align="start">
//       <AnimatePresence>
//         <div className="flex flex-col">
//           {categories.map((category) => (
//             <CategoryItem
//               key={`category_${category.id}`}
//               category={category}
//               categories={categories}
//               setCategories={setCategories}
//               setSelectedCategory={setSelectedCategory}
//             />
//           ))}
//         </div>
//       </AnimatePresence>

//       {categories.length > 0 && <Separator />}

//       {isAdding && <NewCategoryForm categories={categories} setCategories={setCategories} setIsAdding={setIsAdding} />}

//       {!isAdding && (
//         <Button
//           variant={"ghost"}
//           size={"xs"}
//           className="w-full flex items-center gap-1"
//           onClick={() => setIsAdding(true)}
//         >
//           <span className="text-sm">New category</span>
//         </Button>
//       )}

//       {selectedCategory && (
//         <Button
//           variant={"ghost"}
//           size={"xs"}
//           className="w-full flex items-center gap-1 px-1"
//           onClick={() => setSelectedCategory(null)}
//         >
//           <span className="text-sm">Remove category</span>
//         </Button>
//       )}
//     </PopoverContent>
//   );
// }
