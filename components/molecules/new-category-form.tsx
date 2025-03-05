"use client";

import { Input } from "../atoms/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../atoms/button";

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

export default function NewCategoryForm() {
  const [name, setName] = useState("");
  const [selectedColor, setColor] = useState("bg-gray-500");

  async function handleAddCategory() {
    // try {
    //   const response = await axios.post("api/task/new", values);
    //   const newTask = response.data;
    //   setTasks([newTask, ...tasks]);
    //   toast("Task created.");
    //   form.reset();
    // } catch (error) {
    //   console.log(error);
    // }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="text"
        placeholder="Input category name..."
        autoComplete="off"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 h-8 text-xs"
      />

      <div className="grid grid-cols-5 gap-1">
        {colors.map((color, id) => (
          <div
            key={`color_${id}`}
            className={cn(selectedColor !== color && "border-transparent", "border-2 rounded-full p-1")}
            onClick={() => setColor(color)}
          >
            <div className={cn(color, "rounded-full h-5 w-5 cursor-pointer")} />
          </div>
        ))}
      </div>

      <Button variant={"outline"} type="submit">
        Add category
      </Button>
    </div>
  );
}
