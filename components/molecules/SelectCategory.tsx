import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@prisma/client";
import { Tag } from "lucide-react";

interface SelectCategoryProps {
  id?: string;
  selected: string | null;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export default function SelectCategory({
  id,
  selected,
  onSelect,
  disabled,
}: SelectCategoryProps) {
  const [selectedCategory, setCategory] = useState<Category | null>(null);

  const { data: categories } = useCategories();

  useEffect(() => {
    if (!selected) setCategory(null); // fires when parent resets
  }, [selected]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger id={id} asChild>
        <Button
          variant={"outline"}
          size={"xs"}
          type="button"
          className="flex w-fit justify-start"
          disabled={disabled}
        >
          <Tag />
          {selectedCategory ? selectedCategory.name : "Add category"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {categories &&
          categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => {
                setCategory(category);
                onSelect(category.id);
              }}
            >
              <div
                className={`rounded-full bg-${category.color} h-3 w-3 shrink-0`}
              />
              {category.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
