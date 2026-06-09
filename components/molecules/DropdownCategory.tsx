import { Category } from "@prisma/client";
import { Tag } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/Button";
import {
  Command,
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
import NewCategoryForm from "./new-category-form";

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
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = React.useState(false);

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
        {isAdding ? (
          <NewCategoryForm
            name={search}
            setSearch={setSearch}
            setIsAdding={setIsAdding}
          />
        ) : (
          <Command>
            <CommandInput
              className="text-sm"
              placeholder="Search categories…"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    className="text-sm"
                    onSelect={(val: string) => {
                      onChange(val === category.id ? "" : category.id);
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
              {search && (
                <CommandGroup>
                  <CommandItem
                    value={`__create__${search}`}
                    onSelect={() => setIsAdding(true)}
                  >
                    Create "{search}"
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
