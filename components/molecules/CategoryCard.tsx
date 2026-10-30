import {
  flushPendingDeletes,
  useDeleteCategory,
} from "@/hooks/useDeleteCategory";
import {
  categoryFormSchema,
  CategoryFormValues,
} from "@/lib/schemas/categories";
import { CategoryWithCounts } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CategoryForm from "../organisms/CategoryForm";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/Drawer";

export default function CategoryCard({
  category,
}: {
  category: CategoryWithCounts;
}) {
  const [open, setOpen] = useState(false);
  const pendingDelete = useRef(false);

  const { name } = category;

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    values: {
      name,
    },
  });

  const handleDelete = () => {
    pendingDelete.current = true;
  };

  const removeCategory = useDeleteCategory();

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (next) flushPendingDeletes();
        else {
          categoryForm.reset();
        }
        setOpen(next);
      }}
      onAnimationEnd={(isOpen) => {
        if (!isOpen && pendingDelete.current) {
          pendingDelete.current = false;
          removeCategory(category);
        }
      }}
    >
      <DrawerTrigger asChild>
        <button className="flex h-15 w-full cursor-pointer items-center justify-between text-left">
          <div className="flex items-center gap-3.5">
            <span
              className="size-7 shrink-0 rounded-[7px]"
              style={{ backgroundColor: category.color }}
            />

            <div className="flex flex-col">
              <span className="text-task font-medium">{category.name}</span>

              {category.openCount > 0 && (
                <span className="text-muted-2 text-xs">
                  {category.openCount} open
                </span>
              )}
            </div>
          </div>

          <ChevronRight className="size-5" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <CategoryForm
          category={category}
          form={categoryForm}
          formId="form-edit-category"
          setOpen={setOpen}
          onDelete={handleDelete}
        />
      </DrawerContent>
    </Drawer>
  );
}
