"use client";

import { Category } from "@prisma/client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "motion/react";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { CommandItem } from "../ui/Command";

interface CategoryItemProps {
  category: Category;
  onChange: (value: string) => void;
  value: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CategoryItem({
  category,
  onChange,
  value,
  setOpen,
}: CategoryItemProps) {
  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/categories/${category.id}`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <motion.div
      key={category.id}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CommandItem
        key={category.id}
        value={category.name}
        className="group text-sm"
        disabled={deleteCategory.isPending}
        onSelect={(val: string) => {
          onChange(val === category.id ? "" : category.id);
          setOpen(false);
        }}
      >
        <div className={`rounded-full bg-${category.color} h-3 w-3 shrink-0`} />
        <span className="flex-1">{category.name}</span>
        <Button
          type="button"
          variant={"ghost"}
          className="text-muted-foreground hover:text-destructive invisible group-hover:visible"
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering onSelect
            deleteCategory.mutate();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CommandItem>
    </motion.div>
  );
}
