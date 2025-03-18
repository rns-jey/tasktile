import React from "react";
import { Input } from "../atoms/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "../atoms/button";
import { X } from "lucide-react";
import { Category } from "@prisma/client";
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

interface NewCategoryFormProps {
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewCategoryForm({ setIsAdding }: NewCategoryFormProps) {
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

  return (
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

      <Button variant={"outline"} onClick={() => addCategory.mutate()} disabled={addCategory.isPending}>
        Add category
      </Button>
    </div>
  );
}
