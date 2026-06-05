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
  selected: Category | null;
  setCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  disabled?: boolean;
}

export default function SelectCategory({
  selected,
  setCategory,
  disabled,
}: SelectCategoryProps) {
  const { data: categories } = useCategories();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"xs"}
          type="button"
          className="flex w-fit justify-start"
          disabled={disabled}
        >
          <Tag />
          {selected ? selected.name : "Add category"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {categories &&
          categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => setCategory(category)}
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
