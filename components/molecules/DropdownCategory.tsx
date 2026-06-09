import { Category } from "@prisma/client";
import { Tag } from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/Command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

interface DropdownCategoryProps {
  categories: Category[];
  onChange: (value: string) => void;
  value: string | null;
  disabled?: boolean;
  size?:
    | "default"
    | "icon"
    | "icon-lg"
    | "icon-sm"
    | "icon-xs"
    | "lg"
    | "sm"
    | "xs"
    | null
    | undefined;
}
export default function DropdownCategory({
  categories,
  value,
  onChange,
  disabled,
  size,
}: DropdownCategoryProps) {
  const [open, setOpen] = React.useState(false);

  const selected = categories.find((c) => c.id === value);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size={size}
          disabled={disabled}
          className="flex w-fit justify-start"
        >
          <Tag />
          {selected ? selected.name : "Select category … "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full">
        <Command>
          <CommandInput className="text-sm" placeholder="Search categories…" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  className="text-sm"
                  onSelect={(val: string) => {
                    onChange(val === value ? "" : val);
                    setOpen(false);
                  }}
                >
                  <div
                    className={`rounded-full bg-${category.color} h-3 w-3 shrink-0`}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
