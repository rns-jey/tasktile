"use client";

import { Input } from "../atoms/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../atoms/button";
import axios from "axios";

import { Category } from "@prisma/client";
import { toast } from "sonner";
import { X } from "lucide-react";

const colors = [
  "bg-gray-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
];

interface NewCategoryFormProps {
  categoryList: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewCategoryForm({ categoryList, setCategories, setIsAdding }: NewCategoryFormProps) {
  const [name, setName] = useState("");
  const [selectedColor, setColor] = useState("bg-gray-500");
  const [isSubmitting, setSubmitting] = useState(false);

  async function handleAddCategory() {
    if (name.trim()) {
      try {
        setSubmitting(true);

        const response = await axios.post("api/category/new", { name, color: selectedColor });
        const newTask = response.data;

        setCategories([newTask, ...categoryList]);

        setName("");
        setColor("bg-gray-500");

        setSubmitting(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data); // Customize further if needed
        }

        setSubmitting(false);
      }
    }
  }

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
          disabled={isSubmitting}
        />

        <Button
          variant={"ghost"}
          size={"xs"}
          className="hover:text-red-500"
          onClick={() => setIsAdding(false)}
          disabled={isSubmitting}
        >
          <X />
        </Button>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {colors.map((color, id) => (
          <div
            key={`color_${id}`}
            className={cn(selectedColor !== color && "border-transparent", "border-2 rounded-full p-1")}
            onClick={() => !isSubmitting && setColor(color)}
          >
            <div className={cn(color, "rounded-full h-5 w-5 cursor-pointer")} />
          </div>
        ))}
      </div>

      <Button variant={"outline"} onClick={() => handleAddCategory()} disabled={isSubmitting}>
        Add category
      </Button>
    </div>
  );
}
