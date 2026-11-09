import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";

import { Category } from "@/lib/generated/prisma/client";
import { CategoryFormValues } from "@/lib/schemas/categories";

import { categColors } from "@/lib/colors";
import { toast } from "sonner";
import { Button } from "../atoms/Button";

type NewCategoryProps = {
  query: string;
  onSelect: (id: string | null) => void;
};

export default function NewCategory({ query, onSelect }: NewCategoryProps) {
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
        toast.error("You already have a category with that name", {
          position: "top-center",
        });
      } else {
        toast.error("Couldn't create category", {
          position: "top-center",
        });
      }
    },
    onSuccess: (newCategory) => {
      queryClient.setQueryData<Category[]>(
        ["categories"],
        (old) => old && [...old, newCategory],
      );
      onSelect(newCategory.id);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  function onSubmit(values: CategoryFormValues) {
    const selected =
      categColors[Math.floor(Math.random() * categColors.length)];
    const payload = { ...values, color: selected };

    addCategory.mutate(payload);
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="flex w-full items-center justify-start"
      onClick={() => {
        onSubmit({ name: query });
      }}
      disabled={addCategory.isPending}
    >
      <Plus className="size-5 rounded-sm bg-green-600 p-0.5 text-white" />
      <span>Create "{query}"</span>
    </Button>
  );
}
