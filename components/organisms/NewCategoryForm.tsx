import { useCategories } from "@/hooks/useCategories";
import { CategColor, categColors } from "@/lib/colors";
import { Category } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AlignLeftIcon, Check } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import {
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/Drawer";
import { Field, FieldError, FieldGroup } from "../ui/Field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/InputGroup";
import { Label } from "../ui/Label";

interface NewCategoryFormProps {
  setNewCateg: React.Dispatch<React.SetStateAction<boolean>>;
  onCreated?: (id: string) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
});

export default function NewCategoryForm({
  setNewCateg,
  onCreated,
}: NewCategoryFormProps) {
  const [selected, setselected] = useState<CategColor>(categColors[0]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const name = form.watch("name");

  const { data: categories } = useCategories();

  const queryClient = useQueryClient();

  const addCategory = useMutation<
    Category,
    Error,
    z.infer<typeof formSchema> & { color: string }
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
    onSuccess: async (category) => {
      await queryClient.invalidateQueries({ queryKey: ["categories"] }); // Wait for refetch to complete
      onCreated?.(category.id); // parent does form.setValue("categoryId", id)
      form.reset();
      setNewCateg(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCategory.mutate({ ...values, color: selected });
  }

  const isPending = addCategory.isPending;

  return (
    <DrawerContent className="pb-4">
      <DrawerHeader className="flex flex-row items-center justify-between">
        <Button
          variant={"ghost"}
          type="button"
          className="text-muted h-11 px-2 font-medium"
          onClick={() => setNewCateg(false)}
          disabled={isPending}
        >
          Cancel
        </Button>

        <DrawerTitle>New Category</DrawerTitle>
        <Button
          type="submit"
          form="form-add-category"
          disabled={isPending}
          className="bg-ink text-paper h-11 px-4 font-semibold"
        >
          Add
        </Button>
      </DrawerHeader>

      <div className="flex items-center gap-2 px-4">
        <form
          id="form-add-category"
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Validation errors:", errors),
          )}
          className="w-full"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              // disabled={addTask.isPending}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup className="h-11 w-full">
                    <InputGroupInput
                      {...field}
                      id="form-add-category-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Name, e.g. Personal"
                      disabled={isPending}
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
                    className={cn(
                      selected === color && "ring-2 ring-black ring-offset-2",
                      "flex h-14 w-14 cursor-pointer items-center justify-center rounded-md",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => !isPending && setselected(color)}
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
      </DrawerFooter>
    </DrawerContent>
  );
}
