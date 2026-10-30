"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlignLeftIcon, Check } from "lucide-react";
import { Fragment, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { CategColor, categColors } from "@/lib/colors";
import { Category } from "@/lib/generated/prisma/client";
import { CategoryFormValues } from "@/lib/schemas/categories";
import { cn } from "@/lib/utils";

import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import {
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/Drawer";
import { Field, FieldError, FieldGroup } from "../ui/Field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/InputGroup";
import { Label } from "../ui/Label";
import { Separator } from "../ui/Separator";

interface CategoryFormProps {
  category?: Category;
  form: UseFormReturn<CategoryFormValues>;
  formId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: () => void;
}

export default function CategoryForm({
  category,
  form,
  formId,
  setOpen,
  onDelete,
}: CategoryFormProps) {
  const [selected, setSelected] = useState<CategColor>(
    () => categColors.find((c) => c === category?.color) ?? categColors[0],
  );

  const isEditing = Boolean(category);

  const name = form.watch("name");

  const queryClient = useQueryClient();

  const addCategory = useMutation<
    Category,
    Error,
    CategoryFormValues & { color: string }
  >({
    mutationFn: async (newCategory) => {
      const response = await axios.post("/api/categories/new", newCategory);
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        form.setError("name", {
          message: "You already have a category with that name",
        });
      } else {
        toast.error("Couldn't create category");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] }); // Wait for refetch to complete
      form.reset();
      setOpen(false);
    },
  });

  const updateCategory = useMutation<
    Category,
    Error,
    CategoryFormValues & { color: string }
  >({
    mutationFn: async (updatedCategory) => {
      const response = await axios.patch(
        `/api/categories/${category?.id}`,
        updatedCategory,
      );
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        form.setError("name", {
          message: "You already have a category with that name",
        });
      } else {
        toast.error("Couldn't create category");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] }); // Wait for refetch to complete
      setOpen(false);
    },
  });

  function onSubmit(values: CategoryFormValues) {
    const payload = { ...values, color: selected };

    if (isEditing) updateCategory.mutate(payload);
    else addCategory.mutate(payload);
  }

  const formPending = addCategory.isPending || updateCategory.isPending;

  return (
    <Fragment>
      <DrawerHeader className="flex flex-row items-center justify-between">
        <DrawerClose
          disabled={formPending}
          className="text-muted h-11 px-2 font-medium"
        >
          Cancel
        </DrawerClose>
        <DrawerTitle>
          {isEditing ? "Edit Category" : "New Category"}
        </DrawerTitle>
        <Button
          type="submit"
          form={formId}
          disabled={formPending}
          className="bg-ink text-paper h-11 px-4 font-semibold"
        >
          {isEditing ? "Save" : "Add"}
        </Button>
      </DrawerHeader>

      <div className="flex flex-col items-center gap-2 px-4">
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              disabled={formPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="h-11 w-full">
                    <InputGroupInput
                      {...field}
                      id={`${formId}-name`}
                      aria-invalid={fieldState.invalid}
                      placeholder="Name, e.g. Personal"
                      disabled={formPending}
                    />
                    <InputGroupAddon>
                      <span
                        className="h-6 w-6 rounded-xs"
                        style={{ backgroundColor: selected }}
                      />
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="space-y-4">
              <Label className="uppercase">Color</Label>

              <div className="flex flex-wrap gap-4">
                {categColors.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    aria-pressed={selected === color}
                    disabled={formPending}
                    className={cn(
                      selected === color && "ring-2 ring-black ring-offset-2",
                      "flex h-14 w-14 cursor-pointer items-center justify-center rounded-md",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelected(color)}
                  >
                    {selected === color && <Check className="text-white" />}
                  </Button>
                ))}
              </div>
            </div>
          </FieldGroup>
        </form>
      </div>

      <DrawerFooter>
        <Label className="uppercase">Preview</Label>

        <div className="rounded-lg border p-2">
          <div className="border-line flex h-16 items-center gap-3.5 border-b bg-white px-2">
            <span className="text-subtle w-4.5 font-mono text-xs">00</span>
            <Checkbox className="rounded-check ring-stroke size-6 cursor-pointer ring-[1.75px] ring-inset" />
            <div className="flex w-full cursor-pointer">
              <div className="flex min-w-0 grow-0 flex-col gap-0.5">
                <span className="text-task w-full truncate font-medium">
                  Book a date with her
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-xs"
                      style={{ backgroundColor: selected }}
                    />
                    <span className="text-meta truncate">
                      {name.trim() || "Category name"}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-muted-foreground/50">
                    ·
                  </span>
                  <span className="text-meta text-muted-2">due tomorrow</span>
                  <span aria-hidden="true" className="text-muted-foreground/50">
                    ·
                  </span>
                  <AlignLeftIcon className="w-4" aria-label="Has description" />
                </div>
              </div>

              <div className="flex-1" />
            </div>
          </div>
        </div>

        {isEditing && (
          <>
            <Separator className="my-2" />

            <DrawerClose asChild>
              <Button
                className="h-11 w-full cursor-pointer"
                variant="destructive"
                type="button"
                onClick={onDelete}
                disabled={formPending}
              >
                Delete category
              </Button>
            </DrawerClose>
          </>
        )}
      </DrawerFooter>
    </Fragment>
  );
}
