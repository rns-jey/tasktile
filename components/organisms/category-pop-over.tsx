import React from "react";
import { Popover, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Tag } from "lucide-react";
import CategoryMenu from "./category-menu";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CategoryItem from "../molecules/category-item";

interface CategoryPopOverProps {
  isLoading: boolean;
  taskCategory: Category | null;
  selectCategory: React.Dispatch<React.SetStateAction<Category | null>>;
}

export default function CategoryPopOver({ isLoading, taskCategory, selectCategory }: CategoryPopOverProps) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/categories");

      return response.data;
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} size={"xs"} className="flex items-center w-fit" disabled={isLoading}>
          <Tag />
          <span className="text-xs">{taskCategory ? taskCategory.name : "Add category"}</span>
        </Button>
      </PopoverTrigger>
      <CategoryMenu>
        {categories &&
          categories.map((category) => (
            <CategoryItem category={category} selectCategory={selectCategory} key={category.id} />
          ))}
      </CategoryMenu>
    </Popover>
  );
}
