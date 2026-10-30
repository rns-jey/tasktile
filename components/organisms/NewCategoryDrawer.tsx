"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  categoryFormSchema,
  CategoryFormValues,
} from "@/lib/schemas/categories";
import { Button } from "../ui/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";
import CategoryForm from "./CategoryForm";

export default function NewCategoryDrawer() {
  const [open, setOpen] = useState(false);

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
    >
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className="mt-2.5 flex h-14 w-full cursor-pointer items-center justify-start gap-3.5 px-4"
        >
          <span className="ring-stroke text-muted grid size-7 place-items-center rounded-[7px] text-xl ring-[1.5px] ring-inset">
            +
          </span>
          <span className="text-task font-medium">New category</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <CategoryForm
          form={categoryForm}
          formId="form-add-category"
          setOpen={setOpen}
        />
      </DrawerContent>
    </Drawer>
  );
}
