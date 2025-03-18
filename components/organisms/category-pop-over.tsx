import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Tag, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "@prisma/client";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "../atoms/separator";
import { Input } from "../atoms/input";
import { cn } from "@/lib/utils";

const colors = [
  { name: "red-500", bg: "bg-red-500" },
  { name: "orange-500", bg: "bg-orange-500" },
  { name: "yellow-500", bg: "bg-yellow-500" },
  { name: "green-500", bg: "bg-green-500" },
  { name: "blue-500", bg: "bg-blue-500" },
  { name: "indigo-500", bg: "bg-indigo-500" },
  { name: "purple-500", bg: "bg-purple-500" },
  { name: "pink-500", bg: "bg-pink-500" },
];

export default function CategoryPopOver() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");

      return response.data;
    },
  });

  const [isAdding, setIsAdding] = React.useState(false);
  const [name, setName] = React.useState("");
  const [selectedColor, setColor] = React.useState("red-500");

  const queryClient = useQueryClient();

  const addCategory = useMutation({
    mutationFn: async () => {
      await axios.post("api/categories/new", { name, color: selectedColor });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] }); // Wait for refetch to complete
      setName("");
      setColor("red-500");
      setIsAdding(false);
    },
  });

  function handleAddCategory() {
    addCategory.mutate();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center w-fit">
          <Tag />
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
                  <div className="p-0 flex items-center gap-1 w-full">
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

        {isAdding && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 pr-1">
              <Input
                type="text"
                placeholder="Input category name..."
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
                className="flex-1 h-8 text-xs w-[170px]"
                disabled={addCategory.isPending}
              />

              <Button
                variant={"ghost"}
                size={"xs"}
                className="hover:text-red-500"
                onClick={() => setIsAdding(false)}
                disabled={addCategory.isPending}
              >
                <X />
              </Button>
            </div>

            <div className="grid grid-cols-6 gap-1">
              {colors.map((color, id) => (
                <div
                  key={`color_${id}`}
                  className={cn(selectedColor !== color.name && "border-transparent", "border-2 rounded-full p-1")}
                  onClick={() => !addCategory.isPending && setColor(color.name)}
                >
                  <div className={`${color.bg} rounded-full h-5 w-5 cursor-pointer`} />
                </div>
              ))}
            </div>

            <Button variant={"outline"} onClick={() => handleAddCategory()} disabled={addCategory.isPending}>
              Add category
            </Button>
          </div>
        )}

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
