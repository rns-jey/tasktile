import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";

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

interface NewCategoryFormProps {
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  name: string;
}

export default function NewCategoryForm({
  setIsAdding,
  setSearch,
  name,
}: NewCategoryFormProps) {
  const [selectedColor, setColor] = React.useState("red-500");

  const queryClient = useQueryClient();

  const addCategory = useMutation({
    mutationFn: async () => {
      await axios.post("api/categories/new", { name, color: selectedColor });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] }); // Wait for refetch to complete
      setSearch("");
      setColor("red-500");
      setIsAdding(false);
    },
  });

  return (
    <div className="flex flex-col gap-2 p-2">
      <Label>Choose a category color</Label>

      <div
        className={cn(
          "grid grid-cols-6 gap-1",
          addCategory.isPending && "pointer-events-none",
        )}
      >
        {colors.map((color, id) => (
          <div
            key={`color_${id}`}
            className={cn(
              selectedColor !== color.name && "border-transparent",
              "rounded-full border-2 p-1",
            )}
            onClick={() => !addCategory.isPending && setColor(color.name)}
          >
            <div
              className={`${color.bg} h-5 w-5 cursor-pointer rounded-full`}
            />
          </div>
        ))}
      </div>

      <Button
        type="submit"
        form="form-add-category"
        onClick={() => addCategory.mutate()}
        disabled={addCategory.isPending}
      >
        Create new category
      </Button>

      <Button
        variant={"outline"}
        className="hover:text-red-500"
        onClick={() => setIsAdding(false)}
        disabled={addCategory.isPending}
      >
        Cancel
      </Button>
    </div>
  );
}
